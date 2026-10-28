import { all, get, run } from "../db.js";

const SELECT_CATEGORY = `
  SELECT c.id, c.name, c.color, c.kind, COUNT(t.id) AS transactionCount
  FROM expense_categories c
  LEFT JOIN transactions t ON t.category_id = c.id
`;

function mapRow(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    name: row.name,
    color: row.color,
    kind: row.kind,
    transactionCount: Number(row.transactionCount ?? 0),
  };
}

export function allForUser(userId) {
  return all(
    `${SELECT_CATEGORY}
     WHERE c.user_id = ?
     GROUP BY c.id
     ORDER BY CASE c.kind WHEN 'expense' THEN 0 ELSE 1 END, c.name COLLATE NOCASE`,
    [userId]
  ).map(mapRow);
}

export function byKind(userId, kind) {
  return allForUser(userId).filter((category) => category.kind === kind);
}

export function findById(userId, id) {
  return mapRow(
    get(
      `${SELECT_CATEGORY}
       WHERE c.user_id = ? AND c.id = ?
       GROUP BY c.id`,
      [userId, id]
    )
  );
}

export function create(userId, { name, color, kind }) {
  const result = run("INSERT INTO expense_categories (user_id, name, color, kind) VALUES (?, ?, ?, ?)", [
    userId,
    name,
    color,
    kind,
  ]);
  return findById(userId, result.lastInsertRowid);
}

export function remove(userId, id) {
  return run("DELETE FROM expense_categories WHERE id = ? AND user_id = ?", [id, userId]).changes > 0;
}

export function usageCount(userId, id) {
  const row = get("SELECT COUNT(*) AS count FROM transactions WHERE user_id = ? AND category_id = ?", [
    userId,
    id,
  ]);
  return Number(row.count);
}

export function nameTaken(userId, name, kind) {
  const row = get(
    "SELECT 1 AS taken FROM expense_categories WHERE user_id = ? AND kind = ? AND lower(name) = lower(?)",
    [userId, kind, name]
  );
  return Boolean(row);
}
