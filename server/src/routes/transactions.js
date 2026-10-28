import { Router } from "express";
import * as Transaction from "../models/transaction.js";
import * as Category from "../models/expenseCategory.js";
import { cleanText, isValidDate, isValidMonth, parseAmount } from "../lib/validate.js";

const router = Router();

function parseTransactionInput(userId, body) {
  const type = body?.type;
  const amount = parseAmount(body?.amount);
  const date = body?.date;
  const categoryId = Number(body?.categoryId);
  const note = cleanText(body?.note, 120);

  if (type !== "income" && type !== "expense") return { error: "type" };
  if (amount === null) return { error: "amount" };
  if (!isValidDate(date)) return { error: "date" };
  if (!Number.isInteger(categoryId) || categoryId <= 0) return { error: "category" };

  const category = Category.findById(userId, categoryId);
  if (!category || category.kind !== type) return { error: "category" };

  return { data: { type, amount, date, categoryId, note } };
}

router.get("/", (req, res) => {
  const { sort, type, categoryId, month } = req.query;

  if (sort !== undefined && !Transaction.SORTS[sort]) {
    return res.status(400).json({ error: "sort" });
  }
  if (type !== undefined && type !== "income" && type !== "expense") {
    return res.status(400).json({ error: "type" });
  }
  if (month !== undefined && month !== "" && !isValidMonth(month)) {
    return res.status(400).json({ error: "month" });
  }

  const parsedCategory = categoryId === undefined || categoryId === "" ? undefined : Number(categoryId);
  if (parsedCategory !== undefined && (!Number.isInteger(parsedCategory) || parsedCategory <= 0)) {
    return res.status(400).json({ error: "category" });
  }

  const transactions = Transaction.list(req.user.id, {
    sort,
    type,
    categoryId: parsedCategory,
    month: month || undefined,
  });
  res.json({ transactions });
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: "not_found" });

  const transaction = Transaction.findById(req.user.id, id);
  if (!transaction) return res.status(404).json({ error: "not_found" });
  res.json({ transaction });
});

router.post("/", (req, res) => {
  const input = parseTransactionInput(req.user.id, req.body);
  if (input.error) return res.status(400).json({ error: input.error });

  const transaction = Transaction.create(req.user.id, input.data);
  res.status(201).json({ transaction });
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: "not_found" });

  const input = parseTransactionInput(req.user.id, req.body);
  if (input.error) return res.status(400).json({ error: input.error });

  const transaction = Transaction.update(req.user.id, id, input.data);
  if (!transaction) return res.status(404).json({ error: "not_found" });
  res.json({ transaction });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: "not_found" });

  if (!Transaction.remove(req.user.id, id)) return res.status(404).json({ error: "not_found" });
  res.status(204).end();
});

export default router;
