import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(null)
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await (supabase.from('profiles') as any)
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: sellerProfile } = await (supabase.from('seller_profiles') as any)
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get product count
  let productCount = 0
  if (sellerProfile) {
    const { count } = await (supabase.from('products') as any)
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', sellerProfile.id)
    productCount = count || 0
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
    },
    profile,
    sellerProfile,
    stats: {
      productCount,
    },
  })
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // Update seller profile
  const { data, error } = await (supabase.from('seller_profiles') as any)
    .update({
      company_name: body.company_name,
      company_name_en: body.company_name_en,
      description_en: body.description_en,
      contact_email: body.contact_email,
      website: body.website,
      target_markets: body.target_markets,
    })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
