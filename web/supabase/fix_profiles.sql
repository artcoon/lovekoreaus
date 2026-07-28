-- Fix missing profiles for existing auth.users / seller_profiles
-- Run this in Supabase SQL Editor if signup fails with "Database error saving new user"

BEGIN;

-- Insert missing profiles for existing seller users
INSERT INTO profiles (id, role, display_name, preferred_locale, country, phone)
SELECT
  u.id,
  'seller',
  COALESCE(u.raw_user_meta_data->>'full_name', u.email),
  'en',
  'KR',
  ''
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Optional: promote a specific email to admin
-- UPDATE profiles SET role = 'admin' WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com' LIMIT 1
-- );

COMMIT;
