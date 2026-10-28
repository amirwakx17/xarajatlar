import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import BarChart from "../components/charts/BarChart.jsx";
import DonutChart from "../components/charts/DonutChart.jsx";
import StatCard from "../components/StatCard.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import { errorText } from "../lib/errors.js";
import { formatSom } from "../lib/money.js";

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10h18M16 14.5h2" strokeLinecap="round" />
    </svg>
  );
}

function InIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 4v14m0 0-5-5m5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20V6m0 0-5 5m5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setData(await api("/summary"));
    } catch (err) {
      setError(errorText(err));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(item) {
    if (!window.confirm("Bu yozuvni o'chirmoqchimisiz?")) return;
    try {
      await api(`/transactions/${item.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(errorText(err));
    }
  }

  if (!data) {
    return error ? <div className="empty">{error}</div> : <div className="page-loader">Yuklanmoqda…</div>;
  }

  const { totals, monthlySeries, byCategory, recent } = data;

  return (
    <>
      <section className="stat-grid">
        <StatCard
          tone="accent"
          label="Jami balans"
          value={formatSom(totals.balance)}
          icon={<WalletIcon />}
        />
        <StatCard tone="income" label="Jami kirim" value={formatSom(totals.income)} icon={<InIcon />} />
        <StatCard tone="expense" label="Jami chiqim" value={formatSom(totals.expense)} icon={<OutIcon />} />
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <header className="card-header">
            <div>
              <h2>Oylik ko'rinish</h2>
              <p className="muted">Oxirgi 6 oy</p>
            </div>
          </header>
          <BarChart series={monthlySeries} />
        </article>

        <article className="card">
          <header className="card-header">
            <div>
              <h2>Kategoriyalar bo'yicha</h2>
              <p className="muted">Chiqimlar taqsimoti</p>
            </div>
          </header>
          <DonutChart data={byCategory} total={totals.expense} />
        </article>
      </section>

      <section className="card">
        <header className="card-header">
          <div>
            <h2>Oxirgi yozuvlar</h2>
            <p className="muted">Eng yangi 8 ta</p>
          </div>
          <Link className="btn btn-ghost" to="/transactions">
            Barchasini ko'rish
          </Link>
        </header>
        <TransactionTable
          items={recent}
          onEdit={(item) => navigate(`/transactions?edit=${item.id}`)}
          onDelete={handleDelete}
          emptyText="Hozircha yozuvlar yo'q. Birinchi yozuvni qo'shing."
        />
      </section>

      {error && <div className="flash error">{error}</div>}
    </>
  );
}
