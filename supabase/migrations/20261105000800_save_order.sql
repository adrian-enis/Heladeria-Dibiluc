-- Guarda el pedido con sus líneas y devuelve el resumen para el cliente.
create or replace function private.save_order(
  p_name text,
  p_phone text,
  p_lines jsonb
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_total numeric(10, 2);
  v_order_id integer;
  v_order_date timestamp;
begin
  select sum((l.line ->> 'subtotal')::numeric)
  into v_total
  from jsonb_array_elements(p_lines) as l(line);

  insert into public.orders (customer_name, customer_phone, total_amount, order_date)
  values (p_name, p_phone, v_total, now())
  returning id, order_date into v_order_id, v_order_date;

  insert into public.order_items (order_id, product_id, quantity, price_at_purchase)
  select v_order_id, l.product_id, l.quantity, l.unit_price
  from jsonb_to_recordset(p_lines)
    as l(product_id integer, quantity integer, unit_price numeric(10, 2));

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_date', v_order_date,
    'total_amount', v_total,
    'items', p_lines
  );
end;
$$;

revoke all on function private.save_order(text, text, jsonb) from public;
