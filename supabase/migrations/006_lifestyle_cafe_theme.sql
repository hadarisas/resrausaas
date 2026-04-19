-- Legacy upgrade: add `lifestyle-cafe` if the DB was created from an older 001_schema.sql
-- that omitted it. Fresh installs define this value in 001_schema.sql; this migration no-ops then.
-- Run this (once) if you see: invalid input value for enum restaurant_theme: "lifestyle-cafe"
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public'
      AND t.typname = 'restaurant_theme'
      AND e.enumlabel = 'lifestyle-cafe'
  ) THEN
    ALTER TYPE public.restaurant_theme ADD VALUE 'lifestyle-cafe';
  END IF;
END
$$;
