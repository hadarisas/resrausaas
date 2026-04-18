-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION get_my_restaurant_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT restaurant_id FROM profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- ============================================================
-- ENABLE RLS
-- ============================================================
ALTER TABLE restaurants      ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_entries  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RESTAURANTS
-- ============================================================
CREATE POLICY "public_read_published_restaurants"
  ON restaurants FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "auth_read_own_restaurant"
  ON restaurants FOR SELECT TO authenticated
  USING (id = get_my_restaurant_id());

CREATE POLICY "owner_update_own_restaurant"
  ON restaurants FOR UPDATE TO authenticated
  USING (id = get_my_restaurant_id() AND get_my_role() = 'owner')
  WITH CHECK (id = get_my_restaurant_id());

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "auth_read_own_profile"
  ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "auth_update_own_profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "owner_read_restaurant_profiles"
  ON profiles FOR SELECT TO authenticated
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'owner');

-- ============================================================
-- MENU CATEGORIES
-- ============================================================
CREATE POLICY "public_read_active_categories"
  ON menu_categories FOR SELECT TO anon
  USING (
    is_active = true
    AND EXISTS (SELECT 1 FROM restaurants r WHERE r.id = menu_categories.restaurant_id AND r.is_published = true)
  );

CREATE POLICY "auth_select_own_categories"
  ON menu_categories FOR SELECT TO authenticated
  USING (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_insert_own_categories"
  ON menu_categories FOR INSERT TO authenticated
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_update_own_categories"
  ON menu_categories FOR UPDATE TO authenticated
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_delete_own_categories"
  ON menu_categories FOR DELETE TO authenticated
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'owner');

-- ============================================================
-- MENU ITEMS
-- ============================================================
CREATE POLICY "public_read_available_items"
  ON menu_items FOR SELECT TO anon
  USING (
    is_available = true
    AND EXISTS (SELECT 1 FROM restaurants r WHERE r.id = menu_items.restaurant_id AND r.is_published = true)
  );

CREATE POLICY "auth_select_own_items"
  ON menu_items FOR SELECT TO authenticated
  USING (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_insert_own_items"
  ON menu_items FOR INSERT TO authenticated
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_update_own_items"
  ON menu_items FOR UPDATE TO authenticated
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_delete_own_items"
  ON menu_items FOR DELETE TO authenticated
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'owner');

-- ============================================================
-- OPENING HOURS
-- ============================================================
CREATE POLICY "public_read_opening_hours"
  ON opening_hours FOR SELECT TO anon
  USING (
    EXISTS (SELECT 1 FROM restaurants r WHERE r.id = opening_hours.restaurant_id AND r.is_published = true)
  );

CREATE POLICY "auth_select_own_hours"
  ON opening_hours FOR SELECT TO authenticated
  USING (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_insert_own_hours"
  ON opening_hours FOR INSERT TO authenticated
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_update_own_hours"
  ON opening_hours FOR UPDATE TO authenticated
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "owner_delete_own_hours"
  ON opening_hours FOR DELETE TO authenticated
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'owner');

-- ============================================================
-- RESERVATIONS
-- ============================================================
CREATE POLICY "public_insert_reservation"
  ON reservations FOR INSERT TO anon
  WITH CHECK (
    EXISTS (SELECT 1 FROM restaurants r WHERE r.id = reservations.restaurant_id AND r.is_published = true)
  );

CREATE POLICY "auth_select_own_reservations"
  ON reservations FOR SELECT TO authenticated
  USING (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_insert_own_reservations"
  ON reservations FOR INSERT TO authenticated
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "auth_update_own_reservations"
  ON reservations FOR UPDATE TO authenticated
  USING (restaurant_id = get_my_restaurant_id())
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "owner_delete_reservations"
  ON reservations FOR DELETE TO authenticated
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'owner');

-- ============================================================
-- REVENUE ENTRIES
-- ============================================================
CREATE POLICY "owner_select_revenue"
  ON revenue_entries FOR SELECT TO authenticated
  USING (restaurant_id = get_my_restaurant_id());

CREATE POLICY "owner_insert_revenue"
  ON revenue_entries FOR INSERT TO authenticated
  WITH CHECK (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'owner');

CREATE POLICY "owner_update_revenue"
  ON revenue_entries FOR UPDATE TO authenticated
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'owner')
  WITH CHECK (restaurant_id = get_my_restaurant_id());

CREATE POLICY "owner_delete_revenue"
  ON revenue_entries FOR DELETE TO authenticated
  USING (restaurant_id = get_my_restaurant_id() AND get_my_role() = 'owner');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('restaurant-logos', 'restaurant-logos', true),
  ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "auth_upload_logo"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'restaurant-logos'
    AND (storage.foldername(name))[1] = get_my_restaurant_id()::text
  );

CREATE POLICY "auth_upload_menu_image"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'menu-images'
    AND (storage.foldername(name))[1] = get_my_restaurant_id()::text
  );

CREATE POLICY "public_read_logos"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'restaurant-logos');

CREATE POLICY "public_read_menu_images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'menu-images');

CREATE POLICY "auth_delete_own_objects"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    (bucket_id = 'restaurant-logos' OR bucket_id = 'menu-images')
    AND (storage.foldername(name))[1] = get_my_restaurant_id()::text
  );
