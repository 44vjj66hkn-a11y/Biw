"use client";

import { useState } from "react";
import { formatMoney, formatPercent } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { MonthBucket } from "@/lib/types";

/**
 * Barras empilhadas: custo + lucro = faturamento do mês.
 *
 * Duas séries de mesma unidade num único eixo. As cores passaram no
 * validador de daltonismo e contraste; a legenda e o rótulo do último
 * mês garantem que a leitura não dependa só da cor.
 */

const BASE = 200;
const PLOT = 180;
const BW = 56;
const GAP = 3;
const VIEW_W = 700;
const VIEW_H = 250;

export function CostProfitChart({ months }: { months: MonthBucket[] }) {
  const { lang, t } = useApp();
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(30000, ...months.map((m) => m.revenue));
  const step = (VIEW_W - 90) / months.length;
  const x0 = 60 + (step - BW) / 2;

  const monthLabel = (key: string) =>
    new Date(`${key}-15T12:00:00`).toLocaleDateString(
      lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR",
      { month: "short" },
    );

  const gridValues = [0, max / 3, (max * 2) / 3, max];

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label={t("Custos e lucro por mês")}>
        <g stroke="var(--border)" strokeWidth="1">
          {gridValues.map((v, i) => {
            const y = BASE - (v / max) * PLOT;
            return (
              <line
                key={i}
                x1="60"
                y1={y}
                x2={VIEW_W - 24}
                y2={y}
                strokeDasharray={i === 0 ? undefined : "3 5"}
              />
            );
          })}
        </g>

        <g fill="var(--faint)" fontSize="12" textAnchor="end" className="num">
          {gridValues.map((v, i) => (
            <text key={i} x="52" y={BASE - (v / max) * PLOT + 4}>
              {v === 0 ? "0" : `${Math.round(v / 1000)}k`}
            </text>
          ))}
        </g>

        {months.map((m, i) => {
          const x = x0 + i * step;
          const hc = (m.cost / max) * PLOT;
          const hp = (m.profit / max) * PLOT;
          const yc = BASE - hc;
          const yp = yc - GAP - hp;
          const last = i === months.length - 1;
          return (
            <g key={m.key}>
              <rect x={x} y={yc} width={BW} height={hc} fill="var(--chart-custo)" />
              <path
                d={roundedTop(x, yp, BW, hp, 4)}
                fill="var(--chart-lucro)"
              />
              {last && (
                <text
                  x={x + BW / 2}
                  y={yp - 10}
                  textAnchor="middle"
                  fill="var(--text)"
                  fontSize="13"
                  fontWeight="800"
                  className="num"
                >
                  {formatMoney(m.revenue)}
                </text>
              )}
              <rect
                x={x - 10}
                y={14}
                width={BW + 20}
                height={BASE - 14}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${monthLabel(m.key)}: ${t("Custos")} ${formatMoney(m.cost)}, ${t("Lucro")} ${formatMoney(m.profit)}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}

        <g fill="var(--muted)" fontSize="13" textAnchor="middle" fontWeight="700">
          {months.map((m, i) => (
            <text key={m.key} x={x0 + i * step + BW / 2} y={224}>
              {monthLabel(m.key)}
            </text>
          ))}
        </g>
      </svg>

      {hover !== null && (
        <Tooltip
          month={months[hover]}
          left={((x0 + hover * step + BW / 2) / VIEW_W) * 100}
        />
      )}
    </div>
  );
}

function Tooltip({ month, left }: { month: MonthBucket; left: number }) {
  const { lang, t } = useApp();
  const pct = month.revenue ? (month.profit / month.revenue) * 100 : null;
  return (
    <div className="chart-tip" style={{ left: `${left}%` }}>
      <div className="chart-tip-row">
        <i style={{ background: "var(--chart-custo)" }} />
        <span>{t("Custos")}</span>
        <em className="num">{formatMoney(month.cost)}</em>
      </div>
      <div className="chart-tip-row">
        <i style={{ background: "var(--chart-lucro)" }} />
        <span>{t("Lucro")}</span>
        <em className="num">{formatMoney(month.profit)}</em>
      </div>
      <div className="chart-tip-row">
        <i style={{ background: "transparent" }} />
        <span>{t("Margem")}</span>
        <em className="num">{formatPercent(pct, lang)}</em>
      </div>
    </div>
  );
}

function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, Math.max(h, 0));
  return [
    `M${x},${y + h}`,
    `L${x},${y + rr}`,
    `Q${x},${y} ${x + rr},${y}`,
    `L${x + w - rr},${y}`,
    `Q${x + w},${y} ${x + w},${y + rr}`,
    `L${x + w},${y + h}`,
    "Z",
  ].join("");
}

export function ChartLegend() {
  const { t } = useApp();
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <LegendItem color="var(--chart-custo)" label={t("Custos")} />
      <LegendItem color="var(--chart-lucro)" label={t("Lucro")} />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontSize: 14.5,
        color: "var(--muted)",
        fontWeight: 700,
      }}
    >
      <i
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: color,
          display: "block",
        }}
      />
      {label}
    </span>
  );
}
