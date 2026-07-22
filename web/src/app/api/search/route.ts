import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockSellers, mockProducts } from '@/lib/data/mock-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  const type = searchParams.get('type') || 'all' // all | products | sellers

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [], sellers: [] })
  }

  const query = q.toLowerCase()

  if (isSupabaseConfigured()) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const results: { products: any[]; sellers: any[] } = { products: [], sellers: [] }

    if (type === 'all' || type === 'products') {
      const { data: products } = await supabase
        .from('products')
        .select('id, name, name_en, slug, price_min, price_max, rating_avg, review_count, category_id')
        .eq('status', 'active')
        .or(`name.ilike.%${q}%,name_en.ilike.%${q}%,description_en.ilike.%${q}%`)
        .limit(10)
      results.products = products ?? []
    }

    if (type === 'all' || type === 'sellers') {
      const { data: sellers } = await supabase
        .from('seller_profiles')
        .select('id, company_name, company_name_en, slug, seller_type, is_verified, rating_avg, review_count')
        .eq('status', 'approved')
        .or(`company_name.ilike.%${q}%,company_name_en.ilike.%${q}%,description_en.ilike.%${q}%`)
        .limit(10)
      results.sellers = sellers ?? []
    }

    return NextResponse.json(results)
  }

  // Mock fallback
  const results: { products: any[]; sellers: any[] } = { products: [], sellers: [] }

  if (type === 'all' || type === 'products') {
    results.products = mockProducts
      .filter((p) => p.name.toLowerCase().includes(query) || p.slug.includes(query))
      .slice(0, 10)
  }

  if (type === 'all' || type === 'sellers') {
    results.sellers = mockSellers
      .filter((s) => (s as any).name?.toLowerCase().includes(query) || s.slug.includes(query))
      .slice(0, 10)
  }

  return NextResponse.json(results)
}
