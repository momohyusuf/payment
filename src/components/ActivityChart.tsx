import { useState } from "react";
import type { Transaction } from "../lib/data.ts";
import { dailyActivity, money } from "../lib/finance.ts";
export default function ActivityChart({
  ledger,
  days,
}: {
  ledger: Transaction[];
  days: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const points = dailyActivity(ledger, days),
    max = Math.max(1, ...points.map((p) => Math.max(p.revenue, p.spending)));
  const width = 660,
    height = 180,
    step = width / points.length;
  const selected = hover === null ? null : points[hover];
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-medium">Money in. Money out.</h3>
        <div className="flex items-center gap-4 text-[10px] text-muted">
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-cobalt" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-1.5 rounded-full bg-[#b8c2de]" />
            Spending
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height + 24}`}
        className="w-full overflow-visible"
        role="img"
        aria-label={`Daily revenue and spending over ${days} days. Hover or focus a bar for exact amounts.`}
      >
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <line
              x1="0"
              x2={width}
              y1={i * 55}
              y2={i * 55}
              stroke="#e5e6ea"
              strokeDasharray="3 5"
            />
          </g>
        ))}
        {points.map((p, i) => {
          const x = i * step,
            barWidth = Math.max(2, step * 0.28);
          return (
            <g
              key={i}
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${p.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Africa/Lagos" })}, revenue ${money(p.revenue)}, spending ${money(p.spending)}`}
            >
              <rect
                x={x}
                y="0"
                width={step}
                height={height}
                fill={hover === i ? "#3155ec08" : "transparent"}
              />
              <rect
                x={x + step * 0.17}
                y={height - (p.revenue / max) * 160}
                width={barWidth}
                height={Math.max(2, (p.revenue / max) * 160)}
                rx="2"
                fill="#3155ec"
              />
              <rect
                x={x + step * 0.51}
                y={height - (p.spending / max) * 160}
                width={barWidth}
                height={Math.max(2, (p.spending / max) * 160)}
                rx="2"
                fill="#b8c2de"
              />
            </g>
          );
        })}
        {[0, Math.floor((days - 1) / 2), days - 1].map((i) => (
          <text
            key={i}
            x={i * step}
            y={height + 21}
            fill="#7c8085"
            fontSize="9"
            textAnchor={i === days - 1 ? "end" : "start"}
          >
            {points[i].date.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              timeZone: "Africa/Lagos",
            })}
          </text>
        ))}
      </svg>
      <p className="mt-3 min-h-5 text-[10px] text-muted" aria-live="polite">
        {selected
          ? `${selected.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Africa/Lagos" })}: ${money(selected.revenue)} in · ${money(selected.spending)} out`
          : "Daily activity in NGN · Hover or focus a bar to see the details."}
      </p>
    </div>
  );
}
