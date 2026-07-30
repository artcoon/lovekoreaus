'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) return { error: 'Database not configured' }

  try {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = (formData.get('role') as string) || 'buyer'

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lovekorea.us'}/api/auth/callback`,
      },
    })

    if (error) return { error: error.message }
    if (!data.user) return { error: 'Account creation failed. Please try again.' }

    // Create/update profile row explicitly. If the trigger already created it,
    // ON CONFLICT will update it with the correct role/name.
    const displayName = fullName || email.split('@')[0]
    const { error: profileError } = await (supabase.from('profiles') as any)
      .upsert({
        id: data.user.id,
        role,
        display_name: displayName,
        avatar_url: data.user.user_metadata?.avatar_url || null,
        preferred_locale: 'en',
      }, { onConflict: 'id' })

    if (profileError) {
      console.error('profile upsert error:', profileError)
      // Don't fail signup if profile upsert fails; user can retry or it may be fixed later.
    }

    // If email confirmation is required, stay on the login page and show a message instead of redirecting.
    if (!data.session) {
      return { success: true, message: 'Please check your email to confirm your account before signing in.' }
    }

    if (role === 'seller') {
      redirect('/seller-onboarding')
    }

    redirect('/dashboard')
  } catch (err: any) {
    console.error('signUp error:', err)
    return { error: err?.message || 'Account creation failed. Please try again or contact support.' }
  }
}

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) return { error: 'Database not configured' }

  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function resetPassword(formData: FormData) {
  if (!isSupabaseConfigured()) return { error: 'Database not configured' }

  const supabase = await createClient()
  const email = formData.get('email') as string
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovekorea.us'

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/api/auth/callback?next=/dashboard`,
  })

  if (error) return { error: error.message }
  return { success: true }
}

export async function signOut() {
  if (!isSupabaseConfigured()) { redirect('/'); return }
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function signInWithGoogle(role: 'buyer' | 'seller' = 'buyer') {
  if (!isSupabaseConfigured()) return { error: 'Database not configured' }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovekorea.us'
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/api/auth/callback?next=${role === 'seller' ? '/seller-onboarding' : '/dashboard'}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'email profile',
    },
  })

  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
}

export async function signInWithKakao(role: 'buyer' | 'seller' = 'buyer') {
  if (!isSupabaseConfigured()) return { error: 'Database not configured' }

  const supabase = await createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovekorea.us'
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${siteUrl}/api/auth/callback?next=${role === 'seller' ? '/seller-onboarding' : '/dashboard'}`,
    },
  })

  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
}

export async function getSession() {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await (supabase
    .from('profiles') as any)
    .select('*')
    .eq('id', user.id)
    .single()

  return { ...user, profile }
}

export async function submitSellerOnboarding(formData: FormData) {
  if (!isSupabaseConfigured()) return { error: 'Database not configured' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const companyName = formData.get('companyName') as string
  const companyNameEn = formData.get('companyNameEn') as string
  const sellerType = formData.get('sellerType') as string
  const categoryId = formData.get('categoryId') as string
  const description = formData.get('description') as string
  const contactEmail = formData.get('contactEmail') as string
  const website = formData.get('website') as string
  const markets = formData.getAll('markets') as string[]

  const slug = companyNameEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { error } = await supabase.from('seller_profiles').insert({
    user_id: user.id,
    company_name: companyName,
    company_name_en: companyNameEn,
    slug,
    seller_type: sellerType,
    category_id: categoryId || null,
    description_en: description,
    contact_email: contactEmail,
    website: website || null,
    target_markets: markets.length > 0 ? markets : ['US'],
    status: 'pending',
    is_verified: false,
    subscription_tier: 'free',
  } as any)

  if (error) return { error: error.message }

  // Update profile role to seller
  await (supabase.from('profiles') as any).update({ role: 'seller' }).eq('id', user.id)

  redirect('/dashboard')
}
