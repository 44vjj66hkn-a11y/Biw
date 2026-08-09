/**
 * Idiomas: português (base), inglês e espanhol.
 * A chave é o texto em português — assim o código continua legível
 * e uma chave sem tradução cai no português em vez de sumir da tela.
 */

export const LANGS = ["pt", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABEL: Record<Lang, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

type Entry = [en: string, es: string];

const DICT: Record<string, Entry> = {
  // ---------- login ----------
  "Gestão de Produção": ["Production Management", "Gestión de Producción"],
  "Guarda-corpos e esquadrias. Cada unidade da franquia entra com o próprio acesso e enxerga apenas os seus trabalhos, sua equipe e seus números. Nenhuma unidade vê os dados de outra.":
    [
      "Railings and metalwork. Each franchise location signs in with its own account and sees only its own jobs, team and figures. No location can see another's data.",
      "Barandillas y carpintería metálica. Cada unidad de la franquicia entra con su propio acceso y ve solo sus trabajos, su equipo y sus números. Ninguna unidad ve los datos de otra.",
    ],
  Entrar: ["Sign in", "Entrar"],
  "Selecione sua unidade e informe seus dados.": [
    "Select your location and enter your details.",
    "Seleccione su unidad e ingrese sus datos.",
  ],
  "Unidade da franquia": ["Franchise location", "Unidad de la franquicia"],
  "E-mail": ["Email", "Correo electrónico"],
  Senha: ["Password", "Contraseña"],
  "Entrar na unidade": ["Sign in to this location", "Entrar en la unidad"],
  "Esqueceu a senha?": ["Forgot your password?", "¿Olvidó su contraseña?"],
  "Recuperar acesso": ["Reset access", "Recuperar acceso"],
  Idioma: ["Language", "Idioma"],
  "E-mail ou senha incorretos.": [
    "Incorrect email or password.",
    "Correo o contraseña incorrectos.",
  ],
  "Entrando…": ["Signing in…", "Entrando…"],

  // ---------- chrome ----------
  Produção: ["Production", "Producción"],
  Gestão: ["Management", "Gestión"],
  "App de Produção": ["Production App", "App de Producción"],
  "App de Gestão": ["Management App", "App de Gestión"],
  "Buscar por cliente, endereço ou nº do projeto…": [
    "Search by client, address or project no.…",
    "Buscar por cliente, dirección o nº de proyecto…",
  ],
  Trabalhos: ["Jobs", "Trabajos"],
  "Visão geral": ["Overview", "Visión general"],
  Equipe: ["Team", "Equipo"],
  Sair: ["Sign out", "Salir"],

  // ---------- lista ----------
  "Em produção agora": ["In production now", "En producción ahora"],
  "Próxima instalação": ["Next installation", "Próxima instalación"],
  "Todos os trabalhos": ["All jobs", "Todos los trabajos"],
  "Visão do mês": ["This month", "Visión del mes"],
  "Equipe do mês": ["Team this month", "Equipo del mes"],
  "Trabalhos no mês": ["Jobs this month", "Trabajos del mes"],
  "Prontos p/ instalar": ["Ready to install", "Listos para instalar"],
  Instalados: ["Installed", "Instalados"],
  "Nenhum trabalho neste mês.": [
    "No jobs this month.",
    "Ningún trabajo en este mes.",
  ],
  "Os projetos são abertos pela gestão. Aqui você preenche fotos, medidas, material e observações, e move o status até a instalação.":
    [
      "Projects are opened by management. Here you add photos, measurements, material and notes, and move the status through to installation.",
      "Los proyectos los abre la gestión. Aquí usted carga fotos, medidas, material y observaciones, y mueve el estado hasta la instalación.",
    ],

  // ---------- status ----------
  Pendente: ["Pending", "Pendiente"],
  "Em produção": ["In production", "En producción"],
  Pronto: ["Ready", "Listo"],
  Instalado: ["Installed", "Instalado"],

  // ---------- tabela ----------
  "Cliente / Endereço": ["Client / Address", "Cliente / Dirección"],
  Referência: ["Reference", "Referencia"],
  Qtd: ["Qty", "Cant."],
  Fabricante: ["Fabricator", "Fabricante"],
  Instalador: ["Installer", "Instalador"],
  Fotos: ["Photos", "Fotos"],
  Instalação: ["Installation", "Instalación"],
  Status: ["Status", "Estado"],
  "a definir": ["to be set", "por definir"],

  // ---------- projeto ----------
  Voltar: ["Back", "Volver"],
  Projeto: ["Project", "Proyecto"],
  "aberto pela gestão em": ["opened by management on", "abierto por gestión el"],
  Quantidade: ["Quantity", "Cantidad"],
  "Material usado na produção": [
    "Material used in production",
    "Material usado en la producción",
  ],
  "Descreva o material usado neste trabalho…": [
    "Describe the material used on this job…",
    "Describa el material usado en este trabajo…",
  ],
  Salvar: ["Save", "Guardar"],
  Salvo: ["Saved", "Guardado"],
  Andamento: ["Progress", "Avance"],
  "Toque na etapa para avançar o trabalho.": [
    "Tap a step to move the job forward.",
    "Toque la etapa para avanzar el trabajo.",
  ],
  "Foto de referência": ["Reference photo", "Foto de referencia"],
  "Sem foto de referência": ["No reference photo", "Sin foto de referencia"],
  "Fotos do local": ["Site photos", "Fotos del lugar"],
  "Fotos das medidas": ["Measurement photos", "Fotos de las medidas"],
  "Adicionar fotos": ["Add photos", "Agregar fotos"],
  "Adicionar medida": ["Add measurement", "Agregar medida"],
  "Enviar foto": ["Upload photo", "Subir foto"],
  "tirar agora ou escolher da galeria": [
    "take one now or pick from the gallery",
    "tomar ahora o elegir de la galería",
  ],
  "Enviar medida": ["Upload measurement", "Subir medida"],
  "foto + a cota medida": [
    "photo + the measured dimension",
    "foto + la cota medida",
  ],
  "Cada foto de medida guarda a cota digitada junto, pra ninguém depender da lembrança de quem foi ao local.":
    [
      "Each measurement photo stores the typed dimension with it, so nobody has to rely on the memory of whoever visited the site.",
      "Cada foto de medida guarda la cota escrita junto a ella, para que nadie dependa de la memoria de quien fue al lugar.",
    ],
  largura: ["width", "ancho"],
  altura: ["height", "alto"],
  comprimento: ["length", "largo"],
  Observações: ["Notes", "Observaciones"],
  "Escreva uma observação sobre este projeto — acesso ao local, detalhe de acabamento, combinado com o cliente…":
    [
      "Write a note about this project — site access, finish details, what was agreed with the client…",
      "Escriba una observación sobre este proyecto — acceso al lugar, detalle de acabado, lo acordado con el cliente…",
    ],
  "Salvar observação": ["Save note", "Guardar observación"],
  "Nenhuma observação ainda.": ["No notes yet.", "Ninguna observación aún."],
  "Este é o app de Produção: fotos, medidas, material e observações. Valores, custos e lucro não existem aqui — nem na tela, nem na API.":
    [
      "This is the Production app: photos, measurements, material and notes. Amounts, costs and profit do not exist here — not on screen, not in the API.",
      "Esta es la app de Producción: fotos, medidas, material y observaciones. Importes, costos y ganancia no existen aquí — ni en pantalla ni en la API.",
    ],

  // ---------- gestão ----------
  "Resultado do mês": ["Month results", "Resultado del mes"],
  Faturamento: ["Revenue", "Facturación"],
  "Custos totais": ["Total costs", "Costos totales"],
  Lucro: ["Profit", "Ganancia"],
  "Margem média": ["Average margin", "Margen promedio"],
  "Custos e lucro por mês": [
    "Costs and profit by month",
    "Costos y ganancia por mes",
  ],
  Custos: ["Costs", "Costos"],
  Margem: ["Margin", "Margen"],
  "Cada barra é o faturamento do mês, dividido entre o que foi custo e o que sobrou de lucro.":
    [
      "Each bar is the month's revenue, split between what went to costs and what was left as profit.",
      "Cada barra es la facturación del mes, dividida entre lo que fue costo y lo que quedó de ganancia.",
    ],
  "Maiores margens": ["Best margins", "Mejores márgenes"],
  "Trabalhos e resultado": ["Jobs and results", "Trabajos y resultado"],
  "Novo projeto": ["New project", "New proyecto"],
  Valor: ["Amount", "Importe"],
  "Financeiro do projeto": ["Project financials", "Financiero del proyecto"],
  "Somente Gestão": ["Management only", "Management only"],
  "Valor cobrado do cliente": [
    "Amount charged to client",
    "Importe cobrado al cliente",
  ],
  "Custo de insumo (material)": ["Material cost", "Costo de insumo (material)"],
  "Custo de fabricação": ["Fabrication cost", "Costo de fabricación"],
  "Custo de instalação": ["Installation cost", "Costo de instalación"],
  "Lucro calculado automaticamente": [
    "Profit calculated automatically",
    "Ganancia calculada automáticamente",
  ],
  "de margem": ["margin", "de margen"],
  "em custos": ["in costs", "en costos"],
  "Clique em qualquer linha para abrir o projeto.": [
    "Click any row to open the project.",
    "Haga clic en cualquier fila para abrir el proyecto.",
  ],

  // ---------- novo projeto ----------
  "Abrir novo projeto": ["Open new project", "Abrir nuevo proyecto"],
  "Nome do cliente": ["Client name", "Nombre del cliente"],
  Endereço: ["Address", "Dirección"],
  Unidade: ["Unit", "Unidad"],
  "O que será feito": ["What will be done", "Qué se hará"],
  "Ex: guarda-corpo de varanda, escada e deck": [
    "e.g. balcony, stair and deck railing",
    "Ej: barandilla de balcón, escalera y terraza",
  ],
  "Abrir projeto": ["Open project", "Abrir proyecto"],
  Cancelar: ["Cancel", "Cancelar"],

  // ---------- equipe ----------
  "Equipe da unidade": ["Location team", "Equipo de la unidad"],
  "Adicionar pessoa": ["Add person", "Agregar persona"],
  "Editar pessoa": ["Edit person", "Editar persona"],
  Editar: ["Edit", "Editar"],
  "Quem está aqui pode ser escalado nos projetos. A função define onde a pessoa aparece: fabricante, instalador ou os dois.":
    [
      "Anyone listed here can be assigned to projects. The trade decides where they show up: fabricator, installer, or both.",
      "Quien está aquí puede ser asignado a los proyectos. La función define dónde aparece la persona: fabricante, instalador o ambos.",
    ],
  "Nome completo": ["Full name", "Nombre completo"],
  "Função na obra": ["Trade", "Función en la obra"],
  Telefone: ["Phone", "Teléfono"],
  "Nível de acesso": ["Access level", "Nivel de acceso"],
  "Vê os projetos e preenche a produção. Não vê valores.": [
    "Sees projects and fills in production. No access to figures.",
    "Ve los proyectos y completa la producción. No ve importes.",
  ],
  "Vê custos, lucro e margem, e abre projetos.": [
    "Sees costs, profit and margin, and opens projects.",
    "Ve costos, ganancia y margen, y abre proyectos.",
  ],
  "Fabricante e instalador": ["Fabricator and installer", "Fabricante e instalador"],
  Fabricou: ["Fabricated", "Fabricó"],
  Instalou: ["Installed", "Instaló"],
  "Tirar da equipe": ["Remove from team", "Quitar del equipo"],
  "Trazer de volta": ["Bring back", "Traer de vuelta"],
  "Fora da equipe": ["Off the team", "Fuera del equipo"],

  // ---------- período e segmentação ----------
  Resultado: ["Results", "Resultado"],
  Período: ["Period", "Período"],
  Semana: ["Week", "Semana"],
  Mês: ["Month", "Mes"],
  Total: ["Total", "Total"],
  "Por fabricante": ["By fabricator", "Por fabricante"],
  "Sem fabricante escalado": [
    "No fabricator assigned",
    "Sin fabricante asignado",
  ],
  "Nenhum trabalho neste período.": [
    "No jobs in this period.",
    "Ningún trabajo en este período.",
  ],
  "Cada trabalho conta pela data de instalação; sem data marcada, conta pela abertura do projeto.":
    [
      "Each job counts by its installation date; with no date set, it counts by when the project was opened.",
      "Cada trabajo cuenta por su fecha de instalación; sin fecha marcada, cuenta por la apertura del proyecto.",
    ],

  // ---------- destaque e recebimentos ----------
  "Confira antes de produzir": ["Check before producing", "Verifique antes de producir"],
  "A quantidade e a foto de referência acima são o que foi combinado com o cliente. Qualquer diferença, fale com a gestão antes de cortar material.":
    [
      "The quantity and reference photo above are what was agreed with the client. If anything differs, talk to management before cutting material.",
      "La cantidad y la foto de referencia de arriba son lo acordado con el cliente. Ante cualquier diferencia, hable con la gestión antes de cortar material.",
    ],
  "Meus recebimentos": ["My earnings", "Mis cobros"],
  "A receber nesta semana": ["Due this week", "A cobrar esta semana"],
  "A receber neste mês": ["Due this month", "A cobrar este mes"],
  "Já recebido no mês": ["Received this month", "Ya cobrado en el mes"],
  "A receber no total": ["Due in total", "A cobrar en total"],
  "Você recebe": ["You get", "Usted recibe"],
  "Você recebeu": ["You were paid", "Usted recibió"],
  "A receber": ["Due", "A cobrar"],
  Pago: ["Paid", "Pagado"],
  "Marcar como pago": ["Mark as paid", "Marcar como pagado"],
  "Conta pela data de instalação; sem data marcada, pela abertura do projeto. Some só os trabalhos em que você está escalado.":
    [
      "Counted by installation date; with no date set, by when the project was opened. Only jobs you are assigned to.",
      "Cuenta por la fecha de instalación; sin fecha marcada, por la apertura del proyecto. Solo los trabajos en los que usted está asignado.",
    ],
  "Você vê o que recebe por este trabalho. O valor cobrado do cliente, o custo do material e a margem ficam só com a gestão — nem na tela, nem na API.":
    [
      "You see what you earn on this job. The amount charged to the client, the material cost and the margin stay with management — not on screen, not in the API.",
      "Usted ve lo que recibe por este trabajo. El importe cobrado al cliente, el costo del material y el margen quedan solo con la gestión — ni en pantalla ni en la API.",
    ],

  // ---------- demo ----------
  "Modo demonstração — os dados são de exemplo e somem ao recarregar.": [
    "Demo mode — data is sample data and resets on reload.",
    "Modo demostración — los datos son de ejemplo y se reinician al recargar.",
  ],
};

export function translate(key: string, lang: Lang): string {
  if (lang === "pt") return key;
  const entry = DICT[key];
  if (!entry) return key;
  return lang === "en" ? entry[0] : entry[1];
}

/** Locale usado para datas e números. Dinheiro é sempre US$. */
export function localeOf(lang: Lang): string {
  return lang === "en" ? "en-US" : lang === "es" ? "es-ES" : "pt-BR";
}

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value: number | null | undefined, lang: Lang) {
  if (value === null || value === undefined) return "—";
  return `${value.toLocaleString(localeOf(lang), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatDate(iso: string | null | undefined, lang: Lang) {
  if (!iso) return null;
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(localeOf(lang), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDayMonth(iso: string | null | undefined, lang: Lang) {
  if (!iso) return null;
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(localeOf(lang), {
    day: "2-digit",
    month: "2-digit",
  });
}
