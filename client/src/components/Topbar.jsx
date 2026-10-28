export default function Topbar({ title, subtitle, onNew }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
      </div>
      <button type="button" className="btn btn-primary" onClick={onNew}>
        <span className="btn-plus">+</span>
        Yangi yozuv
      </button>
    </header>
  );
}
