-- La disponibilidad se confirma por WhatsApp al recibir el pedido.
-- Si el stock vuelve a controlarse aquí, se agrega con una migración nueva.

alter table public.products
  drop column if exists stock;
