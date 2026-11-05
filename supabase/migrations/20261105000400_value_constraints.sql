-- NOT VALID: aplica a filas nuevas o modificadas, sin fallar por datos antiguos.

alter table public.products
  drop constraint if exists products_stock_not_negative,
  drop constraint if exists products_price_not_negative;

alter table public.products
  add constraint products_stock_not_negative check (stock >= 0) not valid,
  add constraint products_price_not_negative check (price >= 0) not valid;

alter table public.order_items
  drop constraint if exists order_items_quantity_positive;

alter table public.order_items
  add constraint order_items_quantity_positive check (quantity > 0) not valid;
