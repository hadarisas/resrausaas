-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE reservation_status AS ENUM (
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE user_role AS ENUM (
  'owner',
  'staff'
);

CREATE TYPE restaurant_theme AS ENUM (
  'fine-dining',
  'fast-food',
  'traditional',
  'modern',
  'minimal'
);

CREATE TYPE day_of_week AS ENUM (
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
);

-- ============================================================
-- RESTAURANTS
-- ============================================================
CREATE TABLE restaurants (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  description       TEXT,
  cuisine_type      TEXT,
  address           TEXT,
  city              TEXT,
  phone             TEXT,
  email             TEXT,
  website_url       TEXT,
  logo_url          TEXT,
  cover_image_url   TEXT,
  theme             restaurant_theme NOT NULL DEFAULT 'modern',
  is_published      BOOLEAN NOT NULL DEFAULT false,
  max_party_size    INTEGER NOT NULL DEFAULT 10,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_restaurants_slug ON restaurants (slug);
CREATE INDEX idx_restaurants_is_published ON restaurants (is_published);

-- ============================================================
-- PROFILES (extends auth.users 1:1)
-- ============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  role          user_role NOT NULL DEFAULT 'owner',
  full_name     TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_restaurant_id ON profiles (restaurant_id);

-- ============================================================
-- MENU CATEGORIES
-- ============================================================
CREATE TABLE menu_categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_restaurant_id ON menu_categories (restaurant_id);
CREATE INDEX idx_menu_categories_sort_order ON menu_categories (restaurant_id, sort_order);

-- ============================================================
-- MENU ITEMS
-- ============================================================
CREATE TABLE menu_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id     UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url       TEXT,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  allergens       TEXT[],
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_items_restaurant_id ON menu_items (restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items (category_id);
CREATE INDEX idx_menu_items_is_available ON menu_items (restaurant_id, is_available);

-- ============================================================
-- OPENING HOURS
-- ============================================================
CREATE TABLE opening_hours (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week   day_of_week NOT NULL,
  is_closed     BOOLEAN NOT NULL DEFAULT false,
  open_time     TIME,
  close_time    TIME,
  UNIQUE (restaurant_id, day_of_week),
  CONSTRAINT valid_hours CHECK (
    is_closed = true OR (open_time IS NOT NULL AND close_time IS NOT NULL AND open_time < close_time)
  )
);

CREATE INDEX idx_opening_hours_restaurant_id ON opening_hours (restaurant_id);

-- ============================================================
-- RESERVATIONS
-- ============================================================
CREATE TABLE reservations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  guest_name      TEXT NOT NULL,
  guest_email     TEXT NOT NULL,
  guest_phone     TEXT,
  party_size      INTEGER NOT NULL CHECK (party_size >= 1),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  status          reservation_status NOT NULL DEFAULT 'pending',
  notes           TEXT,
  internal_notes  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservations_restaurant_id ON reservations (restaurant_id);
CREATE INDEX idx_reservations_date ON reservations (restaurant_id, reservation_date);
CREATE INDEX idx_reservations_status ON reservations (restaurant_id, status);
CREATE INDEX idx_reservations_email ON reservations (guest_email);

-- ============================================================
-- REVENUE ENTRIES
-- ============================================================
CREATE TABLE revenue_entries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  entry_date    DATE NOT NULL,
  amount        NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  category      TEXT NOT NULL DEFAULT 'general',
  notes         TEXT,
  created_by    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (restaurant_id, entry_date, category)
);

CREATE INDEX idx_revenue_entries_restaurant_id ON revenue_entries (restaurant_id);
CREATE INDEX idx_revenue_entries_date ON revenue_entries (restaurant_id, entry_date);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER menu_categories_updated_at
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER revenue_entries_updated_at
  BEFORE UPDATE ON revenue_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE + RESTAURANT ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_restaurant_id UUID;
  base_slug TEXT;
  final_slug TEXT;
  slug_counter INTEGER := 0;
BEGIN
  base_slug := regexp_replace(
    lower(split_part(NEW.email, '@', 1)),
    '[^a-z0-9]', '-', 'g'
  );
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM restaurants WHERE slug = final_slug) LOOP
    slug_counter := slug_counter + 1;
    final_slug := base_slug || '-' || slug_counter;
  END LOOP;

  INSERT INTO restaurants (slug, name)
  VALUES (final_slug, COALESCE(NEW.raw_user_meta_data->>'restaurant_name', 'My Restaurant'))
  RETURNING id INTO new_restaurant_id;

  INSERT INTO opening_hours (restaurant_id, day_of_week, is_closed, open_time, close_time)
  VALUES
    (new_restaurant_id, 'monday',    false, '09:00', '22:00'),
    (new_restaurant_id, 'tuesday',   false, '09:00', '22:00'),
    (new_restaurant_id, 'wednesday', false, '09:00', '22:00'),
    (new_restaurant_id, 'thursday',  false, '09:00', '22:00'),
    (new_restaurant_id, 'friday',    false, '09:00', '23:00'),
    (new_restaurant_id, 'saturday',  false, '10:00', '23:00'),
    (new_restaurant_id, 'sunday',    true,  NULL,    NULL);

  INSERT INTO profiles (id, restaurant_id, role, full_name)
  VALUES (
    NEW.id,
    new_restaurant_id,
    'owner',
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
