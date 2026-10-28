import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const items = [
  {
    to: "/",
    label: "Bosh sahifa",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.5Z" />
      </svg>
    ),
  },
  {
    to: "/transactions",
    label: "Tranzaksiyalar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16M4 7l4-4M4 7l4 4M20 17H4m16 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: "/categories",
    label: "Kategoriyalar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="7" height="7" rx="1.6" />
        <rect x="13" y="4" width="7" height="7" rx="1.6" />
        <rect x="4" y="13" width="7" height="7" rx="1.6" />
        <rect x="13" y="13" width="7" height="7" rx="1.6" />
      </svg>
    ),
  },
];

export default function Sidebar({ onLogout }) {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">X</span>
        <span>
          Xarajatlar
          <small>hisoblagich</small>
        </span>
      </div>

      <nav className="nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-box">
          <span className="avatar">{(user?.email || "?").slice(0, 1).toUpperCase()}</span>
          <span className="user-email" title={user?.email}>
            {user?.email}
          </span>
        </div>
        <button type="button" className="btn btn-ghost btn-block" onClick={onLogout}>
          Chiqish
        </button>
      </div>
    </aside>
  );
}
