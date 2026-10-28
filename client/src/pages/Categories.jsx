import { useEffect, useState } from "react";
import { api } from "../api.js";
import { errorText } from "../lib/errors.js";

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 7h14M10 7V5h4v2m-7 0 1 13h8l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const GROUPS = [
  { kind: "expense", title: "Chiqim kategoriyalari" },
  { kind: "income", title: "Kirim kategoriyalari" },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [kind, setKind] = useState("expense");
  const [color, setColor] = useState("#4361ee");
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const data = await api("/categories");
      setCategories(data.categories);
    } catch (err) {
      setError(errorText(err));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError("Kategoriya nomini kiriting.");

    setError("");
    setSaving(true);
    try {
      await api("/categories", { method: "POST", body: { name: trimmed, kind, color } });
      setName("");
      setFlash("Kategoriya qo'shildi.");
      await load();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`"${category.name}" kategoriyasini o'chirmoqchimisiz?`)) return;
    setError("");
    setFlash("");
    try {
      await api(`/categories/${category.id}`, { method: "DELETE" });
      setFlash("Kategoriya o'chirildi.");
      await load();
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <>
      {flash && <div className="flash success">{flash}</div>}
      {error && <div className="flash error">{error}</div>}

      <section className="card">
        <header className="card-header">
          <div>
            <h2>Yangi kategoriya</h2>
            <p className="muted">Nom, tur va rangni tanlang</p>
          </div>
        </header>
        <form className="filters" onSubmit={handleCreate}>
          <label className="field grow">
            <span>Nomi</span>
            <input
              maxLength={40}
              placeholder="Masalan: Sport"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Turi</span>
            <select value={kind} onChange={(event) => setKind(event.target.value)}>
              <option value="expense">Chiqim</option>
              <option value="income">Kirim</option>
            </select>
          </label>

          <label className="field field-color">
            <span>Rangi</span>
            <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
          </label>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saqlanmoqda…" : "Qo'shish"}
          </button>
        </form>
      </section>

      {GROUPS.map((group) => {
        const groupCategories = categories.filter((category) => category.kind === group.kind);
        return (
          <section className="card" key={group.kind}>
            <header className="card-header">
              <div>
                <h2>{group.title}</h2>
                <p className="muted">{groupCategories.length} ta</p>
              </div>
            </header>

            <ul className="category-list">
              {groupCategories.length === 0 && <li className="muted">Kategoriyalar yo'q.</li>}
              {groupCategories.map((category) => (
                <li key={category.id}>
                  <span className="dot" style={{ background: category.color }} />
                  <span className="category-name">{category.name}</span>
                  <span className="muted small">{category.transactionCount} ta yozuv</span>
                  <button
                    type="button"
                    className="icon-btn danger"
                    title="O'chirish"
                    onClick={() => handleDelete(category)}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
