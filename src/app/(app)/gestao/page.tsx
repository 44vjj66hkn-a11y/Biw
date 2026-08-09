"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChartLegend, CostProfitChart } from "@/components/CostProfitChart";
import {
  Avatar,
  Icon,
  LockBadge,
  Photo,
  ReferenceThumb,
  StatTile,
  StatusPill,
} from "@/components/ui";
import { formatMoney, formatPercent } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import {
  inPeriod,
  PERIOD_LABEL,
  PERIODS,
  shortName,
  type MonthBucket,
  type Period,
} from "@/lib/types";

export default function GestaoPage() {
  const { jobs, history, lang, t, createJob, team } = useApp();
  const router = useRouter();
  const [novo, setNovo] = useState(false);
  const [period, setPeriod] = useState<Period>("mes");

  /** Trabalhos dentro do período escolhido (semana, mês ou tudo). */
  const scoped = useMemo(
    () => jobs.filter((j) => inPeriod(j, period)),
    [jobs, period],
  );

  const totals = useMemo(() => {
    let revenue = 0;
    let cost = 0;
    for (const j of scoped) {
      revenue += j.financials?.sale_price ?? 0;
      cost += j.financials?.total_cost ?? 0;
    }
    return {
      revenue,
      cost,
      profit: revenue - cost,
      margin: revenue ? ((revenue - cost) / revenue) * 100 : null,
    };
  }, [scoped]);

  /** Faturamento e custo somados por fabricante, dentro do período. */
  const porFabricante = useMemo(() => {
    const rows = team
      .filter((m) => m.trade !== "instalador")
      .map((m) => {
        let revenue = 0;
        let cost = 0;
        let count = 0;
        for (const j of scoped) {
          if (j.fabricator_id !== m.id) continue;
          revenue += j.financials?.sale_price ?? 0;
          cost += j.financials?.total_cost ?? 0;
          count += 1;
        }
        return {
          member: m,
          count,
          revenue,
          cost,
          profit: revenue - cost,
          margin: revenue ? ((revenue - cost) / revenue) * 100 : null,
        };
      });

    // trabalhos ainda sem fabricante escalado entram numa linha própria
    let semRevenue = 0;
    let semCost = 0;
    let semCount = 0;
    for (const j of scoped) {
      if (j.fabricator_id) continue;
      semRevenue += j.financials?.sale_price ?? 0;
      semCost += j.financials?.total_cost ?? 0;
      semCount += 1;
    }

    const all = rows.filter((r) => r.count > 0);
    if (semCount > 0) {
      all.push({
        member: null as never,
        count: semCount,
        revenue: semRevenue,
        cost: semCost,
        profit: semRevenue - semCost,
        margin: semRevenue ? ((semRevenue - semCost) / semRevenue) * 100 : null,
      });
    }
    return all.sort((a, b) => b.revenue - a.revenue);
  }, [scoped, team]);

  /** O gráfico é sempre mensal — o filtro acima move os números do topo. */
  const mesAtual = useMemo(() => {
    let revenue = 0;
    let cost = 0;
    for (const j of jobs.filter((x) => inPeriod(x, "mes"))) {
      revenue += j.financials?.sale_price ?? 0;
      cost += j.financials?.total_cost ?? 0;
    }
    return { revenue, cost };
  }, [jobs]);

  const months: MonthBucket[] = useMemo(
    () => [
      ...history.map((h) => ({
        key: h.key,
        revenue: h.revenue,
        cost: h.cost,
        profit: h.revenue - h.cost,
      })),
      {
        key: "2026-08",
        revenue: mesAtual.revenue,
        cost: mesAtual.cost,
        profit: mesAtual.revenue - mesAtual.cost,
      },
    ],
    [history, mesAtual],
  );

  const melhores = useMemo(
    () =>
      scoped
        .filter((j) => (j.financials?.profit_percent ?? null) !== null)
        .sort(
          (a, b) =>
            (b.financials?.profit_percent ?? 0) -
            (a.financials?.profit_percent ?? 0),
        )
        .slice(0, 5),
    [scoped],
  );

  return (
    <div className="grid12">
      <section className="panel c12">
        <div className="panel-head">
          <span className="panel-title">{t("Resultado")}</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div className="period" role="group" aria-label={t("Período")}>
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={period === p}
                  onClick={() => setPeriod(p)}
                >
                  {t(PERIOD_LABEL[p])}
                </button>
              ))}
            </div>
            <LockBadge label={t("Somente Gestão")} />
          </div>
        </div>
        <div className="kpis">
          <StatTile
            label={t("Faturamento")}
            value={formatMoney(totals.revenue)}
            icon={Icon.money}
            iconBg="rgb(66 146 206 / 14%)"
            iconFg="var(--info)"
          />
          <StatTile
            label={t("Custos totais")}
            value={formatMoney(totals.cost)}
            icon={Icon.down}
            iconBg="rgb(229 84 79 / 14%)"
            iconFg="var(--bad)"
          />
          <StatTile
            label={t("Lucro")}
            value={formatMoney(totals.profit)}
            icon={Icon.trend}
            iconBg="var(--brand-dim)"
            iconFg="var(--brand)"
          />
          <StatTile
            label={t("Margem média")}
            value={formatPercent(totals.margin, lang)}
            icon={Icon.percent}
            iconBg="var(--brand)"
            iconFg="#04170d"
            highlight
          />
        </div>
      </section>

      <section className="panel c8">
        <div className="panel-head">
          <span className="panel-title">{t("Custos e lucro por mês")}</span>
          <ChartLegend />
        </div>
        <CostProfitChart months={months} />
        <p className="hint" style={{ marginTop: 14 }}>
          {t(
            "Cada barra é o faturamento do mês, dividido entre o que foi custo e o que sobrou de lucro.",
          )}
        </p>
      </section>

      <section className="panel c4">
        <div className="panel-head">
          <span className="panel-title">{t("Maiores margens")}</span>
        </div>
        <div className="list">
          {melhores.map((j) => (
            <div className="list-item" key={j.id}>
              <Photo
                photo={j.reference_photo}
                style={{ width: 50, height: 40, borderRadius: 8, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {j.client_name}
                </div>
                <div style={{ fontSize: 14, color: "var(--faint)" }}>
                  {j.description ?? "—"} · {formatMoney(j.financials?.sale_price)}
                </div>
              </div>
              <span
                className="num"
                style={{ color: "var(--good)", fontWeight: 800 }}
              >
                {formatPercent(j.financials?.profit_percent, lang)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel c12">
        <div className="panel-head">
          <span className="panel-title">{t("Por fabricante")}</span>
          <span className="tool">{t(PERIOD_LABEL[period])}</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("Fabricante")}</th>
                <th className="r">{t("Trabalhos")}</th>
                <th className="r">{t("Faturamento")}</th>
                <th className="r">{t("Custos")}</th>
                <th className="r">{t("Lucro")}</th>
                <th className="r">{t("Margem")}</th>
              </tr>
            </thead>
            <tbody>
              {porFabricante.map((row, i) => (
                <tr key={row.member?.id ?? `sem-${i}`} style={{ cursor: "default" }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                      {row.member ? (
                        <>
                          <Avatar initials={row.member.initials} size={32} />
                          <span style={{ fontWeight: 800 }}>
                            {shortName(row.member.full_name)}
                          </span>
                        </>
                      ) : (
                        <>
                          <Avatar initials="—" size={32} muted />
                          <span style={{ color: "var(--faint)" }}>
                            {t("Sem fabricante escalado")}
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="r num">{row.count}</td>
                  <td className="r num">{formatMoney(row.revenue)}</td>
                  <td className="r num">{formatMoney(row.cost)}</td>
                  <td className="r num">{formatMoney(row.profit)}</td>
                  <td
                    className="r num"
                    style={{ color: "var(--good)", fontWeight: 800 }}
                  >
                    {formatPercent(row.margin, lang)}
                  </td>
                </tr>
              ))}
              {porFabricante.length === 0 && (
                <tr style={{ cursor: "default" }}>
                  <td colSpan={6} style={{ color: "var(--faint)" }}>
                    {t("Nenhum trabalho neste período.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="hint" style={{ marginTop: 14 }}>
          {t(
            "Cada trabalho conta pela data de instalação; sem data marcada, conta pela abertura do projeto.",
          )}
        </p>
      </section>

      <section className="panel c12">
        <div className="panel-head">
          <span className="panel-title">{t("Trabalhos e resultado")}</span>
          <button
            type="button"
            className="tool tool-accent"
            onClick={() => setNovo(true)}
          >
            + {t("Novo projeto")}
          </button>
        </div>

        {novo && (
          <NovoProjeto
            onCancel={() => setNovo(false)}
            onCreate={(input) => {
              const job = createJob(input);
              setNovo(false);
              router.push(`/projeto/${job.id}`);
            }}
          />
        )}

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("Cliente / Endereço")}</th>
                <th>{t("Referência")}</th>
                <th>{t("Qtd")}</th>
                <th>{t("Status")}</th>
                <th className="r">{t("Valor")}</th>
                <th className="r">{t("Custos")}</th>
                <th className="r">{t("Lucro")}</th>
                <th className="r">{t("Margem")}</th>
              </tr>
            </thead>
            <tbody>
              {scoped.map((job) => {
                const f = job.financials;
                const semValor = !f?.sale_price;
                return (
                  <tr
                    key={job.id}
                    onClick={() => router.push(`/projeto/${job.id}`)}
                  >
                    <td>
                      <div style={{ fontWeight: 800 }}>{job.client_name}</div>
                      <div
                        style={{
                          color: "var(--faint)",
                          fontSize: 14,
                          marginTop: 2,
                        }}
                      >
                        {job.address}
                      </div>
                    </td>
                    <td>
                      <ReferenceThumb photo={job.reference_photo} />
                    </td>
                    <td className="num">
                      {job.quantity} {job.quantity_unit}
                    </td>
                    <td>
                      <StatusPill status={job.status} />
                    </td>
                    <td className="r num">
                      {semValor ? <Dash /> : formatMoney(f?.sale_price)}
                    </td>
                    <td className="r num">
                      {semValor ? <Dash /> : formatMoney(f?.total_cost)}
                    </td>
                    <td className="r num">
                      {semValor ? <Dash /> : formatMoney(f?.profit)}
                    </td>
                    <td
                      className="r num"
                      style={{ color: semValor ? undefined : "var(--good)", fontWeight: 800 }}
                    >
                      {semValor ? (
                        <Dash />
                      ) : (
                        formatPercent(f?.profit_percent, lang)
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="hint" style={{ marginTop: 14 }}>
          {t("Clique em qualquer linha para abrir o projeto.")}
        </p>
      </section>
    </div>
  );
}

function Dash() {
  return <span style={{ color: "var(--faint)" }}>—</span>;
}

function NovoProjeto({
  onCancel,
  onCreate,
}: {
  onCancel: () => void;
  onCreate: (input: {
    client_name: string;
    address: string;
    quantity: number;
    quantity_unit: string;
    description: string;
  }) => void;
}) {
  const { t } = useApp();
  const [client, setClient] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("un");
  const [description, setDescription] = useState("");

  const valid = client.trim() && address.trim() && Number(quantity) > 0;

  return (
    <form
      className="novo-projeto"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onCreate({
          client_name: client.trim(),
          address: address.trim(),
          quantity: Number(quantity),
          quantity_unit: unit,
          description: description.trim(),
        });
      }}
    >
      <div className="panel-title" style={{ fontSize: 17, marginBottom: 14 }}>
        {t("Abrir novo projeto")}
      </div>

      <div className="novo-grid">
        <div>
          <label className="field-label">{t("Nome do cliente")}</label>
          <input
            className="input"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label">{t("Endereço")}</label>
          <input
            className="input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label">{t("Quantidade")}</label>
          <input
            className="input num"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">{t("Unidade")}</label>
          <select
            className="input"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="un">un</option>
            <option value="m">m</option>
            <option value="m²">m²</option>
          </select>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label className="field-label">{t("O que será feito")}</label>
          <input
            className="input"
            placeholder={t("Ex: guarda-corpo de varanda, escada e deck")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
          {t("Abrir projeto")}
        </button>
      </div>
    </form>
  );
}
