-- Catálogo según los afiches. Los productos sin precio confirmado quedan ocultos
-- (is_active = false) hasta tener su precio. Se puede repetir sin duplicar filas.

insert into public.products (name, description, price, category, is_active) values
  ('Chupis de fresa',     'Paquete de 12 chupis.', 5.00, 'chupi', true),
  ('Chupis de mantecado', 'Paquete de 12 chupis.', 5.00, 'chupi', true),
  ('Chupis de ron pasas', 'Paquete de 12 chupis.', 5.00, 'chupi', true),
  ('Chupis de chocolate', 'Paquete de 12 chupis.', 5.00, 'chupi', true),

  ('Vaso de fresa',       null, 0, 'vaso', false),
  ('Vaso de mantecado',   null, 0, 'vaso', false),
  ('Vaso de chocolate',   null, 0, 'vaso', false),
  ('Vaso de arequipe',    null, 0, 'vaso', false),
  ('Vaso de oreo',        null, 0, 'vaso', false),
  ('Vaso de ron pasas',   null, 0, 'vaso', false),
  ('Vaso napolitano',     null, 0, 'vaso', false),

  ('Paleta de samba',     null, 0, 'paleta', false),
  ('Paleta de galleta',   null, 0, 'paleta', false),
  ('Paleta de mantecado', null, 0, 'paleta', false),
  ('Paleta de chocolate', null, 0, 'paleta', false),
  ('Paleta de fresa',     null, 0, 'paleta', false),
  ('Paleta de arequipe',  null, 0, 'paleta', false),
  ('Paleta de oreo',      null, 0, 'paleta', false),
  ('Paleta de ron pasas', null, 0, 'paleta', false),

  ('Barquilla',           null, 0, 'barquilla', false)
on conflict (category, name) do nothing;
