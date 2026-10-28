import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { formatLongDate } from "../lib/date.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const TITLES = {
  "/": "Bosh sahifa",
  "/transactions": "Tranzaksiyalar",
  "/categories": "Kategoriyalar",
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const title = TITLES[location.pathname] || "Xarajatlar";

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      // sessiya baribir tozalanadi
    }
  }

  return (
    <div className="app-shell">
      <Sidebar onLogout={handleLogout} />
      <div className="main">
        <Topbar title={title} subtitle={formatLongDate()} onNew={() => navigate("/transactions?new=1")} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
