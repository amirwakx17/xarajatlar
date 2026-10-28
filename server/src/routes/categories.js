import { Router } from "express";
import * as Category from "../models/expenseCategory.js";
import { cleanText, isValidColor } from "../lib/validate.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ categories: Category.allForUser(req.user.id) });
});

router.post("/", (req, res) => {
  const name = cleanText(req.body?.name, 40);
  const kind = req.body?.kind;
  const color = isValidColor(req.body?.color) ? req.body.color : "#7c746b";

  if (!name) return res.status(400).json({ error: "name" });
  if (kind !== "income" && kind !== "expense") return res.status(400).json({ error: "kind" });
  if (Category.nameTaken(req.user.id, name, kind)) {
    return res.status(409).json({ error: "exists" });
  }

  const category = Category.create(req.user.id, { name, color, kind });
  res.status(201).json({ category });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(404).json({ error: "not_found" });

  const category = Category.findById(req.user.id, id);
  if (!category) return res.status(404).json({ error: "not_found" });
  if (Category.usageCount(req.user.id, id) > 0) {
    return res.status(409).json({ error: "in_use" });
  }

  try {
    Category.remove(req.user.id, id);
  } catch (error) {
    if (error?.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return res.status(409).json({ error: "in_use" });
    }
    throw error;
  }
  res.status(204).end();
});

export default router;
