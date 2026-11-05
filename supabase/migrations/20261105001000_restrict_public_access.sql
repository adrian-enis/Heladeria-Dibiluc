-- El navegador solo puede leer productos activos y llamar a create_order.

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Se borran las políticas anteriores para que quede solo lo definido aquí.
do $$
declare
  v_policy record;
begin
  for v_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('products', 'orders', 'order_items')
  loop
    execute format(
      'drop policy %I on %I.%I',
      v_policy.policyname, v_policy.schemaname, v_policy.tablename
    );
  end loop;
end;
$$;

revoke all on public.products, public.orders, public.order_items from anon, authenticated;

grant select on public.products to anon, authenticated;

create policy products_public_read
  on public.products
  for select
  to anon, authenticated
  using (is_active);
