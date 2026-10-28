import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import Filters from "../components/Filters.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import { errorText } from "../lib/errors.js";

const EMPTY_FILTERS = { type: "", categoryId: "", month: "", sort: "date_desc" };

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadCategories = useCallback(async () => {
    try {
      const data = await api("/categories");
      setCategories(data.categories);
    } catch (err) {
      setError(errorText(err));
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.month) params.set("month", filters.month);
    if (filters.sort) params.set("sort", filters.sort);
    try {
      const data = await api(`/transactions?${params.toString()}`);
      setItems(data.transactions);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    const newParam = searchParams.get("new");
    const editParam = searchParams.get("edit");

    if (newParam === "1") {
      setEditing(null);
      setFormOpen(true);
      setSearchParams({}, { replace: true });
      return;
    }

    if (editParam) {
      setSearchParams({}, { replace: true });
      api(`/transactions/${Number(editParam)}`)
        .then((data) => {
          setEditing(data.transaction);
          setFormOpen(true);
        })
        .catch((err) => setError(errorText(err)));
    }
  }, [searchParams, setSearchParams]);

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function handleSave(payload) {
    if (editing) {
      await api(`/transactions/${editing.id}`, { method: "PUT", body: payload });
    } else {
      await api("/transactions", { method: "POST", body: payload });
    }
    closeForm();
    setFlash(editing ? "Yozuv yangilandi." : "Yozuv qo'shildi.");
    await loadTransactions();
  }

  async function handleDelete(item) {
    if (!window.confirm("Bu yozuvni o'chirmoqchimisiz?")) return;
    try {
      await api(`/transactions/${item.id}`, { method: "DELETE" });
      setFlash("Yozuv o'chirildi.");
      await loadTransactions();
    } catch (err) {
      setError(errorText(err));
    }
  }

  return (
    <>
      {flash && <div className="flash success">{flash}</div>}
      {error && <div className="flash error">{error}</div>}

      <section className="card">
        <Filters filters={filters} categories={categories} onChange={setFilters} />
      </section>

      <section className="card">
        <header className="card-header">
          <div>
            <h2>Tranzaksiyalar</h2>
            <p className="muted">{items.length} ta yozuv</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <span className="btn-plus">+</span>
            Yangi yozuv
          </button>
        </header>

        {loading ? (
          <div className="page-loader">Yuklanmoqda…</div>
        ) : (
          <TransactionTable
            items={items}
            onEdit={(item) => {
              setEditing(item);
              setFormOpen(true);
            }}
            onDelete={handleDelete}
            emptyText="Filtrga mos yozuv topilmadi."
          />
        )}
      </section>

      {formOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div className="modal">
            <header className="modal-header">
              <h2>{editing ? "Yozuvni tahrirlash" : "Yangi yozuv"}</h2>
              <button type="button" className="icon-btn" onClick={closeForm} title="Yopish">
                ×
              </button>
            </header>
            <TransactionForm
              categories={categories}
              initial={editing}
              defaultType={filters.type || "expense"}
              onSubmit={handleSave}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}
    </>
  );
}
