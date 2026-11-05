-- Arma la línea del pedido con el precio actual del producto.
create or replace function private.build_order_line(
  p_product_id integer,
  p_quantity integer
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  v_product record;
begin
  select p.id, p.name, p.price
  into v_product
  from public.products as p
  where p.id = p_product_id and p.is_active;

  if not found then
    raise exception 'PRODUCT_NOT_FOUND' using
      errcode = 'P0001',
      detail = jsonb_build_object('product_id', p_product_id)::text;
  end if;

  return jsonb_build_object(
    'product_id', v_product.id,
    'name', v_product.name,
    'quantity', p_quantity,
    'unit_price', v_product.price,
    'subtotal', v_product.price * p_quantity
  );
end;
$$;

revoke all on function private.build_order_line(integer, integer) from public;
