import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json([])

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  const { data, error } = await (supabase.from('reviews') as any)
    .select('*, products(name_en, slug), seller_profiles(company_name_en)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updates } = body

  const { data, error } = await (supabase.from('reviews') as any)
    .update(updates)
    .eq('id', id)
    .select('*, products(name_en, slug), seller_profiles(company_name_en)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
