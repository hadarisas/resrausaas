-- Owner contact (full name + login email) for platform admins only.
-- Email lives on auth.users; full_name on public.profiles.

CREATE OR REPLACE FUNCTION platform_tenant_owner_directory()
RETURNS TABLE (
  restaurant_id uuid,
  full_name text,
  email text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT DISTINCT ON (r.id)
    r.id AS restaurant_id,
    p.full_name AS full_name,
    u.email::text AS email
  FROM restaurants r
  LEFT JOIN profiles p ON p.restaurant_id = r.id AND p.role = 'owner'::user_role
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE is_platform_admin(auth.uid())
  ORDER BY r.id;
$$;

GRANT EXECUTE ON FUNCTION platform_tenant_owner_directory() TO authenticated;
