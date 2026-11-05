-- Único punto público para crear pedidos. Corre en una sola transacción: si una
-- pieza falla, no se guarda nada.
create or replace function public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_customer record;
  v_item record;
  v_lines jsonb := '[]'::jsonb;
begin
  select * into v_customer
  from private.validate_order_customer(p_customer_name, p_customer_phone);

  for v_item in
    select * from private.normalize_order_items(p_items) order by product_id
  loop
    v_lines := v_lines || private.build_order_line(v_item.product_id, v_item.quantity);
  end loop;

  return private.save_order(v_customer.name, v_customer.phone, v_lines);
end;
$$;

revoke all on function public.create_order(text, text, jsonb) from public, anon, authenticated;
grant execute on function public.create_order(text, text, jsonb) to anon, authenticated;
