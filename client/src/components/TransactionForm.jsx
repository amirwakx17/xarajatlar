import { useEffect, useMemo, useState } from "react";
import { todayISO } from "../lib/date.js";
import { errorText } from "../lib/errors.js";
import { formatAmountInput, parseAmountInput } from "../lib/money.js";

export default function TransactionForm({ categories, initial = null, defaultType = "expense", onSubmit, onCancel }) {
  const [type, setType] = useState(initial?.type || defaultType);
  const [amountText, setAmountText] = useState(initial ? formatAmountInput(initial.amount) : "");
  const [categoryId, setCategoryId] = useState(initial ? String(initial.categoryId) : "");
  const [date, setDate] = useState(initial?.date || todayISO());
  const [note, setNote] = useState(initial?.note || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const options = useMemo(() => categories.filter((category) => category.kind === type), [categories, type]);

  useEffect(() => {
    if (!options.some((category) => String(category.id) === categoryId)) {
      setCategoryId(options[0] ? String(options[0].id) : "");
    }
  }, [options, categoryId]);

  async function handleSubmit(event) {
    event.preventDefault();
    const amount = parseAmountInput(amountText);

    if (!amount) return setError("Summani kiriting.");
    if (!categoryId) return setError("Kategoriyani tanlang.");
    if (!date) return setError("Sanani tanlang.");

    setError("");
    setSaving(true);
    try {
      await onSubmit({
        type,
        amount,
        categoryId: Number(categoryId),
        date,
        note: note.trim(),
      });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="segmented">
        <button
          type="button"
          className={type === "expense" ? "active expense" : ""}
          onClick={() => setType("expense")}
        >
          Chiqim
        </button>
        <button
          type="button"
          className={type === "income" ? "active income" : ""}
          onClick={() => setType("income")}
        >
          Kirim
        </button>
      </div>

      <label className="field">
        <span>Summa (so'm)</span>
        <input
          inputMode="numeric"
          placeholder="0"
          value={amountText}
          onChange={(event) => setAmountText(formatAmountInput(event.target.value))}
          autoFocus
        />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Kategoriya</span>
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            {options.length === 0 && <option value="">Kategoriya yo'q</option>}
            {options.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Sana</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>

      <label className="field">
        <span>Izoh</span>
        <input
          maxLength={120}
          placeholder="Masalan: oylik oziq-ovqat"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Bekor qilish
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saqlanmoqda…" : "Saqlash"}
        </button>
      </div>
    </form>
  );
}
