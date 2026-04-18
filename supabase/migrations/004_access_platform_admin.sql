-- ============================================================
-- ACCESS CONTROL + PLATFORM ADMINS
-- Trial: 14 days. After expiry without paid sub -> readonly + unpublished.
--
-- After migrate, grant platform admin (replace with your auth user id):
--   INSERT INTO platform_admins (user_id) VALUES ('<uuid-from-auth.users>');
-- ============================================================

CREATE TYPE restaurant_access_status AS ENUM (
  'trial',
  'active',
  'readonly',
  'suspended'
);

ALTER TABLE restaurants
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS access_status restaurant_access_status,
  ADD COLUMN IF NOT EXISTS billing_notes TEXT;

-- Backfill existing rows (grandfather: treat as paid through far future)
UPDATE restaurants
SET
  trial_ends_at = COALESCE(trial_ends_at, created_at + interval '14 days'),
  subscription_ends_at = COALESCE(subscription_ends_at, '2099-01-01 00:00:00+00'::timestamptz),
  access_status = COALESCE(access_status, 'active'::restaurant_access_status),
  billing_notes = COALESCE(billing_notes, 'Migrated: active subscription placeholder')
WHERE trial_ends_at IS NULL OR access_status IS NULL;

ALTER TABLE restaurants
  ALTER COLUMN trial_ends_at SET NOT NULL,
  ALTER COLUMN access_status SET NOT NULL;

ALTER TABLE restaurants
  ALTER COLUMN trial_ends_at SET DEFAULT (now() + interval '14 days');

ALTER TABLE restaurants
  ALTER COLUMN access_status SET DEFAULT 'trial';

-- ============================================================
-- PLATFORM ADMINS
-- ============================================================
CREATE TABLE platform_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_platform_admins_user_id ON platform_admins (user_id);

ALTER TABLE platform_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_admin_read_own_row"
  ON platform_admins FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- ============================================================
CREATE OR REPLACE FUNCTION is_platform_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM platform_admins WHERE user_id = uid);
$$;

CREATE OR REPLACE FUNCTION restaurant_has_full_access(p_restaurant_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r restaurants%ROWTYPE;
BEGIN
  SELECT * INTO r FROM restaurants WHERE id = p_restaurant_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  IF r.access_status = 'suspended' THEN
    RETURN false;
  END IF;
  IF r.access_status = 'readonly' THEN
    RETURN false;
  END IF;
  IF r.access_status = 'trial' AND r.trial_ends_at > now() THEN
    RETURN true;
  END IF;
  IF r.access_status = 'active'
     AND r.subscription_ends_at IS NOT NULL
     AND r.subscription_ends_at > now() THEN
    RETURN true;
  END IF;
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION restaurant_entitlement_public(r restaurants)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT
    r.is_published = true
    AND (
      (r.access_status = 'trial' AND r.trial_ends_at > now())
      OR (
        r.access_status = 'active'
        AND r.subscription_ends_at IS NOT NULL
        AND r.subscription_ends_at > now()
      )
    );
$$;

CREATE OR REPLACE FUNCTION sync_restaurant_access_if_expired(p_restaurant_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed BOOLEAN;
BEGIN
  allowed :=
    (p_restaurant_id = get_my_restaurant_id())
    OR is_platform_admin(auth.uid());
  IF NOT allowed THEN
    RAISE EXCEPTION 'not allowed';
  END IF;

  UPDATE restaurants r
  SET
    access_status = 'readonly',
    is_published = false,
    updated_at = now()
  WHERE r.id = p_restaurant_id
    AND (
      (r.access_status = 'trial' AND r.trial_ends_at <= now())
      OR (
        r.access_status = 'active'
        AND r.subscription_ends_at IS NOT NULL
        AND r.subscription_ends_at <= now()
      )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION sync_restaurant_access_if_expired(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION restaurant_has_full_access(UUID) TO authenticated;

-- ============================================================
-- SIGNUP: 14-day trial
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

  INSERT INTO restaurants (slug, name, trial_ends_at, access_status, subscription_ends_at)
  VALUES (
    final_slug,
    COALESCE(NEW.raw_user_meta_data->>'restaurant_name', 'My Restaurant'),
    now() + interval '14 days',
    'trial',
    NULL
  )
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

-- ============================================================
-- RLS: drop & recreate affected policies
-- ============================================================
DROP POLICY IF EXISTS "public_read_published_restaurants" ON restaurants;
CREATE POLICY "public_read_published_restaurants"
  ON restaurants FOR SELECT TO anon
  USING (
    is_published = true
    AND (
      (access_status = 'trial' AND trial_ends_at > now())
      OR (
        access_status = 'active'
        AND subscription_ends_at IS NOT NULL
        AND subscription_ends_at > now()
      )
    )
  );

DROP POLICY IF EXISTS "owner_update_own_restaurant" ON restaurants;
CREATE POLICY "owner_update_own_restaurant"
  ON restaurants FOR UPDATE TO authenticated
  USING (
    id = get_my_restaurant_id()
    AND get_my_role() = 'owner'
    AND restaurant_has_full_access(id)
  )
  WITH CHECK (
    id = get_my_restaurant_id()
    AND restaurant_has_full_access(id)
  );

CREATE POLICY "platform_admin_select_all_restaurants"
  ON restaurants FOR SELECT TO authenticated
  USING (is_platform_admin(auth.uid()));

CREATE POLICY "platform_admin_update_restaurants"
  ON restaurants FOR UPDATE TO authenticated
  USING (is_platform_admin(auth.uid()))
  WITH CHECK (is_platform_admin(auth.uid()));

-- -------- Menu categories --------
DROP POLICY IF EXISTS "public_read_active_categories" ON menu_categories;
CREATE POLICY "public_read_active_categories"
  ON menu_categories FOR SELECT TO anon
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = menu_categories.restaurant_id
        AND restaurant_entitlement_public(r)
    )
  );

DROP POLICY IF EXISTS "auth_insert_own_categories" ON menu_categories;
CREATE POLICY "auth_insert_own_categories"
  ON menu_categories FOR INSERT TO authenticated
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "auth_update_own_categories" ON menu_categories;
CREATE POLICY "auth_update_own_categories"
  ON menu_categories FOR UPDATE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  )
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "auth_delete_own_categories" ON menu_categories;
CREATE POLICY "auth_delete_own_categories"
  ON menu_categories FOR DELETE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND get_my_role() = 'owner'
    AND restaurant_has_full_access(restaurant_id)
  );

-- -------- Menu items --------
DROP POLICY IF EXISTS "public_read_available_items" ON menu_items;
CREATE POLICY "public_read_available_items"
  ON menu_items FOR SELECT TO anon
  USING (
    is_available = true
    AND EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = menu_items.restaurant_id
        AND restaurant_entitlement_public(r)
    )
  );

DROP POLICY IF EXISTS "auth_insert_own_items" ON menu_items;
CREATE POLICY "auth_insert_own_items"
  ON menu_items FOR INSERT TO authenticated
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "auth_update_own_items" ON menu_items;
CREATE POLICY "auth_update_own_items"
  ON menu_items FOR UPDATE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  )
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "auth_delete_own_items" ON menu_items;
CREATE POLICY "auth_delete_own_items"
  ON menu_items FOR DELETE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND get_my_role() = 'owner'
    AND restaurant_has_full_access(restaurant_id)
  );

-- -------- Opening hours --------
DROP POLICY IF EXISTS "public_read_opening_hours" ON opening_hours;
CREATE POLICY "public_read_opening_hours"
  ON opening_hours FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = opening_hours.restaurant_id
        AND restaurant_entitlement_public(r)
    )
  );

DROP POLICY IF EXISTS "auth_insert_own_hours" ON opening_hours;
CREATE POLICY "auth_insert_own_hours"
  ON opening_hours FOR INSERT TO authenticated
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "auth_update_own_hours" ON opening_hours;
CREATE POLICY "auth_update_own_hours"
  ON opening_hours FOR UPDATE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  )
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "owner_delete_own_hours" ON opening_hours;
CREATE POLICY "owner_delete_own_hours"
  ON opening_hours FOR DELETE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND get_my_role() = 'owner'
    AND restaurant_has_full_access(restaurant_id)
  );

-- -------- Reservations --------
DROP POLICY IF EXISTS "public_insert_reservation" ON reservations;
CREATE POLICY "public_insert_reservation"
  ON reservations FOR INSERT TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = reservations.restaurant_id
        AND restaurant_entitlement_public(r)
    )
  );

DROP POLICY IF EXISTS "auth_insert_own_reservations" ON reservations;
CREATE POLICY "auth_insert_own_reservations"
  ON reservations FOR INSERT TO authenticated
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "auth_update_own_reservations" ON reservations;
CREATE POLICY "auth_update_own_reservations"
  ON reservations FOR UPDATE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  )
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "owner_delete_reservations" ON reservations;
CREATE POLICY "owner_delete_reservations"
  ON reservations FOR DELETE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND get_my_role() = 'owner'
    AND restaurant_has_full_access(restaurant_id)
  );

-- -------- Revenue --------
DROP POLICY IF EXISTS "owner_insert_revenue" ON revenue_entries;
CREATE POLICY "owner_insert_revenue"
  ON revenue_entries FOR INSERT TO authenticated
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND get_my_role() = 'owner'
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "owner_update_revenue" ON revenue_entries;
CREATE POLICY "owner_update_revenue"
  ON revenue_entries FOR UPDATE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND get_my_role() = 'owner'
    AND restaurant_has_full_access(restaurant_id)
  )
  WITH CHECK (
    restaurant_id = get_my_restaurant_id()
    AND restaurant_has_full_access(restaurant_id)
  );

DROP POLICY IF EXISTS "owner_delete_revenue" ON revenue_entries;
CREATE POLICY "owner_delete_revenue"
  ON revenue_entries FOR DELETE TO authenticated
  USING (
    restaurant_id = get_my_restaurant_id()
    AND get_my_role() = 'owner'
    AND restaurant_has_full_access(restaurant_id)
  );

-- -------- Storage uploads (require full access) --------
DROP POLICY IF EXISTS "auth_upload_logo" ON storage.objects;
CREATE POLICY "auth_upload_logo"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'restaurant-logos'
    AND (storage.foldername(name))[1] = get_my_restaurant_id()::text
    AND restaurant_has_full_access(get_my_restaurant_id())
  );

DROP POLICY IF EXISTS "auth_upload_menu_image" ON storage.objects;
CREATE POLICY "auth_upload_menu_image"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'menu-images'
    AND (storage.foldername(name))[1] = get_my_restaurant_id()::text
    AND restaurant_has_full_access(get_my_restaurant_id())
  );

DROP POLICY IF EXISTS "auth_delete_own_objects" ON storage.objects;
CREATE POLICY "auth_delete_own_objects"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    (bucket_id = 'restaurant-logos' OR bucket_id = 'menu-images')
    AND (storage.foldername(name))[1] = get_my_restaurant_id()::text
    AND restaurant_has_full_access(get_my_restaurant_id())
  );
