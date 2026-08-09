-- ============================================================
-- Equipe: função na obra, contato e situação.
--
-- O papel (producao/gestao) diz qual app a pessoa abre.
-- A função (trade) diz onde ela pode ser escalada nos projetos.
-- São coisas diferentes: um dono de unidade pode fabricar, e um
-- fabricante nunca vê valores.
-- ============================================================

create type trade as enum ('fabricante', 'instalador', 'ambos');

alter table profiles
  add column trade  trade   not null default 'fabricante',
  add column phone  text,
  add column active boolean not null default true;

create index profiles_tenant_active_idx on profiles (tenant_id, active);

-- Escalação nos projetos passa a apontar para a equipe.
-- (jobs.fabricator_id e jobs.installer_id já existem desde 0001.)
create index jobs_fabricator_idx on jobs (tenant_id, fabricator_id);
create index jobs_installer_idx  on jobs (tenant_id, installer_id);

-- Só a gestão mexe no cadastro da equipe; a produção apenas lê,
-- para poder escalar quem já existe.
create policy profiles_insert_gestao on profiles for insert
  with check (tenant_id = current_tenant_id() and current_role_name() = 'gestao');

create policy profiles_update_gestao on profiles for update
  using (tenant_id = current_tenant_id() and current_role_name() = 'gestao')
  with check (tenant_id = current_tenant_id() and current_role_name() = 'gestao');

-- ============================================================
-- Faturamento e custo por fabricante, no período pedido.
--
-- A view respeita a RLS de job_financials: quem não é gestão
-- não recebe linha nenhuma, porque não enxerga a tabela de origem.
-- A data que define o período é a instalação; sem ela, a abertura.
-- ============================================================
create view fabricator_totals as
  select
    j.tenant_id,
    j.fabricator_id,
    coalesce(j.install_date, j.created_at::date) as reference_date,
    count(*)                        as jobs,
    sum(coalesce(f.sale_price, 0))  as revenue,
    sum(coalesce(f.total_cost, 0))  as cost,
    sum(coalesce(f.profit, 0))      as profit
  from jobs j
  left join job_financials f on f.job_id = j.id
  group by j.tenant_id, j.fabricator_id, coalesce(j.install_date, j.created_at::date);
