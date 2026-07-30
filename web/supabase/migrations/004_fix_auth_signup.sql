-- Fix Supabase auth signup: allow trigger to create profile and avoid conflicts

-- 1. Allow the authenticated service/trigger to insert into profiles.
-- The trigger function runs as SECURITY DEFINER, but some Supabase plans execute
-- auth triggers in a context that still checks RLS for INSERT. This policy lets
-- the trigger create the profile row while keeping user-owned read/update rules.
CREATE POLICY "profiles_trigger_insert" ON profiles
  FOR INSERT
  WITH CHECK (true);

-- 2. Harden the new-user trigger so a pre-existing profile row (e.g. from a
-- previous failed transaction or manual seed) does not abort the auth.users INSERT.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
