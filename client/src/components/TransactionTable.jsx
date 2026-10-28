import { formatDate } from "../lib/date.js";
import { formatSom } from "../lib/money.js";

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" strokeLinejoin="round" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 7h14M10 7V5h4v2m-7 0 1 13h8l1-13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TransactionTable({ items, onEdit, onDelete, emptyText = "Hozircha yozuvlar yo'q." }) {
  if (items.length === 0) {
    return <div className="empty">{emptyText}</div>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Sana</th>
            <th>Izoh</th>
            <th>Kategoriya</th>
            <th className="right">Summa</th>
            <th aria-label="Amallar" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="nowrap">{formatDate(item.date)}</td>
              <td className="note-cell">{item.note || <span className="muted">—</span>}</td>
              <td>
                <span className="chip">
                  <i className="dot" style={{ background: item.categoryColor }} />
                  {item.categoryName}
                </span>
              </td>
              <td className={`right amount ${item.type}`}>
                {item.type === "income" ? "+" : "−"}
                {formatSom(item.amount)}
              </td>
              <td className="actions">
                <button type="button" className="icon-btn" title="Tahrirlash" onClick={() => onEdit(item)}>
                  <EditIcon />
                </button>
                <button type="button" className="icon-btn danger" title="O'chirish" onClick={() => onDelete(item)}>
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
