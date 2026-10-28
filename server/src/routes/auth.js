import { Router } from "express";
import * as User from "../models/user.js";
import { endSession, hashPassword, requireAuth, startSession, verifyPassword } from "../auth.js";
import { cleanText, isEmail, isPassword } from "../lib/validate.js";

const router = Router();

router.post("/register", (req, res) => {
  const email = cleanText(req.body?.email, 120).toLowerCase();
  const password = req.body?.password;

  if (!isEmail(email)) return res.status(400).json({ error: "email" });
  if (!isPassword(password)) return res.status(400).json({ error: "password" });
  if (User.findByEmail(email)) return res.status(409).json({ error: "email_taken" });

  const user = User.createUser(email, hashPassword(password));
  startSession(res, user.id);
  res.status(201).json({ user: User.toPublic(user) });
});

router.post("/login", (req, res) => {
  const email = cleanText(req.body?.email, 120).toLowerCase();
  const password = req.body?.password;

  const user = User.findByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  startSession(res, user.id);
  res.json({ user: User.toPublic(user) });
});

router.post("/logout", (req, res) => {
  endSession(req, res);
  res.status(204).end();
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: User.toPublic(req.user) });
});

export default router;
