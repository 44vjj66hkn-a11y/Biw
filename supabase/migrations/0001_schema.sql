-- ============================================================
-- Boston Iron Works — Gestão de Produção
-- Schema inicial: unidades da franquia, usuários, projetos,
-- fotos, observações e financeiro.
--
-- Isolamento entre unidades é garantido por Row Level Security:
-- toda leitura e escrita é filtrada pelo tenant do usuário logado,
-- direto no banco. Mesmo uma chamada de API fora do app não
-- consegue enxergar dados de outra unidade.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- tipos ----------
create type job_status as enum ('pendente', 'em_producao', 'pronto', 'instalado');
create type user_role  as enum ('producao', 'gestao');
create type photo_kind as enum ('local', 'medida', 'referencia');
create type dimension_kind as enum ('largura', 'altura', 'comprimento');

-- ---------- unidades da franquia ----------
create table tenants (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,                     -- "Georgetown, MA"
  slug       text not null unique,              -- "georgetown-ma"
  created_at timestamptz not null default now()
);

-- ---------- usuários (1:1 com auth.users) ----------
create table profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  tenant_id  uuid not null references tenants (id) on delete restrict,
  role       user_role not null default 'producao',
  full_name  text not null,
  initials   text generated always as (
               upper(left(split_part(full_name, ' ', 1), 1)) ||
               upper(left(nullif(split_part(full_name, ' ', 2), ''), 1))
             ) stored,
  created_at timestamptz not null default now()
);
create index profiles_tenant_idx on profiles (tenant_id);

-- ---------- projetos ----------
-- Abertos pela gestão; a produção preenche fotos, medidas,
-- material e observações, e move o status até a instalação.
create table jobs (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenants (id) on delete cascade,
  job_number      integer not null,             -- sequencial por unidade (#1042)
  client_name     text not null,
  address         text not null,
  quantity        numeric(10,2) not null,
  quantity_unit   text not null default 'un',   -- un, m, m²
  description     text,                         -- "Guarda-corpo de varanda, escada e deck"
  fabricator_id   uuid references profiles (id) on delete set null,
  installer_id    uuid references profiles (id) on delete set null,
  material_used   text,                         -- preenchido pela produção
  status          job_status not null default 'pendente',
  install_date    date,
  created_by      uuid references profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (tenant_id, job_number)
);
create index jobs_tenant_created_idx on jobs (tenant_id, created_at desc);
create index jobs_tenant_status_idx  on jobs (tenant_id, status);

-- numeração sequencial por unidade
create or replace function set_job_number() returns trigger
language plpgsql as $$
begin
  if new.job_number is null then
    select coalesce(max(job_number), 1000) + 1 into new.job_number
      from jobs where tenant_id = new.tenant_id;
  end if;
  return new;
end $$;

create trigger jobs_set_number before insert on jobs
  for each row execute function set_job_number();

create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger jobs_touch before update on jobs
  for each row execute function touch_updated_at();

-- ---------- fotos ----------
-- kind = 'local'      → fotos do lugar
-- kind = 'medida'     → foto + a cota medida (dimension_value / dimension_kind)
-- kind = 'referencia' → foto de referência do trabalho, enviada na abertura
create table job_photos (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references tenants (id) on delete cascade,
  job_id          uuid not null references jobs (id) on delete cascade,
  kind            photo_kind not null,
  storage_path    text not null,                -- caminho no bucket job-photos
  caption         text,
  dimension_value numeric(10,2),                -- só para kind = 'medida'
  dimension_unit  text default 'm',
  dimension_kind  dimension_kind,
  uploaded_by     uuid references profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  constraint medida_tem_cota check (
    kind <> 'medida' or (dimension_value is not null and dimension_kind is not null)
  )
);
create index job_photos_job_idx on job_photos (job_id, kind, created_at);

-- ---------- observações ----------
create table job_notes (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants (id) on delete cascade,
  job_id     uuid not null references jobs (id) on delete cascade,
  author_id  uuid references profiles (id) on delete set null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index job_notes_job_idx on job_notes (job_id, created_at desc);

-- ---------- financeiro (somente gestão) ----------
-- Tabela separada de propósito: a produção não tem policy de
-- leitura aqui, então os valores não vazam nem por engano.
create table job_financials (
  job_id            uuid primary key references jobs (id) on delete cascade,
  tenant_id         uuid not null references tenants (id) on delete cascade,
  sale_price        numeric(12,2),
  material_cost     numeric(12,2),
  fabrication_cost  numeric(12,2),
  installation_cost numeric(12,2),
  total_cost numeric(12,2) generated always as (
    coalesce(material_cost,0) + coalesce(fabrication_cost,0) + coalesce(installation_cost,0)
  ) stored,
  profit numeric(12,2) generated always as (
    coalesce(sale_price,0)
      - (coalesce(material_cost,0) + coalesce(fabrication_cost,0) + coalesce(installation_cost,0))
  ) stored,
  profit_percent numeric(6,2) generated always as (
    case when coalesce(sale_price,0) = 0 then null
    else round(
      ((sale_price - (coalesce(material_cost,0) + coalesce(fabrication_cost,0) + coalesce(installation_cost,0)))
        / sale_price) * 100, 2)
    end
  ) stored,
  updated_at timestamptz not null default now()
);
create index job_financials_tenant_idx on job_financials (tenant_id);

create trigger job_financials_touch before update on job_financials
  for each row execute function touch_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

-- Helpers. SECURITY DEFINER para não recursar na policy de profiles.
create or replace function current_tenant_id() returns uuid
language sql stable security definer set search_path = public as $$
  select tenant_id from profiles where id = auth.uid()
$$;

create or replace function current_role_name() returns user_role
language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid()
$$;

alter table tenants        enable row level security;
alter table profiles       enable row level security;
alter table jobs           enable row level security;
alter table job_photos     enable row level security;
alter table job_notes      enable row level security;
alter table job_financials enable row level security;

-- unidades: cada um enxerga só a sua
create policy tenants_select on tenants for select
  using (id = current_tenant_id());

-- perfis: todos da mesma unidade (para listar fabricantes/instaladores)
create policy profiles_select on profiles for select
  using (tenant_id = current_tenant_id());
create policy profiles_update_self on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- projetos: produção e gestão leem e editam os da própria unidade;
-- só a gestão abre projeto novo ou apaga.
create policy jobs_select on jobs for select
  using (tenant_id = current_tenant_id());
create policy jobs_insert_gestao on jobs for insert
  with check (tenant_id = current_tenant_id() and current_role_name() = 'gestao');
create policy jobs_update on jobs for update
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());
create policy jobs_delete_gestao on jobs for delete
  using (tenant_id = current_tenant_id() and current_role_name() = 'gestao');

-- fotos e observações: quem é da unidade lê e escreve
create policy job_photos_all on job_photos for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

create policy job_notes_select on job_notes for select
  using (tenant_id = current_tenant_id());
create policy job_notes_insert on job_notes for insert
  with check (tenant_id = current_tenant_id() and author_id = auth.uid());
create policy job_notes_update_own on job_notes for update
  using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy job_notes_delete_own on job_notes for delete
  using (author_id = auth.uid());

-- financeiro: SOMENTE gestão da própria unidade
create policy job_financials_all_gestao on job_financials for all
  using (tenant_id = current_tenant_id() and current_role_name() = 'gestao')
  with check (tenant_id = current_tenant_id() and current_role_name() = 'gestao');

-- ============================================================
-- Storage: bucket privado das fotos
-- Caminho: <tenant_id>/<job_id>/<arquivo>
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('job-photos', 'job-photos', false)
  on conflict (id) do nothing;

create policy job_photos_read on storage.objects for select
  using (bucket_id = 'job-photos' and (storage.foldername(name))[1] = current_tenant_id()::text);
create policy job_photos_write on storage.objects for insert
  with check (bucket_id = 'job-photos' and (storage.foldername(name))[1] = current_tenant_id()::text);
create policy job_photos_remove on storage.objects for delete
  using (bucket_id = 'job-photos' and (storage.foldername(name))[1] = current_tenant_id()::text);
