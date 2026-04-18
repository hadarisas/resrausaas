-- ============================================================
-- SEED: Demo restaurant
-- Run AFTER creating a user via the signup page.
-- Replace 'demo' with the actual slug created for your user.
-- ============================================================

-- Update the auto-created restaurant for the demo user
UPDATE restaurants
SET
  name            = 'Bella Vista Ristorante',
  description     = 'Authentic Italian cuisine in the heart of the city. Family recipes passed down through generations, fresh ingredients sourced daily from local farms.',
  cuisine_type    = 'Italian',
  address         = '123 Via Roma',
  city            = 'San Francisco',
  phone           = '+1 (415) 555-0192',
  email           = 'info@bellavista.com',
  website_url     = 'https://bellavista.com',
  theme           = 'fine-dining',
  is_published    = true,
  max_party_size  = 12
WHERE slug = (SELECT slug FROM restaurants ORDER BY created_at DESC LIMIT 1);

-- Insert menu categories
WITH r AS (SELECT id FROM restaurants ORDER BY created_at DESC LIMIT 1)
INSERT INTO menu_categories (restaurant_id, name, description, sort_order)
SELECT r.id, cat.name, cat.description, cat.sort_order
FROM r, (VALUES
  ('Antipasti',   'Start your meal the Italian way',        0),
  ('Primi',       'Pasta and risotto dishes',               1),
  ('Secondi',     'Main courses',                           2),
  ('Dolci',       'Desserts to finish on a sweet note',     3)
) AS cat(name, description, sort_order);

-- Insert menu items
WITH
  r AS (SELECT id FROM restaurants ORDER BY created_at DESC LIMIT 1),
  c_antipasti AS (SELECT id FROM menu_categories WHERE name = 'Antipasti' AND restaurant_id = (SELECT id FROM r)),
  c_primi     AS (SELECT id FROM menu_categories WHERE name = 'Primi'     AND restaurant_id = (SELECT id FROM r)),
  c_secondi   AS (SELECT id FROM menu_categories WHERE name = 'Secondi'   AND restaurant_id = (SELECT id FROM r)),
  c_dolci     AS (SELECT id FROM menu_categories WHERE name = 'Dolci'     AND restaurant_id = (SELECT id FROM r))
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_available, is_featured, sort_order)
VALUES
  ((SELECT id FROM r), (SELECT id FROM c_antipasti), 'Bruschetta al Pomodoro',  'Grilled bread, cherry tomatoes, fresh basil, extra-virgin olive oil',     9.50,  true, true,  0),
  ((SELECT id FROM r), (SELECT id FROM c_antipasti), 'Caprese Mozzarella',      'Buffalo mozzarella, heirloom tomatoes, basil oil',                       14.00, true, false, 1),
  ((SELECT id FROM r), (SELECT id FROM c_antipasti), 'Carpaccio di Manzo',      'Thinly sliced beef, arugula, Parmigiano shavings, lemon dressing',       16.50, true, false, 2),
  ((SELECT id FROM r), (SELECT id FROM c_primi),     'Tagliatelle al Ragù',     'Handmade pasta, slow-cooked Bolognese, Parmigiano Reggiano',             22.00, true, true,  0),
  ((SELECT id FROM r), (SELECT id FROM c_primi),     'Cacio e Pepe',            'Tonnarelli pasta, Pecorino Romano, black pepper',                       19.50, true, false, 1),
  ((SELECT id FROM r), (SELECT id FROM c_primi),     'Risotto ai Funghi',       'Carnaroli rice, porcini mushrooms, truffle oil, Parmigiano',            24.00, true, true,  2),
  ((SELECT id FROM r), (SELECT id FROM c_secondi),   'Branzino al Forno',       'Oven-roasted sea bass, capers, olives, cherry tomatoes',                32.00, true, false, 0),
  ((SELECT id FROM r), (SELECT id FROM c_secondi),   'Costata di Manzo',        '300g ribeye steak, rosemary potatoes, chimichurri',                     45.00, true, true,  1),
  ((SELECT id FROM r), (SELECT id FROM c_dolci),     'Tiramisù della Casa',     'Classic house recipe, Savoiardi, mascarpone, espresso',                  9.00, true, true,  0),
  ((SELECT id FROM r), (SELECT id FROM c_dolci),     'Panna Cotta',             'Vanilla cream, seasonal berry compote',                                   8.00, true, false, 1);

-- Insert upcoming reservations
WITH r AS (SELECT id FROM restaurants ORDER BY created_at DESC LIMIT 1)
INSERT INTO reservations (restaurant_id, guest_name, guest_email, guest_phone, party_size, reservation_date, reservation_time, status, notes)
SELECT r.id, res.name, res.email, res.phone, res.party_size::integer, res.res_date::date, res.res_time::time, res.status::reservation_status, res.notes
FROM r, (VALUES
  ('Marco Rossi',    'marco@example.com',  '+1555001', '2', (CURRENT_DATE + 1)::text,  '19:00', 'confirmed', 'Anniversary dinner, window table please'),
  ('Sarah Chen',     'sarah@example.com',  '+1555002', '4', (CURRENT_DATE + 1)::text,  '20:00', 'pending',   'Birthday celebration'),
  ('James Williams', 'james@example.com',  '+1555003', '6', (CURRENT_DATE + 2)::text,  '19:30', 'confirmed', NULL),
  ('Emma Davis',     'emma@example.com',   '+1555004', '2', (CURRENT_DATE + 3)::text,  '20:30', 'pending',   'Vegetarian menu'),
  ('Luigi Bianchi',  'luigi@example.com',  '+1555005', '8', (CURRENT_DATE + 4)::text,  '18:30', 'confirmed', 'Corporate dinner')
) AS res(name, email, phone, party_size, res_date, res_time, status, notes);

-- Insert 30 days of revenue data
WITH r AS (SELECT id FROM restaurants ORDER BY created_at DESC LIMIT 1)
INSERT INTO revenue_entries (restaurant_id, entry_date, amount, category, notes)
SELECT
  r.id,
  (CURRENT_DATE - s.n)::date,
  ROUND((RANDOM() * 2500 + 500)::numeric, 2),
  'general',
  'Daily revenue'
FROM r, generate_series(0, 29) AS s(n)
ON CONFLICT (restaurant_id, entry_date, category) DO NOTHING;
