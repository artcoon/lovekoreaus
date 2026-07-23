import { NextRequest, NextResponse } from 'next/server'

// Stripe webhook handler for subscription events
export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  try {
    const stripe = await import('stripe').then(m => new m.default(stripeKey))
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const { userId, sellerId, plan } = session.metadata || {}

      if (sellerId && plan) {
        const { isSupabaseConfigured } = await import('@/lib/supabase/config')
        if (isSupabaseConfigured()) {
          const { createClient } = await import('@/lib/supabase/server')
          const supabase = await createClient()
          await (supabase.from('seller_profiles') as any)
            .update({ subscription_tier: plan })
            .eq('id', sellerId)
        }
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object as any
      // Downgrade to free on cancellation — would need customer→seller mapping
      console.log('[Stripe] Subscription cancelled:', sub.id)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
