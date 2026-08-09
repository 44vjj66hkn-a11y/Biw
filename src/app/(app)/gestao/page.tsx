"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChartLegend, CostProfitChart } from "@/components/CostProfitChart";
import {
  Icon,
  LockBadge,
  Photo,
  ReferenceThumb,
  StatTile,
  StatusPill,
} from "@/components/ui";
import { formatMoney, formatPercent } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { MonthBucket } from "@/lib/types";

export default function GestaoPage() {
  const { jobs, history, lang, t, createJob } = useApp();
  const router = useRouter();
  const [novo, setNovo] = useState(false);

  const totals = useMemo(() => {
    let revenue = 0;
    let cost = 0;
    for (const j of jobs) {
      revenue += j.financials?.sale_price ?? 0;
      cost += j.financials?.total_cost ?? 0;
    }
    return {
      revenue,
      cost,
      profit: revenue - cost,
      margin: revenue ? ((revenue - cost) / revenue) * 100 : null,
    };
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
        revenue: totals.revenue,
        cost: totals.cost,
        profit: totals.profit,
      },
    ],
    [history, totals],
  );

  const melhores = useMemo(
    () =>
      jobs
        .filter((j) => (j.financials?.profit_percent ?? null) !== null)
        .sort(
          (a, b) =>
            (b.financials?.profit_percent ?? 0) -
            (a.financials?.profit_percent ?? 0),
        )
        .slice(0, 5),
    [jobs],
  );

  return (
    <div className="grid12">
      <section className="panel c12">
        <div className="panel-head">
          <span className="panel-title">{t("Resultado do mês")}</span>
          <LockBadge label={t("Somente Gestão")} />
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
          <span className="panel-title">{t("Maiores margens do mês")}</span>
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
              {jobs.map((job) => {
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
