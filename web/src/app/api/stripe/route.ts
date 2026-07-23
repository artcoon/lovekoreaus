import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

// Stripe checkout session creation
// Requires STRIPE_SECRET_KEY and STRIPE_PRICE_PRO / STRIPE_PRICE_PREMIUM env vars
export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' }, { status: 503 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { plan } = body // 'pro' | 'premium'

  const priceIds: Record<string, string> = {
    pro: process.env.STRIPE_PRICE_PRO || '',
    premium: process.env.STRIPE_PRICE_PREMIUM || '',
  }

  const priceId = priceIds[plan]
  if (!priceId) {
    return NextResponse.json({ error: `No price configured for plan: ${plan}. Set STRIPE_PRICE_${plan.toUpperCase()}.` }, { status: 400 })
  }

  // Get seller profile
  const { data: seller } = await (supabase.from('seller_profiles') as any)
    .select('id')
    .eq('user_id', user.id)
    .single()

  try {
    const stripe = await import('stripe').then(m => new m.default(stripeKey))

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: user.email!,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lovekorea.us'}/dashboard?upgraded=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://lovekorea.us'}/pricing`,
      metadata: {
        userId: user.id,
        sellerId: seller?.id || '',
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
