-- Fix platform_tenant_owner_directory: inside SECURITY DEFINER, auth.uid() is often NULL,
-- so is_platform_admin(auth.uid()) filtered out every row. Resolve caller from JWT sub when needed.

CREATE OR REPLACE FUNCTION platform_tenant_owner_directory()
RETURNS TABLE (
  restaurant_id uuid,
  full_name text,
  email text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  caller uuid;
BEGIN
  caller := auth.uid();
  IF caller IS NULL THEN
    BEGIN
      caller := nullif(trim(current_setting('request.jwt.claim.sub', true)), '')::uuid;
    EXCEPTION
      WHEN OTHERS THEN
        caller := NULL;
    END;
  END IF;

  IF caller IS NULL OR NOT is_platform_admin(caller) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT DISTINCT ON (r.id)
    r.id AS restaurant_id,
    p.full_name AS full_name,
    u.email::text AS email
  FROM public.restaurants r
  LEFT JOIN public.profiles p ON p.restaurant_id = r.id AND p.role = 'owner'::public.user_role
  LEFT JOIN auth.users u ON u.id = p.id
  ORDER BY r.id;
END;
$$;

-- Invoker-side read: lets the app merge owner full_name even if RPC email fails; RLS sees real auth.uid().
DROP POLICY IF EXISTS "platform_admin_select_all_profiles" ON public.profiles;
CREATE POLICY "platform_admin_select_all_profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (is_platform_admin(auth.uid()));
