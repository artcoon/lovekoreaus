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

// POST /api/seller/products/bulk — Bulk import products from parsed CSV rows
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await getSellerProfile(supabase, user.id)
  if (!seller) return NextResponse.json({ error: 'No seller profile found' }, { status: 403 })

  const { rows } = await request.json() as { rows: Record<string, string>[] }

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
  }

  if (rows.length > 500) {
    return NextResponse.json({ error: 'Maximum 500 products per import' }, { status: 400 })
  }

  const results: { index: number; success: boolean; name?: string; error?: string; id?: string }[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const name_en = (row.name_en || row.name || row.product_name || '').trim()

    if (!name_en) {
      results.push({ index: i, success: false, error: 'Missing product name' })
      continue
    }

    const slug = name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36) + i.toString(36)

    const productData: Record<string, any> = {
      seller_id: seller.id,
      name: row.name || name_en,
      name_en,
      slug,
      description_en: row.description_en || row.description || '',
      category_id: row.category_id || null,
      price_min: row.price_min ? parseFloat(row.price_min) : null,
      price_max: row.price_max ? parseFloat(row.price_max) : null,
      currency: row.currency || 'USD',
      moq: row.moq ? parseInt(row.moq) : null,
      image_url: row.image_url || null,
      status: row.status || 'active',
      certifications: row.certifications ? row.certifications.split('|').map((c: string) => c.trim()).filter(Boolean) : [],
    }

    try {
      const { data, error } = await (supabase.from('products') as any)
        .insert(productData)
        .select('id, name_en')
        .single()

      if (error) {
        results.push({ index: i, success: false, name: name_en, error: error.message })
      } else {
        results.push({ index: i, success: true, name: name_en, id: data.id })
      }
    } catch (err: any) {
      results.push({ index: i, success: false, name: name_en, error: err.message })
    }
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  return NextResponse.json({
    total: rows.length,
    success: successCount,
    failed: failCount,
    results,
  })
}
