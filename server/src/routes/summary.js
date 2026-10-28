import { Router } from "express";
import * as Transaction from "../models/transaction.js";
import { isValidMonth } from "../lib/validate.js";

const router = Router();

router.get("/", (req, res) => {
  const month = req.query.month || undefined;
  if (month !== undefined && !isValidMonth(month)) {
    return res.status(400).json({ error: "month" });
  }

  res.json({
    totals: Transaction.totals(req.user.id, month),
    monthlySeries: Transaction.monthlySeries(req.user.id, 6),
    byCategory: Transaction.byCategory(req.user.id, month),
    recent: Transaction.recent(req.user.id, 8),
  });
});

export default router;
