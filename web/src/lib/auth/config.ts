import { createClient } from '@/lib/supabase/server'

export async function getAuthConfig() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) return { error: error.message }
  return { url: process.env.NEXT_PUBLIC_SUPABASE_URL }
}
