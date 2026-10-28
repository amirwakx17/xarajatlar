import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { errorText } from "../lib/errors.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand">
          <span className="brand-mark">X</span>
          <span>
            Xarajatlar
            <small>hisoblagich</small>
          </span>
        </div>

        <h1>Kirish</h1>
        <p className="muted">Hisobingizga kirib xarajatlaringizni kuzatib boring.</p>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="siz@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Parol</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Kamida 6 belgi"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Kirilmoqda…" : "Kirish"}
          </button>
        </form>

        <p className="auth-switch muted">
          Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
}
