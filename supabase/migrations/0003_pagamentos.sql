-- ============================================================
-- Pagamento de quem trabalhou no projeto.
--
-- O custo de fabricação é o que o fabricante recebe, e o custo de
-- instalação é o que o instalador recebe. Marcar como pago é da
-- gestão; a produção só consulta o próprio valor.
-- ============================================================

alter table job_financials
  add column fabricator_paid_at timestamptz,
  add column installer_paid_at  timestamptz;

-- ============================================================
-- O que a pessoa logada tem a receber.
--
-- SECURITY DEFINER de propósito: a produção não tem policy de
-- leitura em job_financials, então não consegue ver preço de venda,
-- custo de material nem margem. Esta função devolve exclusivamente
-- o valor do próprio trabalho de quem chamou — nada mais.
-- ============================================================
create or replace function my_payouts()
returns table (
  job_id         uuid,
  job_number     integer,
  client_name    text,
  reference_date date,
  paid_role      text,
  amount         numeric,
  paid_at        timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select j.id, j.job_number, j.client_name,
         coalesce(j.install_date, j.created_at::date),
         'fabricante', f.fabrication_cost, f.fabricator_paid_at
    from jobs j
    join job_financials f on f.job_id = j.id
   where j.tenant_id = current_tenant_id()
     and j.fabricator_id = auth.uid()
     and f.fabrication_cost is not null

  union all

  select j.id, j.job_number, j.client_name,
         coalesce(j.install_date, j.created_at::date),
         'instalador', f.installation_cost, f.installer_paid_at
    from jobs j
    join job_financials f on f.job_id = j.id
   where j.tenant_id = current_tenant_id()
     and j.installer_id = auth.uid()
     and f.installation_cost is not null
$$;

revoke all on function my_payouts() from public;
grant execute on function my_payouts() to authenticated;
