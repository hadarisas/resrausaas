-- ============================================================
-- SEED: Demo restaurant "Aurelia" (parity with saas-landing-dummy.ts)
-- Images: Unsplash URLs from marketing dummy — hero, about-style copy, menu, gallery.
-- Idempotent: upserts by slug `aurelia` and replaces dependent rows.
--
-- Owner dashboard coverage (what restaurateurs can edit in the app):
--   restaurants.* (INSERT … ON CONFLICT below)
--     • slug, name, description, cuisine_type, address, city, phone, email, website_url
--       → Settings → Restaurant Info (+ public URL slug).
--     • logo_url, cover_image_url → Settings (logo: upload; hero: "Hero / cover image URL").
--     • theme → Settings → Theme.
--     • is_published, max_party_size → Settings → Restaurant Info.
--     • trial_ends_at, subscription_ends_at, access_status, billing_notes → platform/admin only
--       (not shown in owner Settings; seed sets active + long trial for demos).
--   menu_categories / menu_items → Dashboard → Menu (categories, items, images, availability,
--     featured flag, sort order — matches Starters/Mains/Desserts and dish ordering in seed).
--   opening_hours → Settings → Opening Hours.
--   reservations, revenue_entries → Dashboard → Reservations / Revenue (sample data only;
--       editable or deletable in-app; not part of "restaurant profile" settings).
--
-- Optional: attach your auth user to this tenant for dashboard login:
--   UPDATE profiles
--   SET restaurant_id = (SELECT id FROM restaurants WHERE slug = 'aurelia')
--   WHERE id = '<your-auth-user-uuid>';
-- ============================================================

-- Clear dependent rows for this slug (safe if restaurant does not exist yet)
DELETE FROM menu_items
WHERE restaurant_id IN (SELECT id FROM restaurants WHERE slug = 'aurelia');

DELETE FROM menu_categories
WHERE restaurant_id IN (SELECT id FROM restaurants WHERE slug = 'aurelia');

DELETE FROM reservations
WHERE restaurant_id IN (SELECT id FROM restaurants WHERE slug = 'aurelia');

DELETE FROM revenue_entries
WHERE restaurant_id IN (SELECT id FROM restaurants WHERE slug = 'aurelia');

DELETE FROM opening_hours
WHERE restaurant_id IN (SELECT id FROM restaurants WHERE slug = 'aurelia');

INSERT INTO restaurants (
  slug,
  name,
  description,
  cuisine_type,
  address,
  city,
  phone,
  email,
  website_url,
  logo_url,
  cover_image_url,
  theme,
  is_published,
  max_party_size,
  trial_ends_at,
  subscription_ends_at,
  access_status,
  billing_notes
) VALUES (
  'aurelia',
  'Aurelia',
  'TableFlow gives you a dedicated page for your cuisine, team, and atmosphere — not a generic listing. Edit copy and imagery anytime so first-time guests know exactly what to expect before they book.',
  'Contemporary',
  'Av. Allal ben Abdallah',
  'Rabat',
  '+212 6 00 00 00 00',
  'hello@tableflow.app',
  'https://tableflow.app',
  -- Logo: square crop from hero imagery (marketing demo uses same visual language)
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&auto=format&q=80',
  -- Hero (saasLandingContent.hero.heroImageUrl)
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&auto=format&fit=crop',
  'fine-dining',
  true,
  12,
  NOW() + INTERVAL '365 days',
  '2099-01-01 00:00:00+00'::timestamptz,
  'active',
  'Seed: Aurelia demo (saas-landing-dummy.ts)'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  cuisine_type = EXCLUDED.cuisine_type,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  website_url = EXCLUDED.website_url,
  logo_url = EXCLUDED.logo_url,
  cover_image_url = EXCLUDED.cover_image_url,
  theme = EXCLUDED.theme,
  is_published = EXCLUDED.is_published,
  max_party_size = EXCLUDED.max_party_size,
  trial_ends_at = EXCLUDED.trial_ends_at,
  subscription_ends_at = EXCLUDED.subscription_ends_at,
  access_status = EXCLUDED.access_status,
  billing_notes = EXCLUDED.billing_notes;

-- Menu categories (Starters, Mains, Desserts) — sort_order matches dummy order
WITH r AS (SELECT id FROM restaurants WHERE slug = 'aurelia' LIMIT 1),
ins AS (
  INSERT INTO menu_categories (restaurant_id, name, description, sort_order)
  SELECT r.id, v.name, v.description, v.sort_order
  FROM r,
    (VALUES
      ('Starters', 'Small plates and first courses', 0),
      ('Mains', 'Chef''s mains', 1),
      ('Desserts', 'Sweet finishes', 2)
    ) AS v(name, description, sort_order)
  RETURNING id, name, restaurant_id
)
SELECT 1; -- CTE for side effect only; categories inserted above

-- Starters
WITH r AS (SELECT id AS rid FROM restaurants WHERE slug = 'aurelia' LIMIT 1),
c_starters AS (
  SELECT id FROM menu_categories WHERE restaurant_id = (SELECT rid FROM r) AND name = 'Starters' LIMIT 1
)
INSERT INTO menu_items (
  restaurant_id,
  category_id,
  name,
  description,
  price,
  image_url,
  is_available,
  is_featured,
  sort_order
)
SELECT
  (SELECT rid FROM r),
  (SELECT id FROM c_starters),
  v.name,
  v.description,
  v.price,
  v.image_url,
  true,
  v.is_featured,
  v.sort_order
FROM (VALUES
  (
    'Burrata & heirloom tomato',
    'Basil oil, aged balsamic, toasted sourdough',
    18.00,
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
    true,
    0
  ),
  (
    'Seared scallops',
    'Cauliflower purée, crispy pancetta, lemon butter',
    24.00,
    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80&auto=format&fit=crop',
    false,
    1
  ),
  (
    'Wild mushroom tart',
    'Truffle cream, chive oil, microgreens',
    16.00,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop',
    false,
    2
  )
) AS v(name, description, price, image_url, is_featured, sort_order);

WITH r AS (SELECT id AS rid FROM restaurants WHERE slug = 'aurelia' LIMIT 1),
c_mains AS (
  SELECT id FROM menu_categories WHERE restaurant_id = (SELECT rid FROM r) AND name = 'Mains' LIMIT 1
)
INSERT INTO menu_items (
  restaurant_id,
  category_id,
  name,
  description,
  price,
  image_url,
  is_available,
  is_featured,
  sort_order
)
SELECT
  (SELECT rid FROM r),
  (SELECT id FROM c_mains),
  v.name,
  v.description,
  v.price,
  v.image_url,
  true,
  v.is_featured,
  v.sort_order
FROM (VALUES
  (
    'Dry-aged ribeye',
    'Charred spring onion, red wine jus, hand-cut fries',
    48.00,
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80&auto=format&fit=crop',
    true,
    0
  ),
  (
    'Pan-roasted halibut',
    'Saffron velouté, fennel salad, caper brown butter',
    42.00,
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop',
    false,
    1
  ),
  (
    'Hand-cut pappardelle',
    'Slow-braised lamb ragù, pecorino, fresh oregano',
    32.00,
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80&auto=format&fit=crop',
    false,
    2
  )
) AS v(name, description, price, image_url, is_featured, sort_order);

WITH r AS (SELECT id AS rid FROM restaurants WHERE slug = 'aurelia' LIMIT 1),
c_desserts AS (
  SELECT id FROM menu_categories WHERE restaurant_id = (SELECT rid FROM r) AND name = 'Desserts' LIMIT 1
)
INSERT INTO menu_items (
  restaurant_id,
  category_id,
  name,
  description,
  price,
  image_url,
  is_available,
  is_featured,
  sort_order
)
SELECT
  (SELECT rid FROM r),
  (SELECT id FROM c_desserts),
  v.name,
  v.description,
  v.price,
  v.image_url,
  true,
  v.is_featured,
  v.sort_order
FROM (VALUES
  (
    'Dark chocolate soufflé',
    'Vanilla anglaise, Maldon salt',
    14.00,
    'https://images.unsplash.com/photo-1583208096263-c4141ffd63ca?w=800&q=80&auto=format&fit=crop',
    true,
    0
  ),
  (
    'Citrus olive oil cake',
    'Whipped mascarpone, blood orange',
    12.00,
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80&auto=format&fit=crop',
    false,
    1
  )
) AS v(name, description, price, image_url, is_featured, sort_order);

-- Opening hours: dinner-focused venue (adjust as needed)
-- Cast enum at the literal so VALUES does not infer `dow` as text (42804).
WITH r AS (SELECT id FROM restaurants WHERE slug = 'aurelia' LIMIT 1)
INSERT INTO opening_hours (restaurant_id, day_of_week, is_closed, open_time, close_time)
SELECT r.id, d.dow, d.is_closed, d.open_t, d.close_t
FROM r,
  (VALUES
    ('monday'::day_of_week,    false, '12:00'::time, '22:00'::time),
    ('tuesday'::day_of_week,   false, '12:00'::time, '22:00'::time),
    ('wednesday'::day_of_week, false, '12:00'::time, '22:00'::time),
    ('thursday'::day_of_week,  false, '12:00'::time, '23:00'::time),
    ('friday'::day_of_week,    false, '12:00'::time, '23:00'::time),
    ('saturday'::day_of_week,  false, '11:00'::time, '23:00'::time),
    ('sunday'::day_of_week,    false, '11:00'::time, '21:00'::time)
  ) AS d(dow, is_closed, open_t, close_t);

-- Sample reservations (dashboard demo)
WITH r AS (SELECT id FROM restaurants WHERE slug = 'aurelia' LIMIT 1)
INSERT INTO reservations (restaurant_id, guest_name, guest_email, guest_phone, party_size, reservation_date, reservation_time, status, notes)
SELECT r.id, res.name, res.email, res.phone, res.party_size::integer, res.res_date::date, res.res_time::time, res.status::reservation_status, res.notes
FROM r, (VALUES
  ('Yasmine Alami', 'yasmine@example.com', '+212600000001', '2', (CURRENT_DATE + 1)::text, '19:30', 'confirmed', 'Window table'),
  ('Omar Benali',   'omar@example.com',    '+212600000002', '4', (CURRENT_DATE + 2)::text, '20:00', 'pending',   'Birthday'),
  ('Sofia Idrissi', 'sofia@example.com',   '+212600000003', '2', (CURRENT_DATE + 3)::text, '21:00', 'confirmed', NULL)
) AS res(name, email, phone, party_size, res_date, res_time, status, notes);

-- Revenue sample (30 days; matches 003_seed pattern)
WITH r AS (SELECT id FROM restaurants WHERE slug = 'aurelia' LIMIT 1)
INSERT INTO revenue_entries (restaurant_id, entry_date, amount, category, notes)
SELECT
  r.id,
  (CURRENT_DATE - s.n)::date,
  ROUND((RANDOM() * 2500 + 800)::numeric, 2),
  'general',
  'Daily revenue (Aurelia seed)'
FROM r, generate_series(0, 29) AS s(n)
ON CONFLICT (restaurant_id, entry_date, category) DO UPDATE SET
  amount = EXCLUDED.amount,
  notes = EXCLUDED.notes;
