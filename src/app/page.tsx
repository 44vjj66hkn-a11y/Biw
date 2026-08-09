"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LangSwitcher } from "@/components/ui";
import { DEMO_TENANTS } from "@/lib/demo-data";
import { IS_DEMO, useApp } from "@/lib/store";
import type { UserRole } from "@/lib/types";

export default function LoginPage() {
  const { t, signIn } = useApp();
  const router = useRouter();

  const [tenantId, setTenantId] = useState(DEMO_TENANTS[0].id);
  const [email, setEmail] = useState("marcos@bostonironworks.com");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<UserRole>("producao");
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    signIn(tenantId, role);
    router.push(role === "producao" ? "/trabalhos" : "/gestao");
  }

  return (
    <div className="login">
      <aside className="login-brand">
        <div className="logo-box">
          <Logo />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 440 }}>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            {t("Gestão de Produção")}
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--muted)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {t(
              "Guarda-corpos e esquadrias. Cada unidade da franquia entra com o próprio acesso e enxerga apenas os seus trabalhos, sua equipe e seus números. Nenhuma unidade vê os dados de outra.",
            )}
          </p>
        </div>
      </aside>

      <main className="login-form-side">
        <div className="login-lang">
          <LangSwitcher />
        </div>

        <form className="login-card" onSubmit={submit}>
          <h1
            style={{
              fontSize: 29,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 7px",
            }}
          >
            {t("Entrar")}
          </h1>
          <p style={{ fontSize: 16, color: "var(--muted)", margin: "0 0 26px" }}>
            {t("Selecione sua unidade e informe seus dados.")}
          </p>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label" htmlFor="unit">
              {t("Unidade da franquia")}
            </label>
            <select
              id="unit"
              className="input"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              style={{
                borderColor: "var(--brand-line)",
                background: "var(--brand-dim)",
              }}
            >
              {DEMO_TENANTS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label" htmlFor="email">
              {t("E-mail")}
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label" htmlFor="pass">
              {t("Senha")}
            </label>
            <input
              id="pass"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {IS_DEMO && (
            <div style={{ marginBottom: 18 }}>
              <span className="field-label">Demonstração — qual app abrir</span>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 9,
                }}
              >
                {(
                  [
                    ["producao", "Produção", "Fabricante e instalador. Sem acesso a valores."],
                    ["gestao", "Gestão", "Dono da unidade. Custos, lucro e margem."],
                  ] as const
                ).map(([value, title, desc]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    aria-pressed={role === value}
                    style={{
                      background:
                        role === value ? "var(--brand-dim)" : "var(--card)",
                      border: `1px solid ${role === value ? "var(--brand)" : "var(--border)"}`,
                      borderRadius: "var(--r-sm)",
                      padding: 13,
                      textAlign: "left",
                      cursor: "pointer",
                      color: "var(--muted)",
                      font: "inherit",
                    }}
                  >
                    <b
                      style={{
                        display: "block",
                        fontSize: 16,
                        marginBottom: 4,
                        color: "var(--text)",
                      }}
                    >
                      {t(title)}
                    </b>
                    <span style={{ fontSize: 13, lineHeight: 1.45 }}>
                      {desc}
                    </span>
                  </button>
                ))}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--faint)",
                  margin: "8px 0 0",
                  lineHeight: 1.5,
                }}
              >
                No app real isso vem do cadastro do usuário — ninguém escolhe o
                próprio nível de acesso.
              </p>
            </div>
          )}

          <button
            className="btn"
            style={{ width: "100%", padding: 15, marginTop: 6 }}
            disabled={busy}
          >
            {busy ? t("Entrando…") : t("Entrar na unidade")}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: 18,
              fontSize: 15,
              color: "var(--faint)",
            }}
          >
            {t("Esqueceu a senha?")}{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                color: "var(--brand)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {t("Recuperar acesso")}
            </a>
          </p>
        </form>
      </main>
    </div>
  );
}
