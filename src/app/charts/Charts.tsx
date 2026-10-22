type BarPoint = { label: string; value: number; tone?: string };

export function EmptyChart({ children }: { children: string }) {
  return <p className="empty chart-empty">{children}</p>;
}

export function Ring({ value, label }: { value: number; label: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = (clamped / 100) * c;
  return (
    <svg className="ring" viewBox="0 0 108 108" role="img" aria-label={label}>
      <circle cx="54" cy="54" r={r} className="ring-track" />
      <circle
        cx="54"
        cy="54"
        r={r}
        className="ring-value"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 54 54)"
      />
      <text x="54" y="58" textAnchor="middle" className="ring-text">
        {Math.round(clamped)}
      </text>
    </svg>
  );
}

export function BarChart({
  points,
  ariaLabel,
  format,
}: {
  points: BarPoint[];
  ariaLabel: string;
  format?: (n: number) => string;
}) {
  const max = Math.max(...points.map((p) => p.value), 0);
  if (max <= 0) return <EmptyChart>No values in this window yet.</EmptyChart>;
  const w = 240;
  const h = 88;
  const gap = 6;
  const barW = (w - gap * (points.length + 1)) / points.length;
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel}>
      {points.map((p, i) => {
        const bh = (p.value / max) * 64;
        const x = gap + i * (barW + gap);
        const y = 70 - bh;
        return (
          <g key={p.label}>
            <rect x={x} y={y} width={barW} height={bh} rx="3" className="chart-bar" />
            <text x={x + barW / 2} y="84" textAnchor="middle" className="chart-axis">
              {p.label}
            </text>
            <title>
              {p.label}: {format ? format(p.value) : p.value}
            </title>
          </g>
        );
      })}
    </svg>
  );
}

export function Sparkline({
  values,
  ariaLabel,
}: {
  values: number[];
  ariaLabel: string;
}) {
  if (values.length < 2) return <EmptyChart>Need at least two points for a trend.</EmptyChart>;
  const w = 240;
  const h = 72;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (w - 8) + 4;
    const y = h - 10 - ((v - min) / span) * (h - 20);
    return `${x},${y}`;
  });
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel}>
      <polyline points={pts.join(" ")} className="spark" fill="none" />
    </svg>
  );
}

export function StackBars({
  items,
}: {
  items: { label: string; value: number; tone?: "accent" | "cyan" }[];
}) {
  if (!items.length) return <EmptyChart>No recorded durations in this window.</EmptyChart>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div
      className="stack-bars"
      role="img"
      aria-label={items.map((i) => `${i.label} ${i.value}`).join(", ")}
    >
      {items.map((i) => (
        <div className="stack-row" key={i.label}>
          <span>{i.label}</span>
          <div className="stack-track">
            <div
              className={`stack-fill ${i.tone === "cyan" ? "cyan" : "accent"}`}
              style={{ width: `${(i.value / max) * 100}%` }}
            />
          </div>
          <strong>{i.value}</strong>
        </div>
      ))}
    </div>
  );
}
