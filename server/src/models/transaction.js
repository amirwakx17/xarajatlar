import { all, get, run } from "../db.js";

const SESSION_DAYS = 30;

const SORTS = {
  date_desc: "t.date DESC, t.id DESC",
  date_asc: "t.date ASC, t.id ASC",
  amount_desc: "t.amount DESC, t.id DESC",
  amount_asc: "t.amount ASC, t.id ASC",
};

const MONTHS_SHORT = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

const SELECT_WITH_CATEGORY = `
  SELECT t.id, t.type, t.amount, t.note, t.date,
         t.category_id AS categoryId,
         c.name AS categoryName, c.color AS categoryColor
  FROM transactions t
  JOIN expense_categories c ON c.id = t.category_id
`;

function mapRow(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    type: row.type,
    amount: Number(row.amount),
    note: row.note,
    date: row.date,
    categoryId: Number(row.categoryId),
    categoryName: row.categoryName,
    categoryColor: row.categoryColor,
  };
}

function buildFilter(userId, { type, categoryId, month } = {}) {
  const where = ["t.user_id = ?"];
  const params = [userId];
  if (type === "income" || type === "expense") {
    where.push("t.type = ?");
    params.push(type);
  }
  if (Number.isInteger(categoryId) && categoryId > 0) {
    where.push("t.category_id = ?");
    params.push(categoryId);
  }
  if (month) {
    where.push("substr(t.date, 1, 7) = ?");
    params.push(month);
  }
  return { clause: where.join(" AND "), params };
}

export function list(userId, options = {}) {
  const { clause, params } = buildFilter(userId, options);
  const order = SORTS[options.sort] || SORTS.date_desc;
  return all(`${SELECT_WITH_CATEGORY} WHERE ${clause} ORDER BY ${order}`, params).map(mapRow);
}

export function recent(userId, limit = 8) {
  return all(`${SELECT_WITH_CATEGORY} WHERE t.user_id = ? ORDER BY t.date DESC, t.id DESC LIMIT ?`, [
    userId,
    limit,
  ]).map(mapRow);
}

export function findById(userId, id) {
  return mapRow(get(`${SELECT_WITH_CATEGORY} WHERE t.user_id = ? AND t.id = ?`, [userId, id]));
}

export function totals(userId, month) {
  const where = ["user_id = ?"];
  const params = [userId];
  if (month) {
    where.push("substr(date, 1, 7) = ?");
    params.push(month);
  }
  const row = get(
    `SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
     FROM transactions
     WHERE ${where.join(" AND ")}`,
    params
  );
  const income = Number(row.income);
  const expense = Number(row.expense);
  return { income, expense, balance: income - expense };
}

export function monthlySeries(userId, months = 6) {
  const now = new Date();
  const keys = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  }

  const rows = all(
    `SELECT substr(date, 1, 7) AS key, type, SUM(amount) AS total
     FROM transactions
     WHERE user_id = ? AND date >= ?
     GROUP BY key, type`,
    [userId, `${keys[0]}-01`]
  );

  const series = keys.map((key) => ({
    key,
    label: MONTHS_SHORT[Number(key.slice(5, 7)) - 1],
    income: 0,
    expense: 0,
  }));
  const byKey = new Map(series.map((item) => [item.key, item]));
  for (const row of rows) {
    const item = byKey.get(row.key);
    if (item) item[row.type] = Number(row.total);
  }
  return series;
}

export function byCategory(userId, month) {
  const where = ["t.user_id = ?", "t.type = 'expense'"];
  const params = [userId];
  if (month) {
    where.push("substr(t.date, 1, 7) = ?");
    params.push(month);
  }
  return all(
    `SELECT c.id, c.name, c.color, SUM(t.amount) AS total
     FROM transactions t
     JOIN expense_categories c ON c.id = t.category_id
     WHERE ${where.join(" AND ")}
     GROUP BY c.id
     ORDER BY total DESC`,
    params
  ).map((row) => ({
    id: Number(row.id),
    name: row.name,
    color: row.color,
    total: Number(row.total),
  }));
}

export function create(userId, { categoryId, type, amount, note, date }) {
  const result = run(
    "INSERT INTO transactions (user_id, category_id, type, amount, note, date) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, categoryId, type, amount, note, date]
  );
  return findById(userId, result.lastInsertRowid);
}

export function update(userId, id, { categoryId, type, amount, note, date }) {
  const result = run(
    `UPDATE transactions
     SET category_id = ?, type = ?, amount = ?, note = ?, date = ?
     WHERE id = ? AND user_id = ?`,
    [categoryId, type, amount, note, date, id, userId]
  );
  return result.changes > 0 ? findById(userId, id) : null;
}

export function remove(userId, id) {
  return run("DELETE FROM transactions WHERE id = ? AND user_id = ?", [id, userId]).changes > 0;
}

export { SORTS, SESSION_DAYS };
