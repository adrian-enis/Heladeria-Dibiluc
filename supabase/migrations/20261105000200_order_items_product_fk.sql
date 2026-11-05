-- La base real no tiene esta llave foránea, aunque docs/03_database.md la define.
-- NOT VALID: protege las filas nuevas sin fallar si un pedido antiguo quedó huérfano.

alter table public.order_items
  drop constraint if exists order_items_product_id_fkey;

alter table public.order_items
  add constraint order_items_product_id_fkey
  foreign key (product_id) references public.products (id) not valid;
