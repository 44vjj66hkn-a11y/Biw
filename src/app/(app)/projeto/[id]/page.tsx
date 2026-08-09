"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Avatar,
  Icon,
  LockBadge,
  Photo,
  StatusPill,
} from "@/components/ui";
import { formatDate, formatDayMonth, formatMoney, formatPercent } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import {
  JOB_STATUSES,
  STATUS_LABEL,
  type DimensionKind,
  type JobPhoto,
} from "@/lib/types";

export default function ProjetoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    jobById,
    photosOf,
    notesOf,
    session,
    lang,
    t,
    setStatus,
    setMaterial,
    addNote,
    addPhoto,
    setFinancials,
  } = useApp();

  const job = jobById(id);
  const isGestao = session?.profile.role === "gestao";

  const [note, setNote] = useState("");

  if (!job) {
    return (
      <p className="hint">
        <Link href="/trabalhos" className="tool">
          {t("Voltar")}
        </Link>
      </p>
    );
  }

  const photos = photosOf(job.id);
  const locais = photos.filter((p) => p.kind === "local");
  const medidas = photos.filter((p) => p.kind === "medida");
  const referencia = photos.find((p) => p.kind === "referencia") ?? null;
  const notes = notesOf(job.id);

  const backHref = isGestao ? "/gestao" : "/trabalhos";

  return (
    <>
      <div className="crumb">
        <button type="button" className="tool" onClick={() => router.push(backHref)}>
          ‹ {t("Voltar")}
        </button>
        <span className="num" style={{ fontSize: 15, color: "var(--faint)" }}>
          {t("Projeto")} #{job.job_number} · {t("aberto pela gestão em")}{" "}
          {formatDate(job.created_at, lang)}
        </span>
      </div>

      <div className="grid12">
        {/* ---------- cabeçalho ---------- */}
        <section className="panel c8">
          <div className="hero">
            <div className="hero-main">
              <h1 className="hero-client">{job.client_name}</h1>
              <p className="hero-line">
                <span className="hero-ico">{Icon.pin}</span>
                <span>{job.address}</span>
              </p>
              <p className="hero-line">
                <span className="hero-ico">{Icon.box}</span>
                <span>
                  {t("Quantidade")}:{" "}
                  <b style={{ color: "var(--text)" }}>
                    {job.quantity} {job.quantity_unit}
                  </b>
                  {job.description ? ` · ${job.description}` : ""}
                </span>
              </p>

              <div className="hero-facts">
                <Fact
                  label={t("Fabricante")}
                  value={job.fabricator_name ?? t("a definir")}
                />
                <Fact
                  label={t("Instalador")}
                  value={job.installer_name ?? t("a definir")}
                />
                <Fact
                  label={t("Instalação")}
                  value={formatDate(job.install_date, lang) ?? t("a definir")}
                  mono
                />
              </div>
            </div>

            <Photo
              photo={referencia}
              fallbackSketch="vert"
              className="hero-photo"
            />
          </div>

          <div className="rule" />

          <MaterialEditor
            key={job.id}
            initial={job.material_used ?? ""}
            onSave={(value) => setMaterial(job.id, value)}
          />
        </section>

        {/* ---------- andamento ---------- */}
        <section className="panel c4">
          <div className="panel-head">
            <span className="panel-title">{t("Andamento")}</span>
            <StatusPill status={job.status} />
          </div>

          <div className="steps">
            {JOB_STATUSES.map((s) => {
              const idx = JOB_STATUSES.indexOf(s);
              const cur = JOB_STATUSES.indexOf(job.status);
              const state = idx < cur ? "done" : idx === cur ? "now" : "todo";
              return (
                <button
                  key={s}
                  type="button"
                  className="step"
                  data-state={state}
                  onClick={() => setStatus(job.id, s)}
                >
                  {state === "done" && (
                    <span style={{ width: 13, height: 13, display: "inline-block" }}>
                      {Icon.check}
                    </span>
                  )}
                  {t(STATUS_LABEL[s])}
                </button>
              );
            })}
          </div>
          <p className="hint" style={{ marginTop: 12 }}>
            {t("Toque na etapa para avançar o trabalho.")}
          </p>

          <div className="rule" />

          <div className="panel-head" style={{ marginBottom: 11 }}>
            <span className="panel-title" style={{ fontSize: 17 }}>
              {t("Foto de referência")}
            </span>
          </div>
          {referencia ? (
            <Photo
              photo={referencia}
              style={{ width: "100%", height: 150, borderRadius: "var(--r-md)" }}
            />
          ) : (
            <p className="hint" style={{ margin: 0 }}>
              {t("Sem foto de referência")}
            </p>
          )}
        </section>

        {/* ---------- fotos do local ---------- */}
        <section className="panel c6">
          <div className="panel-head">
            <span className="panel-title">
              {t("Fotos do local")}{" "}
              <span className="num" style={{ color: "var(--faint)" }}>
                · {locais.length}
              </span>
            </span>
          </div>
          <div className="gallery">
            {locais.map((p) => (
              <Shot key={p.id} photo={p} />
            ))}
            <button
              type="button"
              className="upload"
              onClick={() => {
                const caption = window.prompt(t("Adicionar fotos"));
                if (caption !== null) addPhoto(job.id, "local", caption);
              }}
            >
              <span className="upload-ico">{Icon.upload}</span>
              <b>{t("Enviar foto")}</b>
              <span>{t("tirar agora ou escolher da galeria")}</span>
            </button>
          </div>
        </section>

        {/* ---------- fotos das medidas ---------- */}
        <section className="panel c6">
          <div className="panel-head">
            <span className="panel-title">
              {t("Fotos das medidas")}{" "}
              <span className="num" style={{ color: "var(--faint)" }}>
                · {medidas.length}
              </span>
            </span>
          </div>
          <div className="gallery">
            {medidas.map((p) => (
              <Shot key={p.id} photo={p} />
            ))}
            <button
              type="button"
              className="upload"
              onClick={() => {
                const caption = window.prompt(t("Adicionar medida"));
                if (caption === null) return;
                const raw = window.prompt("m", "1.10");
                const value = Number((raw ?? "").replace(",", "."));
                if (!Number.isFinite(value)) return;
                const kindRaw = (
                  window.prompt(
                    "largura / altura / comprimento",
                    "largura",
                  ) ?? "largura"
                ).toLowerCase() as DimensionKind;
                const kind: DimensionKind = (
                  ["largura", "altura", "comprimento"] as const
                ).includes(kindRaw)
                  ? kindRaw
                  : "largura";
                addPhoto(job.id, "medida", caption, { value, kind });
              }}
            >
              <span className="upload-ico">{Icon.ruler}</span>
              <b>{t("Enviar medida")}</b>
              <span>{t("foto + a cota medida")}</span>
            </button>
          </div>
          <p className="hint" style={{ marginTop: 13 }}>
            {t(
              "Cada foto de medida guarda a cota digitada junto, pra ninguém depender da lembrança de quem foi ao local.",
            )}
          </p>
        </section>

        {/* ---------- observações ---------- */}
        <section className="panel c12">
          <div className="panel-head">
            <span className="panel-title">{t("Observações")}</span>
          </div>

          <textarea
            className="input"
            value={note}
            placeholder={t(
              "Escreva uma observação sobre este projeto — acesso ao local, detalhe de acabamento, combinado com o cliente…",
            )}
            onChange={(e) => setNote(e.target.value)}
          />
          <div
            style={{ display: "flex", justifyContent: "flex-end", marginTop: 11 }}
          >
            <button
              type="button"
              className="btn"
              disabled={!note.trim()}
              onClick={() => {
                addNote(job.id, note.trim());
                setNote("");
              }}
            >
              {t("Salvar observação")}
            </button>
          </div>

          <div className="thread">
            {notes.length === 0 && (
              <p className="hint" style={{ margin: 0 }}>
                {t("Nenhuma observação ainda.")}
              </p>
            )}
            {notes.map((n) => (
              <article className="entry" key={n.id}>
                <Avatar initials={n.author_initials} size={32} muted />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="entry-head">
                    <span style={{ fontSize: 16, fontWeight: 800 }}>
                      {n.author_name}
                    </span>
                    <span className="entry-role">
                      {t(n.author_role === "gestao" ? "Gestão" : "Produção")}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 14,
                        color: "var(--faint)",
                      }}
                      className="num"
                    >
                      {formatDayMonth(n.created_at.slice(0, 10), lang)}
                    </span>
                  </div>
                  <p className="entry-body">{n.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- financeiro: só gestão ---------- */}
        {isGestao ? (
          <FinancialPanel key={job.id} jobId={job.id} onSave={setFinancials} />
        ) : (
          <section className="panel c12">
            <p className="hint" style={{ margin: 0 }}>
              {t(
                "Este é o app de Produção: fotos, medidas, material e observações. Valores, custos e lucro não existem aqui — nem na tela, nem na API.",
              )}
            </p>
          </section>
        )}
      </div>
    </>
  );
}

/**
 * Editor do material. Recebe `key={job.id}` na chamada, então trocar de
 * projeto reinicia o rascunho sem precisar sincronizar estado por efeito.
 */
function MaterialEditor({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (value: string) => void;
}) {
  const { t } = useApp();
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(false);

  return (
    <>
      <div className="panel-head" style={{ marginBottom: 11 }}>
        <span className="panel-title" style={{ fontSize: 17 }}>
          {t("Material usado na produção")}
        </span>
      </div>
      <textarea
        className="input"
        value={value}
        placeholder={t("Descreva o material usado neste trabalho…")}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
          alignItems: "center",
          marginTop: 11,
        }}
      >
        {saved && (
          <span style={{ fontSize: 15, color: "var(--good)" }}>
            {t("Salvo")}
          </span>
        )}
        <button
          type="button"
          className="btn"
          onClick={() => {
            onSave(value);
            setSaved(true);
          }}
        >
          {t("Salvar")}
        </button>
      </div>
    </>
  );
}

function Fact({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="fact">
      <div className="fact-label">{label}</div>
      <div className={`fact-value ${mono ? "num" : ""}`}>{value}</div>
    </div>
  );
}

function Shot({ photo }: { photo: JobPhoto }) {
  const { lang, t } = useApp();
  const dim =
    photo.dimension_value !== null && photo.dimension_kind
      ? `${t(photo.dimension_kind).slice(0, 4)}. ${photo.dimension_value.toLocaleString(
          lang === "en" ? "en-US" : "pt-BR",
          { minimumFractionDigits: 2 },
        )} ${photo.dimension_unit}`
      : null;

  return (
    <Photo photo={photo} className="shot">
      {dim && <span className="dim-badge num">{dim}</span>}
      {photo.caption && <span className="shot-cap">{photo.caption}</span>}
    </Photo>
  );
}

function FinancialPanel({
  jobId,
  onSave,
}: {
  jobId: string;
  onSave: ReturnType<typeof useApp>["setFinancials"];
}) {
  const { t, lang, jobById } = useApp();
  const job = jobById(jobId);
  const f = job?.financials;

  const [sale, setSale] = useState(f?.sale_price?.toString() ?? "");
  const [mat, setMat] = useState(f?.material_cost?.toString() ?? "");
  const [fab, setFab] = useState(f?.fabrication_cost?.toString() ?? "");
  const [inst, setInst] = useState(f?.installation_cost?.toString() ?? "");

  const n = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")));
  const values = {
    sale_price: n(sale),
    material_cost: n(mat),
    fabrication_cost: n(fab),
    installation_cost: n(inst),
  };
  const cost =
    (values.material_cost ?? 0) +
    (values.fabrication_cost ?? 0) +
    (values.installation_cost ?? 0);
  const profit = (values.sale_price ?? 0) - cost;
  const pct = values.sale_price ? (profit / values.sale_price) * 100 : null;

  return (
    <section className="panel c12">
      <div className="panel-head">
        <span className="panel-title">{t("Financeiro do projeto")}</span>
        <LockBadge label={t("Somente Gestão")} />
      </div>

      <div className="fields">
        <Money label={t("Valor cobrado do cliente")} value={sale} onChange={setSale} />
        <Money label={t("Custo de insumo (material)")} value={mat} onChange={setMat} />
        <Money label={t("Custo de fabricação")} value={fab} onChange={setFab} />
        <Money label={t("Custo de instalação")} value={inst} onChange={setInst} />
      </div>

      <div className="profit-box">
        <div>
          <div className="profit-label">
            {t("Lucro calculado automaticamente")}
          </div>
          <div className="profit-sub">
            {formatMoney(values.sale_price)} − {formatMoney(cost)}{" "}
            {t("em custos")}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="profit-value num">{formatMoney(profit)}</div>
          <div className="profit-sub num">
            {formatPercent(pct, lang)} {t("de margem")}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <button type="button" className="btn" onClick={() => onSave(jobId, values)}>
          {t("Salvar")}
        </button>
      </div>
    </section>
  );
}

function Money({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        className="input num"
        inputMode="decimal"
        placeholder="0.00"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
