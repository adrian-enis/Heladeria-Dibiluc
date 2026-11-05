-- Valida la lista recibida y suma las líneas repetidas de un mismo producto.
create or replace function private.normalize_order_items(p_items jsonb)
returns table (product_id integer, quantity integer)
language plpgsql
set search_path = ''
as $$
declare
  c_max_lines constant integer := 30;
  c_max_quantity constant integer := 100;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0
     or jsonb_array_length(p_items) > c_max_lines then
    raise exception 'INVALID_ITEMS' using errcode = 'P0001';
  end if;

  -- Los dos enteros se revisan como texto, antes de convertirlos.
  if exists (
    select 1
    from jsonb_array_elements(p_items) as e(item)
    where jsonb_typeof(e.item) <> 'object'
       or coalesce(jsonb_typeof(e.item -> 'product_id'), '') <> 'number'
       or coalesce(jsonb_typeof(e.item -> 'quantity'), '') <> 'number'
       or (e.item ->> 'product_id') !~ '^[1-9][0-9]{0,8}$'
       or (e.item ->> 'quantity') !~ '^[1-9][0-9]{0,8}$'
  ) then
    raise exception 'INVALID_ITEMS' using errcode = 'P0001';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as e(item)
    group by e.item ->> 'product_id'
    having sum((e.item ->> 'quantity')::integer) > c_max_quantity
  ) then
    raise exception 'INVALID_ITEMS' using errcode = 'P0001';
  end if;

  return query
    select (e.item ->> 'product_id')::integer,
           sum((e.item ->> 'quantity')::integer)::integer
    from jsonb_array_elements(p_items) as e(item)
    group by 1;
end;
$$;

revoke all on function private.normalize_order_items(jsonb) from public;
