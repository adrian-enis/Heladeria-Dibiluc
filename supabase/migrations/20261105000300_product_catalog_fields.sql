-- category separa las líneas del catálogo; is_active oculta un sabor sin borrarlo,
-- porque order_items puede seguir apuntando a él.

alter table public.products
  add column if not exists category text not null default 'boli',
  add column if not exists is_active boolean not null default true;

alter table public.products
  drop constraint if exists products_category_check;

alter table public.products
  add constraint products_category_check check (category in ('boli', 'vasito'));

update public.products
set category = 'vasito'
where name ilike '%mantecado%';
