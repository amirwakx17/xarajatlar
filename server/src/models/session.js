import { get, run } from "../db.js";

export function createSession(tokenHash, userId, expiresAt) {
  run("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)", [
    tokenHash,
    userId,
    expiresAt,
  ]);
}

export function findUserByToken(tokenHash) {
  return get(
    `SELECT u.id, u.email
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > datetime('now')`,
    [tokenHash]
  );
}

export function deleteSession(tokenHash) {
  run("DELETE FROM sessions WHERE token_hash = ?", [tokenHash]);
}

export function deleteExpired() {
  run("DELETE FROM sessions WHERE expires_at <= datetime('now')");
}
