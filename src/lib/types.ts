export type JobStatus = "pendente" | "em_producao" | "pronto" | "instalado";
export type UserRole = "producao" | "gestao";
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
  full_name: string;
  initials: string;
};

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
  fabrication_cost: number | null;
  installation_cost: number | null;
  total_cost: number;
  profit: number;
  profit_percent: number | null;
};

export type Job = {
  id: string;
  tenant_id: string;
  job_number: number;
  client_name: string;
  address: string;
  quantity: number;
  quantity_unit: string;
  description: string | null;
  fabricator_name: string | null;
  installer_name: string | null;
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

export function computeFinancials(input: {
  sale_price: number | null;
  material_cost: number | null;
  fabrication_cost: number | null;
  installation_cost: number | null;
}): JobFinancials {
  const cost = totalCost(input);
  const sale = input.sale_price ?? 0;
  return {
    ...input,
    total_cost: cost,
    profit: sale - cost,
    profit_percent: sale === 0 ? null : ((sale - cost) / sale) * 100,
  };
}
