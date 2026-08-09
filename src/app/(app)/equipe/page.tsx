"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui";
import { formatMoney } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import {
  TRADE_LABEL,
  TRADES,
  type Profile,
  type Trade,
  type UserRole,
} from "@/lib/types";

export default function EquipePage() {
  const { team, jobs, t, session, addMember, updateMember, setMemberActive } =
    useApp();
  const [editing, setEditing] = useState<Profile | null>(null);
  const [creating, setCreating] = useState(false);
  const canManage = session?.profile.role === "gestao";

  const ativos = team.filter((m) => m.active);
  const inativos = team.filter((m) => !m.active);

  return (
    <div className="grid12">
      <section className="panel c12">
        <div className="panel-head">
          <span className="panel-title">{t("Equipe da unidade")}</span>
          {canManage && (
            <button
              type="button"
              className="tool tool-accent"
              onClick={() => {
                setEditing(null);
                setCreating(true);
              }}
            >
              + {t("Adicionar pessoa")}
            </button>
          )}
        </div>

        <p className="hint" style={{ margin: "0 0 16px" }}>
          {t(
            "Quem está aqui pode ser escalado nos projetos. A função define onde a pessoa aparece: fabricante, instalador ou os dois.",
          )}
        </p>

        {canManage && (creating || editing) && (
          <MemberForm
            key={editing?.id ?? "novo"}
            member={editing}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSave={(input) => {
              if (editing) updateMember(editing.id, input);
              else addMember(input);
              setCreating(false);
              setEditing(null);
            }}
          />
        )}

        <div className="team-grid">
          {ativos.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              jobsCount={countOf(jobs, m.id)}
              canManage={canManage}
              onEdit={() => {
                setCreating(false);
                setEditing(m);
              }}
              onToggle={() => setMemberActive(m.id, false)}
            />
          ))}
        </div>

        {inativos.length > 0 && (
          <>
            <div className="rule" />
            <div className="panel-title" style={{ fontSize: 17, marginBottom: 13 }}>
              {t("Fora da equipe")}
            </div>
            <div className="team-grid">
              {inativos.map((m) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  jobsCount={countOf(jobs, m.id)}
                  inactive
                  canManage={canManage}
                  onEdit={() => setEditing(m)}
                  onToggle={() => setMemberActive(m.id, true)}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function countOf(
  jobs: ReturnType<typeof useApp>["jobs"],
  memberId: string,
): { fabricados: number; instalados: number; faturamento: number } {
  let fabricados = 0;
  let instalados = 0;
  let faturamento = 0;
  for (const j of jobs) {
    if (j.fabricator_id === memberId) {
      fabricados += 1;
      faturamento += j.financials?.sale_price ?? 0;
    }
    if (j.installer_id === memberId) instalados += 1;
  }
  return { fabricados, instalados, faturamento };
}

function MemberCard({
  member,
  jobsCount,
  inactive = false,
  canManage,
  onEdit,
  onToggle,
}: {
  member: Profile;
  jobsCount: { fabricados: number; instalados: number; faturamento: number };
  inactive?: boolean;
  canManage: boolean;
  onEdit: () => void;
  onToggle: () => void;
}) {
  const { t, session } = useApp();
  const isGestao = session?.profile.role === "gestao";
  // quem é da produção só enxerga os próprios números
  const isSelf = session?.profile.id === member.id;
  const showStats = isGestao || isSelf;

  return (
    <article className="member" data-inactive={inactive}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar initials={member.initials} size={44} muted={inactive} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>
            {member.full_name}
          </div>
          <div style={{ fontSize: 14.5, color: "var(--faint)", marginTop: 3 }}>
            {t(TRADE_LABEL[member.trade])}
            {member.role === "gestao" && ` · ${t("Gestão")}`}
          </div>
        </div>
      </div>

      {member.phone && (
        <div className="member-phone num">{member.phone}</div>
      )}

      {showStats && (
        <div className="member-stats">
          <Stat label={t("Fabricou")} value={String(jobsCount.fabricados)} />
          <Stat label={t("Instalou")} value={String(jobsCount.instalados)} />
          {isGestao && (
            <Stat
              label={t("Faturamento")}
              value={formatMoney(jobsCount.faturamento)}
            />
          )}
        </div>
      )}

      {canManage && (
        <div className="member-actions">
          <button type="button" className="tool" onClick={onEdit}>
            {t("Editar")}
          </button>
          <button type="button" className="tool" onClick={onToggle}>
            {inactive ? t("Trazer de volta") : t("Tirar da equipe")}
          </button>
        </div>
      )}
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="fact-label" style={{ marginBottom: 4 }}>
        {label}
      </div>
      <div className="num" style={{ fontSize: 18, fontWeight: 800 }}>
        {value}
      </div>
    </div>
  );
}

function MemberForm({
  member,
  onCancel,
  onSave,
}: {
  member: Profile | null;
  onCancel: () => void;
  onSave: (input: {
    full_name: string;
    trade: Trade;
    phone: string;
    role: UserRole;
  }) => void;
}) {
  const { t } = useApp();
  const [name, setName] = useState(member?.full_name ?? "");
  const [trade, setTrade] = useState<Trade>(member?.trade ?? "fabricante");
  const [phone, setPhone] = useState(member?.phone ?? "");
  const [role, setRole] = useState<UserRole>(member?.role ?? "producao");

  const valid = name.trim().length > 2;

  return (
    <form
      className="novo-projeto"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onSave({ full_name: name.trim(), trade, phone: phone.trim(), role });
      }}
    >
      <div className="panel-title" style={{ fontSize: 17, marginBottom: 14 }}>
        {member ? t("Editar pessoa") : t("Adicionar pessoa")}
      </div>

      <div className="novo-grid">
        <div style={{ gridColumn: "span 2" }}>
          <label className="field-label">{t("Nome completo")}</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label">{t("Função na obra")}</label>
          <select
            className="input"
            value={trade}
            onChange={(e) => setTrade(e.target.value as Trade)}
          >
            {TRADES.map((x) => (
              <option key={x} value={x}>
                {t(TRADE_LABEL[x])}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">{t("Telefone")}</label>
          <input
            className="input num"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(978) 555-0000"
          />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="field-label">{t("Nível de acesso")}</label>
          <div className="access-pick">
            {(
              [
                ["producao", "App de Produção", "Vê os projetos e preenche a produção. Não vê valores."],
                ["gestao", "App de Gestão", "Vê custos, lucro e margem, e abre projetos."],
              ] as const
            ).map(([value, title, desc]) => (
              <button
                key={value}
                type="button"
                aria-pressed={role === value}
                onClick={() => setRole(value)}
                className="access-opt"
              >
                <b>{t(title)}</b>
                <span>{t(desc)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          marginTop: 15,
        }}
      >
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          {t("Cancelar")}
        </button>
        <button className="btn" disabled={!valid}>
          {t("Salvar")}
        </button>
      </div>
    </form>
  );
}
