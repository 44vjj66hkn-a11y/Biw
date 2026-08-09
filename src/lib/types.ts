export type JobStatus = "pendente" | "em_producao" | "pronto" | "instalado";

/** Nível de acesso: define qual app a pessoa abre. */
export type UserRole = "producao" | "gestao";

/** Função na obra: define onde a pessoa pode ser escalada. */
export type Trade = "fabricante" | "instalador" | "ambos";

export const TRADES: Trade[] = ["fabricante", "instalador", "ambos"];

export const TRADE_LABEL: Record<Trade, string> = {
  fabricante: "Fabricante",
  instalador: "Instalador",
  ambos: "Fabricante e instalador",
};

export function canFabricate(t: Trade) {
  return t === "fabricante" || t === "ambos";
}

export function canInstall(t: Trade) {
  return t === "instalador" || t === "ambos";
}

/** Períodos do filtro da visão de gestão. */
export type Period = "semana" | "mes" | "total";

export const PERIODS: Period[] = ["semana", "mes", "total"];

export const PERIOD_LABEL: Record<Period, string> = {
  semana: "Semana",
  mes: "Mês",
  total: "Total",
};
export type PhotoKind = "local" | "medida" | "referencia";
export type DimensionKind = "largura" | "altura" | "comprimento";

export const JOB_STATUSES: JobStatus[] = [
  "pendente",
  "em_producao",
  "pronto",
  "instalado",
];

/** Rótulo em português (chave do dicionário de idiomas). */
export const STATUS_LABEL: Record<JobStatus, string> = {
  pendente: "Pendente",
  em_producao: "Em produção",
  pronto: "Pronto",
  instalado: "Instalado",
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
};

export type Profile = {
  id: string;
  tenant_id: string;
  role: UserRole;
  trade: Trade;
  full_name: string;
  initials: string;
  phone: string | null;
  active: boolean;
};

export function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

/** "Marcos Almeida" → "Marcos A." */
export function shortName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) return fullName;
  return `${parts[0]} ${parts[1][0]}.`;
}

export type JobPhoto = {
  id: string;
  job_id: string;
  kind: PhotoKind;
  /** URL pronta para exibir. No modo demo é null e cai no desenho de exemplo. */
  url: string | null;
  /** Classe de fundo usada quando não há imagem real (só no modo demo). */
  swatch?: string;
  /** Ícone de exemplo usado no modo demo. */
  sketch?: string;
  caption: string | null;
  dimension_value: number | null;
  dimension_unit: string | null;
  dimension_kind: DimensionKind | null;
  created_at: string;
};

export type JobNote = {
  id: string;
  job_id: string;
  author_name: string;
  author_initials: string;
  author_role: UserRole;
  body: string;
  created_at: string;
};

export type JobFinancials = {
  sale_price: number | null;
  material_cost: number | null;
  /** O que o fabricante recebe por este trabalho. */
  fabrication_cost: number | null;
  /** O que o instalador recebe por este trabalho. */
  installation_cost: number | null;
  total_cost: number;
  profit: number;
  profit_percent: number | null;
  fabricator_paid_at: string | null;
  installer_paid_at: string | null;
};

/**
 * Quanto a pessoa recebe por um trabalho, e se já recebeu.
 *
 * É o único número da parte financeira que a produção enxerga, e só
 * do próprio trabalho: nunca o valor cobrado do cliente, o custo do
 * material nem a margem. No banco isso vem de uma função dedicada,
 * não da tabela financeira.
 */
export type Payout = {
  amount: number;
  role: "fabricante" | "instalador";
  paid: boolean;
};

export function payoutFor(
  job: Pick<Job, "fabricator_id" | "installer_id" | "financials">,
  personId: string,
): Payout | null {
  const f = job.financials;
  if (!f) return null;
  if (job.fabricator_id === personId && f.fabrication_cost !== null) {
    return {
      amount: f.fabrication_cost,
      role: "fabricante",
      paid: f.fabricator_paid_at !== null,
    };
  }
  if (job.installer_id === personId && f.installation_cost !== null) {
    return {
      amount: f.installation_cost,
      role: "instalador",
      paid: f.installer_paid_at !== null,
    };
  }
  return null;
}

export type Job = {
  id: string;
  tenant_id: string;
  job_number: number;
  client_name: string;
  address: string;
  quantity: number;
  quantity_unit: string;
  description: string | null;
  fabricator_id: string | null;
  installer_id: string | null;
  material_used: string | null;
  status: JobStatus;
  install_date: string | null;
  created_at: string;
  photo_count: number;
  reference_photo: JobPhoto | null;
  /** Só vem preenchido para usuários de gestão. */
  financials: JobFinancials | null;
};

export type MonthBucket = {
  /** "2026-08" */
  key: string;
  revenue: number;
  cost: number;
  profit: number;
};

export function totalCost(f: {
  material_cost: number | null;
  fabrication_cost: number | null;
  installation_cost: number | null;
}): number {
  return (
    (f.material_cost ?? 0) +
    (f.fabrication_cost ?? 0) +
    (f.installation_cost ?? 0)
  );
}

/**
 * Data que define em qual período o trabalho conta.
 * Vale a instalação quando já marcada; senão, a abertura do projeto.
 */
export function referenceDate(job: Pick<Job, "install_date" | "created_at">) {
  return job.install_date ?? job.created_at.slice(0, 10);
}

/** Segunda-feira da semana da data informada, em ISO (YYYY-MM-DD). */
export function startOfWeek(today: Date): string {
  const d = new Date(today);
  const weekday = (d.getDay() + 6) % 7; // 0 = segunda
  d.setDate(d.getDate() - weekday);
  return d.toISOString().slice(0, 10);
}

export function inPeriod(
  job: Pick<Job, "install_date" | "created_at">,
  period: Period,
  today = new Date(),
): boolean {
  if (period === "total") return true;
  const ref = referenceDate(job);
  if (period === "mes") return ref.slice(0, 7) === today.toISOString().slice(0, 7);
  const from = startOfWeek(today);
  const to = new Date(today);
  to.setDate(to.getDate() + (7 - ((to.getDay() + 6) % 7)));
  return ref >= from && ref < to.toISOString().slice(0, 10);
}

export function computeFinancials(input: {
  sale_price: number | null;
  material_cost: number | null;
  fabrication_cost: number | null;
  installation_cost: number | null;
  fabricator_paid_at?: string | null;
  installer_paid_at?: string | null;
}): JobFinancials {
  const cost = totalCost(input);
  const sale = input.sale_price ?? 0;
  return {
    ...input,
    fabricator_paid_at: input.fabricator_paid_at ?? null,
    installer_paid_at: input.installer_paid_at ?? null,
    total_cost: cost,
    profit: sale - cost,
    profit_percent: sale === 0 ? null : ((sale - cost) / sale) * 100,
  };
}
