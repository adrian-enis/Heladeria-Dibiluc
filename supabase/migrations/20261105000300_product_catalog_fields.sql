-- category separa las líneas del catálogo; is_active oculta un producto sin borrarlo,
-- porque order_items puede seguir apuntando a él.

alter table public.products
  add column if not exists category text not null default 'chupi',
  add column if not exists is_active boolean not null default true;

alter table public.products
  drop constraint if exists products_category_check,
  drop constraint if exists products_category_name_key;

alter table public.products
  add constraint products_category_check
    check (category in ('chupi', 'boli', 'vaso', 'paleta', 'barquilla')),
  add constraint products_category_name_key unique (category, name);
