/**
 * Dados de demonstração.
 *
 * Usados enquanto o Supabase não estiver configurado (sem
 * NEXT_PUBLIC_SUPABASE_URL no ambiente). Servem para clicar pelo app
 * inteiro sem precisar de conta nem banco. Nada aqui é persistido:
 * ao recarregar a página os dados voltam ao estado inicial.
 */

import type { Job, JobNote, JobPhoto, Profile, Tenant } from "./types";
import { computeFinancials } from "./types";

export const DEMO_TENANTS: Tenant[] = [
  { id: "t-georgetown", name: "Georgetown, MA", slug: "georgetown-ma" },
  { id: "t-boston", name: "Boston, MA", slug: "boston-ma" },
  { id: "t-providence", name: "Providence, RI", slug: "providence-ri" },
  { id: "t-nashua", name: "Nashua, NH", slug: "nashua-nh" },
];

export const DEMO_PROFILES: Profile[] = [
  {
    id: "u-marcos",
    tenant_id: "t-georgetown",
    role: "producao",
    trade: "fabricante",
    full_name: "Marcos Almeida",
    initials: "MA",
    phone: "(978) 555-0142",
    active: true,
  },
  {
    id: "u-paulo",
    tenant_id: "t-georgetown",
    role: "producao",
    trade: "fabricante",
    full_name: "Paulo Cardoso",
    initials: "PC",
    phone: "(978) 555-0188",
    active: true,
  },
  {
    id: "u-tiago",
    tenant_id: "t-georgetown",
    role: "producao",
    trade: "instalador",
    full_name: "Tiago Ramos",
    initials: "TR",
    phone: "(978) 555-0203",
    active: true,
  },
  {
    id: "u-lucas",
    tenant_id: "t-georgetown",
    role: "producao",
    trade: "ambos",
    full_name: "Lucas Ferreira",
    initials: "LF",
    phone: "(978) 555-0311",
    active: true,
  },
  {
    id: "u-helena",
    tenant_id: "t-georgetown",
    role: "gestao",
    trade: "ambos",
    full_name: "Helena Vasques",
    initials: "HV",
    phone: "(978) 555-0100",
    active: true,
  },
];

/** Mês corrente da demonstração, para os filtros baterem com os dados. */
const YM = "2026-08";
const d = (day: string) => `${YM}-${day}`;

function photo(
  id: string,
  job: string,
  kind: JobPhoto["kind"],
  swatch: string,
  sketch: string,
  caption: string | null,
  day: string,
  dim?: { value: number; kind: JobPhoto["dimension_kind"] },
): JobPhoto {
  return {
    id,
    job_id: job,
    kind,
    url: null,
    swatch,
    sketch,
    caption,
    dimension_value: dim?.value ?? null,
    dimension_unit: dim ? "m" : null,
    dimension_kind: dim?.kind ?? null,
    created_at: day,
  };
}

export const DEMO_PHOTOS: JobPhoto[] = [
  // projeto 1042
  photo("p1", "j-1042", "referencia", "", "vert", null, "2026-07-28"),
  photo("p2", "j-1042", "local", "photo-sky", "balcony", "Varanda frontal — vista geral", "2026-07-28"),
  photo("p3", "j-1042", "local", "photo-dusk", "stair", "Escada lateral externa", "2026-07-28"),
  photo("p4", "j-1042", "local", "photo-moss", "deck", "Deck dos fundos", "2026-07-28"),
  photo("p5", "j-1042", "local", "photo-warm", "porch", "Entrada principal", "2026-07-28"),
  photo("p6", "j-1042", "medida", "", "balcony", "Vão da varanda", "2026-07-29", { value: 3.2, kind: "largura" }),
  photo("p7", "j-1042", "medida", "photo-night", "stair", "Altura do guarda-corpo", "2026-07-29", { value: 1.1, kind: "altura" }),
  photo("p8", "j-1042", "medida", "photo-glass", "deck", "Corrimão do deck", "2026-07-29", { value: 5.4, kind: "comprimento" }),
  // demais projetos: só a referência
  photo("p9", "j-1038", "referencia", "photo-glass", "glass", null, "2026-07-20"),
  photo("p10", "j-1045", "referencia", "photo-night", "cable", null, "2026-08-01"),
  photo("p11", "j-1047", "referencia", "photo-warm", "panel", null, "2026-08-02"),
  photo("p12", "j-1033", "referencia", "photo-moss", "cross", null, "2026-07-15"),
];

export const DEMO_NOTES: JobNote[] = [
  {
    id: "n1",
    job_id: "j-1042",
    author_name: "Marcos Almeida",
    author_initials: "MA",
    author_role: "producao",
    body: "Cliente pediu acabamento fosco no lugar do brilhante. Já ajustei a pintura das 12 peças.",
    created_at: `${d("05")}T14:32:00`,
  },
  {
    id: "n2",
    job_id: "j-1042",
    author_name: "Tiago Ramos",
    author_initials: "TR",
    author_role: "producao",
    body: "Portão lateral estreito, o caminhão grande não entra. Levar as peças pela frente da casa.",
    created_at: `${d("01")}T09:10:00`,
  },
  {
    id: "n3",
    job_id: "j-1042",
    author_name: "Marcos Almeida",
    author_initials: "MA",
    author_role: "producao",
    body: "Piso do deck está fora de nível — cerca de 2 cm de caída da esquerda pra direita. Vou compensar nos montantes.",
    created_at: "2026-07-29T16:45:00",
  },
  {
    id: "n4",
    job_id: "j-1042",
    author_name: "Helena Vasques",
    author_initials: "HV",
    author_role: "gestao",
    body: "Orçamento aprovado pelo cliente por telefone. Pode comprar o material.",
    created_at: "2026-07-28T11:02:00",
  },
];

type Seed = Omit<Job, "photo_count" | "reference_photo" | "financials"> & {
  fin: {
    sale_price: number | null;
    material_cost: number | null;
    fabrication_cost: number | null;
    installation_cost: number | null;
    fabricator_paid_at?: string | null;
    installer_paid_at?: string | null;
  };
};

const SEEDS: Seed[] = [
  {
    id: "j-1042",
    tenant_id: "t-georgetown",
    job_number: 1042,
    client_name: "João Silva",
    address: "Rua das Flores, 123 – Centro",
    quantity: 12,
    quantity_unit: "un",
    description: "Guarda-corpo de varanda, escada e deck",
    fabricator_id: "u-marcos",
    installer_id: "u-tiago",
    material_used:
      'Alumínio anodizado preto 6063-T5, 42 barras de 3 m. Vidro laminado 8 mm — 6 painéis. Fixação química + parabolt inox 3/8". Sobra de 2 barras devolvida ao estoque.',
    status: "em_producao",
    install_date: d("15"),
    created_at: "2026-07-28",
    fin: {
      sale_price: 4200,
      material_cost: 1450,
      fabrication_cost: 780,
      installation_cost: 500,
    },
  },
  {
    id: "j-1038",
    tenant_id: "t-georgetown",
    job_number: 1038,
    client_name: "Maria Souza",
    address: "Av. Central, 450 – Jardim América",
    quantity: 8,
    quantity_unit: "un",
    description: "Escada interna",
    fabricator_id: "u-paulo",
    installer_id: "u-tiago",
    material_used: "Aço inox 304 escovado, 6 barras. Vidro temperado 10 mm.",
    status: "instalado",
    install_date: d("02"),
    created_at: "2026-07-20",
    fin: {
      sale_price: 3100,
      material_cost: 1200,
      fabrication_cost: 620,
      installation_cost: 350,
      fabricator_paid_at: "2026-08-06",
      installer_paid_at: "2026-08-06",
    },
  },
  {
    id: "j-1045",
    tenant_id: "t-georgetown",
    job_number: 1045,
    client_name: "Condomínio Bela Vista",
    address: "Rua dos Ipês, 88 – Bloco B",
    quantity: 24,
    quantity_unit: "m",
    description: "Corredor dos blocos",
    fabricator_id: "u-marcos",
    installer_id: null,
    material_used: null,
    status: "pronto",
    install_date: d("20"),
    created_at: "2026-08-01",
    fin: {
      sale_price: 9800,
      material_cost: 4100,
      fabrication_cost: 2000,
      installation_cost: 1100,
    },
  },
  {
    id: "j-1051",
    tenant_id: "t-georgetown",
    job_number: 1051,
    client_name: "Carlos Mendes",
    address: "Rua Sete de Setembro, 210",
    quantity: 5,
    quantity_unit: "un",
    description: "Sacada dos fundos",
    fabricator_id: null,
    installer_id: null,
    material_used: null,
    status: "pendente",
    install_date: null,
    created_at: d("06"),
    fin: {
      sale_price: null,
      material_cost: null,
      fabrication_cost: null,
      installation_cost: null,
    },
  },
  {
    id: "j-1047",
    tenant_id: "t-georgetown",
    job_number: 1047,
    client_name: "Ana Beatriz",
    address: "Alameda dos Anjos, 77",
    quantity: 15,
    quantity_unit: "un",
    description: "Sacada frontal",
    fabricator_id: "u-paulo",
    installer_id: "u-lucas",
    material_used: "Alumínio branco, vidro laminado 8 mm.",
    status: "em_producao",
    install_date: d("22"),
    created_at: "2026-08-02",
    fin: {
      sale_price: 6300,
      material_cost: 2500,
      fabrication_cost: 1100,
      installation_cost: 600,
    },
  },
  {
    id: "j-1033",
    tenant_id: "t-georgetown",
    job_number: 1033,
    client_name: "Roberto Lima",
    address: "Rua XV de Novembro, 340",
    quantity: 10,
    quantity_unit: "m",
    description: "Muro dos fundos",
    fabricator_id: "u-marcos",
    installer_id: "u-lucas",
    material_used: "Aço carbono galvanizado, pintura epóxi preta.",
    status: "instalado",
    install_date: d("05"),
    created_at: "2026-07-15",
    fin: {
      sale_price: 3600,
      material_cost: 1500,
      fabrication_cost: 780,
      installation_cost: 400,
    },
  },
];

export function buildDemoJobs(): Job[] {
  return SEEDS.map((seed) => {
    const { fin, ...rest } = seed;
    const photos = DEMO_PHOTOS.filter((p) => p.job_id === seed.id);
    return {
      ...rest,
      photo_count: photos.filter((p) => p.kind !== "referencia").length,
      reference_photo: photos.find((p) => p.kind === "referencia") ?? null,
      financials: computeFinancials(fin),
    };
  });
}

/** Meses anteriores usados no gráfico da gestão. */
export const DEMO_HISTORY = [
  { key: "2026-03", revenue: 19300, cost: 14200 },
  { key: "2026-04", revenue: 23200, cost: 16800 },
  { key: "2026-05", revenue: 21000, cost: 15100 },
  { key: "2026-06", revenue: 24800, cost: 18000 },
  { key: "2026-07", revenue: 25000, cost: 17900 },
];
