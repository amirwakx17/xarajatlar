import { get, tx } from "./db.js";
import { hashPassword } from "./auth.js";
import { createUser } from "./models/user.js";
import * as Category from "./models/expenseCategory.js";
import * as Transaction from "./models/transaction.js";

const DEMO_EMAIL = "demo@xarajat.uz";
const DEMO_PASSWORD = "secret123";

function isoDate(monthOffset, day) {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, Math.min(day, 28));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function ensureDemoData() {
  const users = Number(get("SELECT COUNT(*) AS count FROM users").count);
  if (users > 0) return false;

  const user = createUser(DEMO_EMAIL, hashPassword(DEMO_PASSWORD));
  const categories = Category.allForUser(user.id);
  const categoryId = (name) => {
    const category = categories.find((item) => item.name === name);
    if (!category) throw new Error(`Demo kategoriya topilmadi: ${name}`);
    return category.id;
  };

  const rows = [
    { type: "income", name: "Ish haqi", amount: 6500000, date: isoDate(0, 5), note: "Oylik maosh" },
    { type: "expense", name: "Uy-joy", amount: 1500000, date: isoDate(0, 3), note: "Ijara" },
    { type: "expense", name: "Oziq-ovqat", amount: 450000, date: isoDate(0, 7), note: "Haftalik xarid" },
    { type: "expense", name: "Transport", amount: 120000, date: isoDate(0, 10), note: "Yoqilg'i" },
    { type: "expense", name: "Kommunal", amount: 300000, date: isoDate(0, 12), note: "Elektr va suv" },
    { type: "expense", name: "Sog'liq", amount: 180000, date: isoDate(0, 18), note: "Dorixona" },
    { type: "income", name: "Frilans", amount: 1200000, date: isoDate(-1, 20), note: "Loyiha uchun to'lov" },
    { type: "expense", name: "Kiyim-kechak", amount: 600000, date: isoDate(-1, 25), note: "Kuzgi kiyim" },
    { type: "expense", name: "Ko'ngilochar", amount: 250000, date: isoDate(-1, 28), note: "Kino va kafe" },
  ];

  tx(() => {
    for (const row of rows) {
      Transaction.create(user.id, {
        categoryId: categoryId(row.name),
        type: row.type,
        amount: row.amount,
        date: row.date,
        note: row.note,
      });
    }
  });

  return true;
}
