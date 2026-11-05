-- Descuenta el stock de un producto y devuelve la línea del pedido.
create or replace function private.reserve_product_stock(
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
  -- FOR UPDATE retiene la fila: el pedido simultáneo espera y lee el stock ya descontado.
  select p.id, p.name, p.price, p.stock
  into v_product
  from public.products as p
  where p.id = p_product_id and p.is_active
  for update;

  if not found then
    raise exception 'PRODUCT_NOT_FOUND' using
      errcode = 'P0001',
      detail = jsonb_build_object('product_id', p_product_id)::text;
  end if;

  if v_product.stock < p_quantity then
    raise exception 'OUT_OF_STOCK' using
      errcode = 'P0001',
      detail = jsonb_build_object(
        'product_id', v_product.id,
        'name', v_product.name,
        'available', v_product.stock
      )::text;
  end if;

  update public.products
  set stock = stock - p_quantity
  where id = v_product.id;

  return jsonb_build_object(
    'product_id', v_product.id,
    'name', v_product.name,
    'quantity', p_quantity,
    'unit_price', v_product.price,
    'subtotal', v_product.price * p_quantity
  );
end;
$$;

revoke all on function private.reserve_product_stock(integer, integer) from public;
