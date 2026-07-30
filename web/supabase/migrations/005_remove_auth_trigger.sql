-- Remove the auth trigger that aborts signups when profile creation fails.
-- Profiles are now created explicitly from the Next.js signUp Server Action.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
