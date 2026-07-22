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
  if (!isSupabaseConfigured()) return NextResponse.json([])

  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await getSellerProfile(supabase, user.id)
  if (!seller) return NextResponse.json([])

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let query = (supabase.from('leads') as any)
    .select('*, products(name_en, slug, image_url)')
    .eq('seller_id', seller.id)
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await getSellerProfile(supabase, user.id)
  if (!seller) return NextResponse.json({ error: 'No seller profile' }, { status: 403 })

  const body = await request.json()
  const { id, status: newStatus } = body

  // Verify lead belongs to this seller
  const { data: existing } = await (supabase.from('leads') as any)
    .select('seller_id')
    .eq('id', id)
    .single()

  if (!existing || existing.seller_id !== seller.id) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  const updateData: any = { status: newStatus }
  if (newStatus === 'replied') {
    updateData.replied_at = new Date().toISOString()
  }

  const { data, error } = await (supabase.from('leads') as any)
    .update(updateData)
    .eq('id', id)
    .select('*, products(name_en, slug, image_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
