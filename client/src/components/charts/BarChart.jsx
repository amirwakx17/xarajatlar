import { formatSom } from "../../lib/money.js";

export default function BarChart({ series }) {
  const max = Math.max(1, ...series.flatMap((item) => [item.income, item.expense]));
  const width = 560;
  const height = 250;
  const padX = 10;
  const top = 16;
  const bottom = 36;
  const chartWidth = width - padX * 2;
  const chartHeight = height - top - bottom;
  const groupWidth = chartWidth / series.length;
  const barWidth = Math.min(22, groupWidth / 3.6);
  const gap = 8;

  return (
    <div className="chart-box">
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Oylik kirim va chiqim diagrammasi">
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padX}
            x2={width - padX}
            y1={top + chartHeight * (1 - ratio)}
            y2={top + chartHeight * (1 - ratio)}
            className="grid-line"
          />
        ))}
        <line x1={padX} x2={width - padX} y1={top + chartHeight} y2={top + chartHeight} className="axis-line" />

        {series.map((item, index) => {
          const centerX = padX + index * groupWidth + groupWidth / 2;
          const incomeHeight = (item.income / max) * chartHeight;
          const expenseHeight = (item.expense / max) * chartHeight;
          const incomeX = centerX - barWidth - gap / 2;
          const expenseX = centerX + gap / 2;

          return (
            <g key={item.key}>
              <rect
                x={incomeX}
                y={top + chartHeight - incomeHeight}
                width={barWidth}
                height={incomeHeight}
                rx="4"
                fill="#1f9d6b"
              >
                <title>{`${item.label}: kirim ${formatSom(item.income)}`}</title>
              </rect>
              <rect
                x={expenseX}
                y={top + chartHeight - expenseHeight}
                width={barWidth}
                height={expenseHeight}
                rx="4"
                fill="#e1622f"
              >
                <title>{`${item.label}: chiqim ${formatSom(item.expense)}`}</title>
              </rect>
              <text x={centerX} y={height - 12} textAnchor="middle" className="axis-label">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="chart-legend">
        <span>
          <i style={{ background: "#1f9d6b" }} />
          Kirim
        </span>
        <span>
          <i style={{ background: "#e1622f" }} />
          Chiqim
        </span>
      </div>
    </div>
  );
}
