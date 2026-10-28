import { get, run, tx } from "../db.js";
import { DEFAULT_CATEGORIES } from "../defaults.js";

export function createUser(email, passwordHash) {
  return tx(() => {
    const result = run("INSERT INTO users (email, password_hash) VALUES (?, ?)", [
      email,
      passwordHash,
    ]);
    const userId = result.lastInsertRowid;
    const insertCategory = "INSERT INTO expense_categories (user_id, name, color, kind) VALUES (?, ?, ?, ?)";
    for (const category of DEFAULT_CATEGORIES) {
      run(insertCategory, [userId, category.name, category.color, category.kind]);
    }
    return findById(userId);
  });
}

export function findByEmail(email) {
  return get("SELECT * FROM users WHERE email = ?", [email]);
}

export function findById(id) {
  return get("SELECT id, email, created_at FROM users WHERE id = ?", [id]);
}

export function toPublic(user) {
  if (!user) return null;
  return { id: user.id, email: user.email };
}
