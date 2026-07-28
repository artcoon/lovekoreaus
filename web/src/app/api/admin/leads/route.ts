import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

const mockLeads = [
  { id: 'l1', type: 'quote', status: 'new', buyer_name: 'John Doe', buyer_email: 'john@example.com', buyer_company: 'Global Beauty Inc', buyer_country: 'US', message: 'Interested in 500 units for US distribution. Please quote.', quantity: 500, created_at: new Date().toISOString(), replied_at: null, products: { name_en: 'Snail Essence' }, seller_profiles: { company_name_en: 'Hana Cosmetics Co.' } },
  { id: 'l2', type: 'inquiry', status: 'replied', buyer_name: 'Jane Smith', buyer_email: 'jane@example.com', buyer_company: null, buyer_country: 'CA', message: 'Do you offer custom packaging?', quantity: null, created_at: new Date().toISOString(), replied_at: new Date().toISOString(), products: null, seller_profiles: { company_name_en: 'Kimchi World Inc.' } },
  { id: 'l3', type: 'partnership', status: 'closed', buyer_name: 'Mike Chen', buyer_email: 'mike@example.com', buyer_company: 'AsiaMart', buyer_country: 'CN', message: 'Looking for exclusive partnership in China.', quantity: null, created_at: new Date().toISOString(), replied_at: new Date().toISOString(), products: { name_en: 'BT21 Plush' }, seller_profiles: { company_name_en: 'Hallyu Goods Co.' } },
]

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json(mockLeads)

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await (supabase.from('leads') as any)
      .select('*, products(name_en, slug), seller_profiles(company_name_en)')
      .order('created_at', { ascending: false })

    if (error || !data?.length) return NextResponse.json(mockLeads)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(mockLeads)
  }
}

export async function PUT(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ success: true })

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    const { data, error } = await (supabase.from('leads') as any)
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
  if (!isSupabaseConfigured()) return NextResponse.json({ success: true })

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: true })
  }
}
