export default function StatCard({ label, value, tone = "neutral", icon }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <span className="stat-icon">{icon}</span>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </article>
  );
}
