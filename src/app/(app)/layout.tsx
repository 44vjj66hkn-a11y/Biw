"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogoMark } from "@/components/Logo";
import { Avatar, LangSwitcher } from "@/components/ui";
import { IS_DEMO, useApp } from "@/lib/store";

const NAV_PRODUCAO = [
  { href: "/trabalhos", label: "Trabalhos", icon: "grid" },
] as const;

const NAV_GESTAO = [
  { href: "/gestao", label: "Visão geral", icon: "chart" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 20h18" />
      <path d="M6 20V10M11 20V4M16 20v-7M21 20v-4" />
    </svg>
  ),
  out: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 17l5-5-5-5" />
      <path d="M20 12H9" />
      <path d="M12 20H6a2 2 0 01-2-2V6a2 2 0 012-2h6" />
    </svg>
  ),
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, signOut, t } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const isGestao = session?.profile.role === "gestao";

  // marca o papel no <body> para trocar o acento (verde ↔ dourado)
  useEffect(() => {
    document.body.dataset.role = isGestao ? "gestao" : "producao";
  }, [isGestao]);

  // sem sessão, volta para o login
  useEffect(() => {
    if (!session) router.replace("/");
  }, [session, router]);

  if (!session) return null;

  const nav = isGestao ? NAV_GESTAO : NAV_PRODUCAO;

  return (
    <div className="shell">
      <nav className="rail" aria-label={t(isGestao ? "Gestão" : "Produção")}>
        <div className="rail-mark">
          <LogoMark />
        </div>
        <div className="rail-app">{t(isGestao ? "Gestão" : "Produção")}</div>

        <div className="rail-nav">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rail-btn"
              aria-current={pathname.startsWith(item.href) ? "true" : "false"}
              title={t(item.label)}
            >
              {ICONS[item.icon]}
            </Link>
          ))}
        </div>

        <div className="rail-spacer" />

        <button
          type="button"
          className="rail-btn"
          title={t("Sair")}
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          {ICONS.out}
        </button>
        <div style={{ marginTop: 8 }}>
          <Avatar initials={session.profile.initials} size={34} />
        </div>
      </nav>

      <main className="main">
        <header className="topbar">
          <div className="hello">
            <span className="role-tag">
              {t(isGestao ? "App de Gestão" : "App de Produção")}
            </span>
            <strong>{session.profile.full_name}</strong>
          </div>

          <div className="search" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span>{t("Buscar por cliente, endereço ou nº do projeto…")}</span>
          </div>

          <div className="top-actions">
            <LangSwitcher />
            <div className="user-chip">
              <Avatar initials={session.profile.initials} size={30} />
              <small>{session.tenant.name}</small>
            </div>
          </div>
        </header>

        {IS_DEMO && (
          <p className="demo-banner">
            {t("Modo demonstração — os dados são de exemplo e somem ao recarregar.")}
          </p>
        )}

        {children}
      </main>
    </div>
  );
}
