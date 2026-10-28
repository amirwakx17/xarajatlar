import { formatSom } from "../../lib/money.js";

export default function DonutChart({ data, total }) {
  const size = 190;
  const center = size / 2;
  const radius = 66;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((item) => {
    const fraction = total > 0 ? item.total / total : 0;
    const length = fraction * circumference;
    const segment = { ...item, length, offset };
    offset += length;
    return segment;
  });

  return (
    <div className="donut-wrap">
      <div className="donut-graphic">
        <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Chiqimlar kategoriyalar bo'yicha">
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#eef1f6" strokeWidth={strokeWidth} />
          {segments.map((segment) => (
            <circle
              key={segment.id}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.length} ${circumference - segment.length}`}
              strokeDashoffset={-segment.offset}
              transform={`rotate(-90 ${center} ${center})`}
            >
              <title>{`${segment.name}: ${formatSom(segment.total)}`}</title>
            </circle>
          ))}
        </svg>
        <div className="donut-center">
          <span>Jami chiqim</span>
          <strong>{formatSom(total)}</strong>
        </div>
      </div>

      <ul className="donut-legend">
        {data.length === 0 && <li className="muted">Hozircha chiqimlar yo'q.</li>}
        {data.map((item) => (
          <li key={item.id}>
            <span className="dot" style={{ background: item.color }} />
            <span className="legend-name">{item.name}</span>
            <span className="legend-value">{formatSom(item.total)}</span>
            <span className="legend-percent">{total ? Math.round((item.total / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
