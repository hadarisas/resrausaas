-- Brochure vs full service:
-- • Public page (menu, hours, SEO): visible whenever published and not suspended (includes read-only / lapsed plans).
-- • Online reservations: only while trial is active or paid subscription is in range.

CREATE OR REPLACE FUNCTION restaurant_entitlement_public(r restaurants)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT
    r.is_published = true
    AND r.access_status <> 'suspended'::restaurant_access_status;
$$;

CREATE OR REPLACE FUNCTION restaurant_entitlement_reservations(r restaurants)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT
    r.is_published = true
    AND r.access_status <> 'suspended'::restaurant_access_status
    AND (
      (r.access_status = 'trial'::restaurant_access_status AND r.trial_ends_at > now())
      OR (
        r.access_status = 'active'::restaurant_access_status
        AND r.subscription_ends_at IS NOT NULL
        AND r.subscription_ends_at > now()
      )
    );
$$;

-- Expiry moves tenant to read-only but keeps the public brochure live (owner can still unpublish).
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
    access_status = 'readonly'::restaurant_access_status,
    updated_at = now()
  WHERE r.id = p_restaurant_id
    AND (
      (r.access_status = 'trial'::restaurant_access_status AND r.trial_ends_at <= now())
      OR (
        r.access_status = 'active'::restaurant_access_status
        AND r.subscription_ends_at IS NOT NULL
        AND r.subscription_ends_at <= now()
      )
    );
END;
$$;

DROP POLICY IF EXISTS "public_read_published_restaurants" ON restaurants;
CREATE POLICY "public_read_published_restaurants"
  ON restaurants FOR SELECT TO anon
  USING (
    is_published = true
    AND access_status <> 'suspended'::restaurant_access_status
  );

DROP POLICY IF EXISTS "public_insert_reservation" ON reservations;
CREATE POLICY "public_insert_reservation"
  ON reservations FOR INSERT TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants r
      WHERE r.id = reservations.restaurant_id
        AND restaurant_entitlement_reservations(r)
    )
  );
