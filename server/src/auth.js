import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import * as sessionModel from "./models/session.js";

const SESSION_COOKIE = "sid";
const SESSION_DAYS = 30;

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password, stored) {
  const [scheme, salt, hash] = String(stored ?? "").split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function expiryTimestamp() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}

export function startSession(res, userId) {
  const token = randomBytes(32).toString("hex");
  sessionModel.createSession(sha256(token), userId, expiryTimestamp());
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

export function endSession(req, res) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) sessionModel.deleteSession(sha256(token));
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: "lax", path: "/" });
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  const user = sessionModel.findUserByToken(sha256(token));
  if (!user) {
    res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: "lax", path: "/" });
    return res.status(401).json({ error: "unauthorized" });
  }
  req.user = user;
  next();
}
