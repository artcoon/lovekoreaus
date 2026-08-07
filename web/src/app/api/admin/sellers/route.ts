import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockSellers } from '@/lib/data/mock-data'
import { requireAdmin } from '@/lib/auth/admin'

export async function GET() {
  const adminError = await requireAdmin()
  if (adminError) return adminError

  if (!isSupabaseConfigured()) {
    return NextResponse.json(mockSellers)
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error || !data?.length) return NextResponse.json(mockSellers)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(mockSellers)
  }
}

export async function PUT(request: NextRequest) {
  const adminError = await requireAdmin()
  if (adminError) return adminError

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true })
  }
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await (supabase.from('seller_profiles') as any).update(updates).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ success: true })
  }
}

export async function DELETE(request: NextRequest) {
  const adminError = await requireAdmin()
  if (adminError) return adminError

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true })
  }
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const { error } = await supabase.from('seller_profiles').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: true })
  }
}
