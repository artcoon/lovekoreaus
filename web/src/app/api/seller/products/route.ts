import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

async function getAuthUser() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

async function getSellerProfile(supabase: any, userId: string) {
  const { data } = await (supabase.from('seller_profiles') as any)
    .select('id')
    .eq('user_id', userId)
    .single()
  return data
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json([])
  }

  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await getSellerProfile(supabase, user.id)
  if (!seller) return NextResponse.json([])

  const { data, error } = await (supabase.from('products') as any)
    .select('*')
    .eq('seller_id', seller.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await getSellerProfile(supabase, user.id)
  if (!seller) return NextResponse.json({ error: 'No seller profile found' }, { status: 403 })

  const body = await request.json()

  const slug = (body.name_en || body.name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36)

  const productData = {
    seller_id: seller.id,
    name: body.name || body.name_en,
    name_en: body.name_en || body.name,
    slug,
    description_en: body.description_en || '',
    category_id: body.category_id || null,
    price_min: body.price_min ? parseFloat(body.price_min) : null,
    price_max: body.price_max ? parseFloat(body.price_max) : null,
    currency: body.currency || 'USD',
    moq: body.moq ? parseInt(body.moq) : null,
    image_url: body.image_url || null,
    status: 'active',
    certifications: body.certifications || [],
  }

  const { data, error } = await (supabase.from('products') as any)
    .insert(productData)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await getSellerProfile(supabase, user.id)
  if (!seller) return NextResponse.json({ error: 'No seller profile found' }, { status: 403 })

  const body = await request.json()
  const { id, ...updates } = body

  // Verify product belongs to this seller
  const { data: existing } = await (supabase.from('products') as any)
    .select('seller_id')
    .eq('id', id)
    .single()

  if (!existing || existing.seller_id !== seller.id) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const { data, error } = await (supabase.from('products') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await getSellerProfile(supabase, user.id)
  if (!seller) return NextResponse.json({ error: 'No seller profile found' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  // Verify ownership
  const { data: existing } = await (supabase.from('products') as any)
    .select('seller_id')
    .eq('id', id)
    .single()

  if (!existing || existing.seller_id !== seller.id) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
