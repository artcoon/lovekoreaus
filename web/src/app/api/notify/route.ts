import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

// Email notification endpoint — sends notification when a new lead/inquiry comes in
// In production, integrate with Resend, SendGrid, or Supabase Edge Functions
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const body = await request.json()
  const { type, sellerId, leadId, buyerName, productName } = body

  if (!type || !sellerId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Get seller's contact email
  const { data: seller } = await (supabase.from('seller_profiles') as any)
    .select('contact_email, company_name_en')
    .eq('id', sellerId)
    .single()

  if (!seller?.contact_email) {
    return NextResponse.json({ error: 'Seller email not found' }, { status: 404 })
  }

  // Build notification content
  const notifications: Record<string, { subject: string; body: string }> = {
    new_inquiry: {
      subject: `New inquiry from ${buyerName || 'a buyer'} — LoveKorea.Us`,
      body: `Hi ${seller.company_name_en},\n\nYou have a new inquiry${productName ? ` about "${productName}"` : ''} from ${buyerName || 'a buyer'}.\n\nLog in to your dashboard to respond:\nhttps://lovekorea.us/dashboard\n\n— LoveKorea.Us Team`,
    },
    quote_request: {
      subject: `Quote request from ${buyerName || 'a buyer'} — LoveKorea.Us`,
      body: `Hi ${seller.company_name_en},\n\nYou received a quote request${productName ? ` for "${productName}"` : ''} from ${buyerName || 'a buyer'}.\n\nView details and respond on your dashboard:\nhttps://lovekorea.us/dashboard\n\n— LoveKorea.Us Team`,
    },
    seller_approved: {
      subject: `Your seller profile has been approved! — LoveKorea.Us`,
      body: `Congratulations ${seller.company_name_en}!\n\nYour seller profile on LoveKorea.Us has been approved. You can now:\n• Add products to your catalog\n• Receive buyer inquiries\n• Access your analytics dashboard\n\nGet started: https://lovekorea.us/dashboard\n\n— LoveKorea.Us Team`,
    },
  }

  const notification = notifications[type]
  if (!notification) {
    return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 })
  }

  // Check for email service configuration
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    // Send via Resend
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'LoveKorea.Us <noreply@lovekorea.us>',
          to: seller.contact_email,
          subject: notification.subject,
          text: notification.body,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error('Resend error:', err)
        return NextResponse.json({ sent: false, method: 'resend', error: err }, { status: 500 })
      }

      return NextResponse.json({ sent: true, method: 'resend', to: seller.contact_email })
    } catch (err: any) {
      console.error('Email send error:', err)
      return NextResponse.json({ sent: false, error: err.message }, { status: 500 })
    }
  }

  // Fallback: log notification (no email service configured)
  console.log(`[NOTIFICATION] To: ${seller.contact_email}`)
  console.log(`[NOTIFICATION] Subject: ${notification.subject}`)
  console.log(`[NOTIFICATION] Body: ${notification.body}`)

  return NextResponse.json({
    sent: false,
    method: 'log',
    message: 'Email service not configured. Set RESEND_API_KEY to enable.',
    to: seller.contact_email,
    subject: notification.subject,
  })
}
