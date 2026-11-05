-- El esquema private no se expone por la API: guarda las piezas internas de create_order.
create schema if not exists private;
revoke all on schema private from public;

-- Valida los datos del cliente y los devuelve sin espacios sobrantes.
create or replace function private.validate_order_customer(
  p_name text,
  p_phone text,
  out name text,
  out phone text
)
language plpgsql
set search_path = ''
as $$
declare
  v_digits integer;
begin
  name := btrim(coalesce(p_name, ''));
  phone := btrim(coalesce(p_phone, ''));
  v_digits := length(regexp_replace(phone, '[^0-9]', '', 'g'));

  if name = '' or length(name) > 120 then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001', detail = 'name';
  end if;

  if length(phone) > 20 or v_digits not between 7 and 15
     or phone !~ '^\+?[0-9][0-9 -]*$' then
    raise exception 'INVALID_CUSTOMER' using errcode = 'P0001', detail = 'phone';
  end if;
end;
$$;

revoke all on function private.validate_order_customer(text, text) from public;
