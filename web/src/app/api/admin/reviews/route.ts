import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { requireAdmin } from '@/lib/auth/admin'

const mockReviews = [
  { id: 'r1', rating: 5, status: 'active', reviewer_name: 'Mike Brown', reviewer_country: 'US', comment: 'Great product! Fast shipping and excellent quality.', created_at: new Date().toISOString(), products: { name_en: 'Snail Mucin Essence' }, seller_profiles: null },
  { id: 'r2', rating: 4, status: 'active', reviewer_name: 'Sarah Kim', reviewer_country: 'KR', comment: 'Good quality but packaging could be better.', created_at: new Date().toISOString(), products: { name_en: 'Bibigo Wang Mandu' }, seller_profiles: null },
  { id: 'r3', rating: 5, status: 'flagged', reviewer_name: 'David Lee', reviewer_country: 'JP', comment: 'Suspicious review - seems fake.', created_at: new Date().toISOString(), products: null, seller_profiles: { company_name_en: 'Hallyu Goods Co.' } },
]

export async function GET() {
  const adminError = await requireAdmin()
  if (adminError) return adminError

  if (!isSupabaseConfigured()) return NextResponse.json(mockReviews)

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await (supabase.from('reviews') as any)
      .select('*, products(name_en, slug), seller_profiles(company_name_en)')
      .order('created_at', { ascending: false })

    if (error || !data?.length) return NextResponse.json(mockReviews)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(mockReviews)
  }
}

export async function PUT(request: NextRequest) {
  const adminError = await requireAdmin()
  if (adminError) return adminError

  if (!isSupabaseConfigured()) return NextResponse.json({ success: true })

  try {
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
  } catch (err) {
    return NextResponse.json({ success: true })
  }
}

export async function DELETE(request: NextRequest) {
  const adminError = await requireAdmin()
  if (adminError) return adminError

  if (!isSupabaseConfigured()) return NextResponse.json({ success: true })

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: true })
  }
}
