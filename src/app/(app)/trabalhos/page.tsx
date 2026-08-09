"use client";

import { useRouter } from "next/navigation";
import {
  Avatar,
  Icon,
  Photo,
  ReferenceThumb,
  StatTile,
  StatusPill,
} from "@/components/ui";
import { formatDayMonth } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import type { Job } from "@/lib/types";

export default function TrabalhosPage() {
  const { jobs, lang, t, team } = useApp();
  const router = useRouter();

  const emProducao = jobs.filter((j) => j.status === "em_producao");
  const prontos = jobs.filter((j) => j.status === "pronto");
  const instalados = jobs.filter((j) => j.status === "instalado");
  const proxima = [...prontos].sort((a, b) =>
    (a.install_date ?? "9999").localeCompare(b.install_date ?? "9999"),
  )[0];

  return (
    <div className="grid12">
      <section className="panel c8">
        <div className="panel-head">
          <span className="panel-title">{t("Em produção agora")}</span>
        </div>
        {emProducao.length === 0 ? (
          <p className="hint" style={{ margin: 0 }}>
            {t("Nenhum trabalho neste mês.")}
          </p>
        ) : (
          <div className="mini-row">
            {emProducao.slice(0, 2).map((job) => (
              <JobMini key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      <section className="panel c4">
        <div className="panel-head">
          <span className="panel-title">{t("Próxima instalação")}</span>
        </div>
        {proxima ? (
          <JobMini job={proxima} />
        ) : (
          <p className="hint" style={{ margin: 0 }}>
            {t("Nenhum trabalho neste mês.")}
          </p>
        )}
      </section>

      <section className="panel c12">
        <div className="panel-head">
          <span className="panel-title">{t("Visão do mês")}</span>
        </div>
        <div className="kpis">
          <StatTile
            label={t("Trabalhos no mês")}
            value={String(jobs.length)}
            icon={Icon.box}
            iconBg="var(--brand-dim)"
            iconFg="var(--brand)"
          />
          <StatTile
            label={t("Em produção")}
            value={String(emProducao.length)}
            icon={Icon.factory}
            iconBg="var(--st-prod-bg)"
            iconFg="var(--st-prod-fg)"
          />
          <StatTile
            label={t("Prontos p/ instalar")}
            value={String(prontos.length)}
            icon={Icon.box}
            iconBg="var(--st-ready-bg)"
            iconFg="var(--st-ready-fg)"
          />
          <StatTile
            label={t("Instalados")}
            value={String(instalados.length)}
            icon={Icon.check}
            iconBg="var(--st-inst-bg)"
            iconFg="var(--st-inst-fg)"
          />
        </div>
      </section>

      <section className="panel c4">
        <div className="panel-head">
          <span className="panel-title">{t("Equipe do mês")}</span>
        </div>
        <div className="list">
          {team.map((p) => {
            // os nomes vêm abreviados nos trabalhos ("Marcos A."),
            // então casa pelo primeiro nome
            const first = p.full_name.split(" ")[0];
            const feitos = jobs.filter(
              (j) =>
                j.fabricator_name?.startsWith(first) ||
                j.installer_name?.startsWith(first),
            ).length;
            return (
              <div className="list-item" key={p.id}>
                <Avatar initials={p.initials} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {p.full_name}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--faint)" }}>
                    {feitos} {t("Trabalhos").toLowerCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel c8">
        <div className="panel-head">
          <span className="panel-title">{t("Todos os trabalhos")}</span>
        </div>
        <p className="hint" style={{ margin: "0 0 14px" }}>
          {t(
            "Os projetos são abertos pela gestão. Aqui você preenche fotos, medidas, material e observações, e move o status até a instalação.",
          )}
        </p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("Cliente / Endereço")}</th>
                <th>{t("Referência")}</th>
                <th>{t("Qtd")}</th>
                <th>{t("Fabricante")}</th>
                <th>{t("Instalador")}</th>
                <th>{t("Fotos")}</th>
                <th>{t("Instalação")}</th>
                <th>{t("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
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
                  <td>{job.fabricator_name ?? <Dash />}</td>
                  <td>{job.installer_name ?? <Dash />}</td>
                  <td className="num">{job.photo_count}</td>
                  <td className="num">
                    {formatDayMonth(job.install_date, lang) ?? (
                      <span style={{ color: "var(--faint)" }}>
                        {t("a definir")}
                      </span>
                    )}
                  </td>
                  <td>
                    <StatusPill status={job.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Dash() {
  return <span style={{ color: "var(--faint)" }}>—</span>;
}

function JobMini({ job }: { job: Job }) {
  const { lang, t } = useApp();
  const router = useRouter();

  return (
    <article
      className="mini"
      onClick={() => router.push(`/projeto/${job.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/projeto/${job.id}`);
      }}
    >
      <Photo
        photo={job.reference_photo}
        className="mini-thumb"
        fallbackSketch="vert"
      />
      <div className="mini-body">
        <div style={{ marginBottom: 8 }}>
          <StatusPill status={job.status} />
        </div>
        <div className="mini-client">{job.client_name}</div>
        <div className="mini-line">{job.address}</div>
        <div className="mini-line">
          {t("Quantidade")}:{" "}
          <b style={{ color: "var(--text)" }}>
            {job.quantity} {job.quantity_unit}
          </b>
          {job.install_date && (
            <>
              {" · "}
              <b style={{ color: "var(--text)" }}>
                {formatDayMonth(job.install_date, lang)}
              </b>
            </>
          )}
        </div>
        <div className="mini-foot">
          {job.fabricator_name && (
            <span className="who">
              <Avatar
                initials={job.fabricator_name.slice(0, 2).toUpperCase()}
                size={20}
              />
              {job.fabricator_name}
            </span>
          )}
          <span className="who" style={{ color: "var(--faint)" }}>
            <span style={{ width: 14, height: 14, display: "inline-block" }}>
              {Icon.camera}
            </span>
            {job.photo_count}
          </span>
        </div>
      </div>
    </article>
  );
}
