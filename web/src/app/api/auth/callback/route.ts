import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error && data.user) {
        // Ensure profile exists for OAuth sign-ins
        const { data: existing } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', data.user.id)
          .single()

        if (!existing) {
          const nextPath = next === '/seller-onboarding' ? '/seller-onboarding' : '/dashboard'
          await supabase.from('profiles').insert({
            id: data.user.id,
            role: next === '/seller-onboarding' ? 'seller' : 'buyer',
            display_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email,
            avatar_url: data.user.user_metadata?.avatar_url,
          } as any)
        }

        return response
      }
      if (error) console.error('OAuth callback error:', error.message)
    } catch (err) {
      console.error('OAuth callback exception:', err)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
