"use client";

/**
 * Estado da sessão e dos dados.
 *
 * Hoje o app roda em modo demonstração (dados em memória). Quando o
 * Supabase estiver configurado, só este módulo muda: a interface
 * exposta pelo hook `useApp` continua a mesma para todas as telas.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEMO_HISTORY,
  DEMO_NOTES,
  DEMO_PHOTOS,
  DEMO_PROFILES,
  DEMO_TENANTS,
  buildDemoJobs,
} from "./demo-data";
import { translate, type Lang } from "./i18n";
import {
  computeFinancials,
  initialsOf,
  payoutFor,
  type DimensionKind,
  type Job,
  type JobNote,
  type JobPhoto,
  type JobStatus,
  type Payout,
  type Profile,
  type Tenant,
  type Trade,
  type UserRole,
} from "./types";

export const IS_DEMO = !process.env.NEXT_PUBLIC_SUPABASE_URL;

type Session = {
  profile: Profile;
  tenant: Tenant;
};

type MemberInput = {
  full_name: string;
  trade: Trade;
  phone: string;
  role: UserRole;
};

type NewJobInput = {
  client_name: string;
  address: string;
  quantity: number;
  quantity_unit: string;
  description: string;
};

type AppState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;

  session: Session | null;
  signIn: (tenantId: string, role: UserRole) => void;
  signOut: () => void;

  jobs: Job[];
  jobById: (id: string) => Job | undefined;
  photosOf: (jobId: string) => JobPhoto[];
  notesOf: (jobId: string) => JobNote[];
  history: typeof DEMO_HISTORY;

  /** Equipe da unidade: quem pode ser escalado nos projetos. */
  team: Profile[];
  memberById: (id: string | null) => Profile | undefined;
  addMember: (input: MemberInput) => void;
  updateMember: (id: string, input: MemberInput) => void;
  setMemberActive: (id: string, active: boolean) => void;
  assign: (
    jobId: string,
    who: { fabricator_id?: string | null; installer_id?: string | null },
  ) => void;

  setStatus: (jobId: string, status: JobStatus) => void;
  setMaterial: (jobId: string, material: string) => void;
  addNote: (jobId: string, body: string) => void;
  addPhoto: (
    jobId: string,
    kind: "local" | "medida",
    caption: string,
    dimension?: { value: number; kind: DimensionKind },
  ) => void;
  createJob: (input: NewJobInput) => Job;

  /** Quanto o usuário logado recebe por este trabalho (ou null). */
  myPayout: (job: Job) => Payout | null;
  markPaid: (jobId: string, who: "fabricante" | "instalador") => void;
  setFinancials: (
    jobId: string,
    values: {
      sale_price: number | null;
      material_cost: number | null;
      fabrication_cost: number | null;
      installation_cost: number | null;
    },
  ) => void;
};

const Ctx = createContext<AppState | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");
  const [session, setSession] = useState<Session | null>(null);
  const [jobs, setJobs] = useState<Job[]>(() => buildDemoJobs());
  const [photos, setPhotos] = useState<JobPhoto[]>(() => [...DEMO_PHOTOS]);
  const [notes, setNotes] = useState<JobNote[]>(() => [...DEMO_NOTES]);
  const [team, setTeam] = useState<Profile[]>(() => [...DEMO_PROFILES]);

  const t = useCallback((key: string) => translate(key, lang), [lang]);

  const signIn = useCallback((tenantId: string, role: UserRole) => {
    const tenant =
      DEMO_TENANTS.find((x) => x.id === tenantId) ?? DEMO_TENANTS[0];
    const profile =
      DEMO_PROFILES.find((p) => p.role === role) ?? DEMO_PROFILES[0];
    setSession({ tenant, profile: { ...profile, tenant_id: tenant.id } });
  }, []);

  const signOut = useCallback(() => setSession(null), []);

  const patchJob = useCallback(
    (jobId: string, patch: Partial<Job>) =>
      setJobs((all) =>
        all.map((j) => (j.id === jobId ? { ...j, ...patch } : j)),
      ),
    [],
  );

  const setStatus = useCallback(
    (jobId: string, status: JobStatus) => patchJob(jobId, { status }),
    [patchJob],
  );

  const setMaterial = useCallback(
    (jobId: string, material_used: string) =>
      patchJob(jobId, { material_used }),
    [patchJob],
  );

  const addNote = useCallback(
    (jobId: string, body: string) => {
      if (!session) return;
      const note: JobNote = {
        id: uid(),
        job_id: jobId,
        author_name: session.profile.full_name,
        author_initials: session.profile.initials,
        author_role: session.profile.role,
        body,
        created_at: new Date().toISOString(),
      };
      setNotes((all) => [note, ...all]);
    },
    [session],
  );

  const addPhoto = useCallback<AppState["addPhoto"]>(
    (jobId, kind, caption, dimension) => {
      const swatches = [
        "photo-sky",
        "photo-dusk",
        "photo-moss",
        "photo-warm",
        "photo-glass",
        "photo-night",
      ];
      const sketches = ["balcony", "stair", "deck", "porch"];
      const photo: JobPhoto = {
        id: uid(),
        job_id: jobId,
        kind,
        url: null,
        swatch: swatches[Math.floor(Math.random() * swatches.length)],
        sketch: sketches[Math.floor(Math.random() * sketches.length)],
        caption: caption || null,
        dimension_value: dimension?.value ?? null,
        dimension_unit: dimension ? "m" : null,
        dimension_kind: dimension?.kind ?? null,
        created_at: new Date().toISOString().slice(0, 10),
      };
      setPhotos((all) => [...all, photo]);
      setJobs((all) =>
        all.map((j) =>
          j.id === jobId ? { ...j, photo_count: j.photo_count + 1 } : j,
        ),
      );
    },
    [],
  );

  const addMember = useCallback<AppState["addMember"]>(
    (input) => {
      const tenantId = session?.tenant.id ?? DEMO_TENANTS[0].id;
      setTeam((all) => [
        ...all,
        {
          id: uid(),
          tenant_id: tenantId,
          role: input.role,
          trade: input.trade,
          full_name: input.full_name,
          initials: initialsOf(input.full_name),
          phone: input.phone || null,
          active: true,
        },
      ]);
    },
    [session],
  );

  const updateMember = useCallback<AppState["updateMember"]>((id, input) => {
    setTeam((all) =>
      all.map((m) =>
        m.id === id
          ? {
              ...m,
              full_name: input.full_name,
              initials: initialsOf(input.full_name),
              trade: input.trade,
              phone: input.phone || null,
              role: input.role,
            }
          : m,
      ),
    );
  }, []);

  const setMemberActive = useCallback<AppState["setMemberActive"]>(
    (id, active) =>
      setTeam((all) => all.map((m) => (m.id === id ? { ...m, active } : m))),
    [],
  );

  const assign = useCallback<AppState["assign"]>(
    (jobId, who) => patchJob(jobId, who),
    [patchJob],
  );

  const createJob = useCallback<AppState["createJob"]>(
    (input) => {
      const tenantId = session?.tenant.id ?? DEMO_TENANTS[0].id;
      const next =
        Math.max(1000, ...jobs.map((j) => j.job_number)) + 1;
      const job: Job = {
        id: uid(),
        tenant_id: tenantId,
        job_number: next,
        client_name: input.client_name,
        address: input.address,
        quantity: input.quantity,
        quantity_unit: input.quantity_unit,
        description: input.description || null,
        fabricator_id: null,
        installer_id: null,
        material_used: null,
        status: "pendente",
        install_date: null,
        created_at: new Date().toISOString().slice(0, 10),
        photo_count: 0,
        reference_photo: null,
        financials: computeFinancials({
          sale_price: null,
          material_cost: null,
          fabrication_cost: null,
          installation_cost: null,
        }),
      };
      setJobs((all) => [job, ...all]);
      return job;
    },
    [jobs, session],
  );

  const markPaid = useCallback<AppState["markPaid"]>(
    (jobId, who) => {
      const today = new Date().toISOString().slice(0, 10);
      setJobs((all) =>
        all.map((j) => {
          if (j.id !== jobId || !j.financials) return j;
          const f = { ...j.financials };
          if (who === "fabricante") f.fabricator_paid_at = today;
          else f.installer_paid_at = today;
          return { ...j, financials: f };
        }),
      );
    },
    [],
  );

  const setFinancials = useCallback<AppState["setFinancials"]>(
    (jobId, values) =>
      setJobs((all) =>
        all.map((j) =>
          j.id === jobId
            ? {
                ...j,
                financials: computeFinancials({
                  ...values,
                  // editar valores não desfaz um pagamento já registrado
                  fabricator_paid_at: j.financials?.fabricator_paid_at ?? null,
                  installer_paid_at: j.financials?.installer_paid_at ?? null,
                }),
              }
            : j,
        ),
      ),
    [],
  );

  const value = useMemo<AppState>(
    () => ({
      lang,
      setLang,
      t,
      session,
      signIn,
      signOut,
      jobs,
      jobById: (id) => jobs.find((j) => j.id === id),
      photosOf: (jobId) => photos.filter((p) => p.job_id === jobId),
      notesOf: (jobId) =>
        notes
          .filter((n) => n.job_id === jobId)
          .sort((a, b) => b.created_at.localeCompare(a.created_at)),
      history: DEMO_HISTORY,
      team,
      memberById: (id) => (id ? team.find((m) => m.id === id) : undefined),
      addMember,
      updateMember,
      setMemberActive,
      assign,
      setStatus,
      setMaterial,
      addNote,
      addPhoto,
      createJob,
      setFinancials,
      myPayout: (job) =>
        session ? payoutFor(job, session.profile.id) : null,
      markPaid,
    }),
    [
      lang,
      t,
      session,
      signIn,
      signOut,
      jobs,
      photos,
      notes,
      team,
      addMember,
      updateMember,
      setMemberActive,
      assign,
      setStatus,
      setMaterial,
      addNote,
      addPhoto,
      createJob,
      setFinancials,
      markPaid,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp precisa estar dentro de <AppProvider>");
  return ctx;
}
