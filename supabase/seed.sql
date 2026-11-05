-- Catálogo y precios confirmados por el negocio. Se puede repetir sin duplicar filas;
-- no cambia los precios de los productos que ya existen.

insert into public.products (name, description, price, category) values
  ('Chupis de fresa',     'Bolsa de 12 chupis cremosos.', 5.00, 'chupi'),
  ('Chupis de mantecado', 'Bolsa de 12 chupis cremosos.', 5.00, 'chupi'),
  ('Chupis de ron pasas', 'Bolsa de 12 chupis cremosos.', 5.00, 'chupi'),
  ('Chupis de chocolate', 'Bolsa de 12 chupis cremosos.', 5.00, 'chupi'),
  ('Chupis cítricos',     'Bolsa de chupis cítricos.',    4.00, 'chupi'),

  ('Tina de fresa',     null, 1.40, 'vaso'),
  ('Tina de mantecado', null, 1.40, 'vaso'),
  ('Tina de chocolate', null, 1.40, 'vaso'),
  ('Tina de arequipe',  null, 1.40, 'vaso'),
  ('Tina de oreo',      null, 1.40, 'vaso'),
  ('Tina de ron pasas', null, 1.40, 'vaso'),
  ('Tina napolitana',   null, 1.40, 'vaso'),

  ('Tina de fresa 250 g',     null, 2.30, 'vaso'),
  ('Tina de mantecado 250 g', null, 2.30, 'vaso'),
  ('Tina de chocolate 250 g', null, 2.30, 'vaso'),
  ('Tina de arequipe 250 g',  null, 2.30, 'vaso'),
  ('Tina de oreo 250 g',      null, 2.30, 'vaso'),
  ('Tina de ron pasas 250 g', null, 2.30, 'vaso'),
  ('Tina napolitana 250 g',   null, 2.30, 'vaso'),

  ('Paleta de samba',     null, 1.40, 'paleta'),
  ('Paleta de galleta',   null, 1.40, 'paleta'),
  ('Paleta de mantecado', null, 1.40, 'paleta'),
  ('Paleta de chocolate', null, 1.40, 'paleta'),
  ('Paleta de fresa',     null, 1.40, 'paleta'),
  ('Paleta de arequipe',  null, 1.40, 'paleta'),
  ('Paleta de oreo',      null, 1.40, 'paleta'),
  ('Paleta de ron pasas', null, 1.40, 'paleta'),

  ('Barquilla', null, 1.20, 'barquilla')
on conflict (category, name) do nothing;
