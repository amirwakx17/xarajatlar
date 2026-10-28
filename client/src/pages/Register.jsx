import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { errorText } from "../lib/errors.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) return setError("Parol kamida 6 belgidan iborat bo'lishi kerak.");
    if (password !== confirm) return setError("Parollar mos kelmadi.");

    setBusy(true);
    try {
      await register(email, password);
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

        <h1>Ro'yxatdan o'tish</h1>
        <p className="muted">Yangi hisob yaratib, xarajatlaringizni yuritishni boshlang.</p>

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
              autoComplete="new-password"
              placeholder="Kamida 6 belgi"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Parolni tasdiqlang</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Parolni qayta kiriting"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Yaratilmoqda…" : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="auth-switch muted">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
