"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Sketch } from "./Sketch";
import { useApp } from "@/lib/store";
import { LANGS, LANG_LABEL } from "@/lib/i18n";
import { STATUS_LABEL, type JobPhoto, type JobStatus } from "@/lib/types";

/* ---------------- status ---------------- */

export function StatusPill({
  status,
  className = "",
}: {
  status: JobStatus;
  className?: string;
}) {
  const { t } = useApp();
  return (
    <span className={`pill pill-${status} ${className}`}>
      {t(STATUS_LABEL[status])}
    </span>
  );
}

/* ---------------- foto ---------------- */

export function Photo({
  photo,
  fallbackSketch,
  className = "",
  style,
  children,
}: {
  photo?: JobPhoto | null;
  fallbackSketch?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const swatch = photo?.swatch ?? "";
  return (
    <div className={`photo ${swatch} ${className}`} style={style}>
      {photo?.url ? (
        <Image src={photo.url} alt={photo.caption ?? ""} fill sizes="320px" />
      ) : (
        <Sketch name={photo?.sketch ?? fallbackSketch} />
      )}
      {children}
    </div>
  );
}

/**
 * Miniatura da foto de referência nas listagens. Sem foto, mostra um
 * alvo de toque para enviar — em vez de um desenho que passaria a
 * impressão falsa de que já existe imagem.
 */
export function ReferenceThumb({
  photo,
  width = 46,
  height = 36,
}: {
  photo?: JobPhoto | null;
  width?: number;
  height?: number;
}) {
  const { t } = useApp();
  if (photo) {
    return (
      <Photo photo={photo} style={{ width, height, borderRadius: 7 }} />
    );
  }
  return (
    <span
      title={t("Sem foto de referência")}
      style={{
        display: "grid",
        placeItems: "center",
        width,
        height,
        borderRadius: 7,
        border: "1.5px dashed var(--border)",
        background: "var(--card-3)",
        color: "var(--faint)",
        fontWeight: 800,
      }}
    >
      +
    </span>
  );
}

/* ---------------- idioma ---------------- */

export function LangSwitcher() {
  const { lang, setLang, t } = useApp();
  return (
    <div
      role="group"
      aria-label={t("Idioma")}
      style={{
        display: "inline-flex",
        gap: 2,
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 999,
        padding: 3,
        flexShrink: 0,
      }}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          style={{
            border: "none",
            background: lang === l ? "var(--accent)" : "transparent",
            color: lang === l ? "var(--accent-ink)" : "var(--faint)",
            font: "inherit",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: ".05em",
            padding: "7px 13px",
            borderRadius: 999,
            cursor: "pointer",
          }}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

/* ---------------- avatar ---------------- */

export function Avatar({
  initials,
  size = 22,
  muted = false,
}: {
  initials: string;
  size?: number;
  muted?: boolean;
}) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: muted ? "var(--card-3)" : "var(--accent-dim)",
        border: `1px solid ${muted ? "var(--border)" : "var(--accent-line)"}`,
        color: muted ? "var(--muted)" : "var(--accent)",
        display: "grid",
        placeItems: "center",
        fontSize: size * 0.42,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {initials}
    </span>
  );
}

/* ---------------- KPI ---------------- */

export function StatTile({
  label,
  value,
  icon,
  iconBg,
  iconFg,
  delta,
  note,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  iconBg: string;
  iconFg: string;
  delta?: { text: string; up: boolean };
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight
          ? "linear-gradient(115deg, var(--brand-dim), rgb(34 178 104 / 5%))"
          : "var(--card-2)",
        border: `1px solid ${highlight ? "var(--brand-line)" : "var(--border-soft)"}`,
        borderRadius: "var(--r-md)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          display: "grid",
          placeItems: "center",
          marginBottom: 12,
          background: iconBg,
          color: iconFg,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 14,
          color: highlight ? "var(--brand)" : "var(--faint)",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        className="num"
        style={{
          fontSize: 26,
          fontWeight: 800,
          marginBottom: delta ? 9 : 0,
          color: highlight ? "var(--brand)" : "var(--text)",
        }}
      >
        {value}
      </div>
      {delta && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            fontWeight: 800,
            padding: "3px 8px",
            borderRadius: 6,
            background: delta.up
              ? "rgb(52 199 123 / 13%)"
              : "rgb(229 84 79 / 13%)",
            color: delta.up ? "var(--good)" : "var(--bad)",
          }}
        >
          {delta.text} {delta.up ? "↑" : "↓"}
        </span>
      )}
      {note && (
        <div style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 8 }}>
          {note}
        </div>
      )}
    </div>
  );
}

/* ---------------- ícones ---------------- */

export const Icon = {
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  box: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M8 7V4h8v3" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="15" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M3 17l5-4 4 3 3-2 6 4" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
    </svg>
  ),
  ruler: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M6 9v6M18 9v6M12 3v3M12 18v3" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  ),
  factory: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M3 20h18M6 20V9l5 3V9l5 3V6l2 14" />
    </svg>
  ),
  money: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 3v18M17 8.5C17 6 14.8 4.5 12 4.5S7 6 7 8.2c0 4.8 10 2.6 10 7.4 0 2.3-2.2 3.9-5 3.9s-5-1.5-5-3.9" />
    </svg>
  ),
  trend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M21 7v5h-5" />
    </svg>
  ),
  percent: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
      <path d="M19 5L5 19" />
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  ),
};

/* ---------------- selo somente-gestão ---------------- */

export function LockBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12.5,
        fontWeight: 800,
        letterSpacing: ".07em",
        textTransform: "uppercase",
        color: "var(--ges)",
        background: "var(--ges-dim)",
        border: "1px solid var(--ges-line)",
        padding: "5px 11px",
        borderRadius: 7,
      }}
    >
      <span style={{ width: 12, height: 12, display: "inline-block" }}>
        {Icon.lock}
      </span>
      {label}
    </span>
  );
}
