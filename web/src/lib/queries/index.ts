import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockSellers, mockProducts, mockVideos, mockCategories, mockReviews, mockDeals } from '@/lib/data/mock-data'
import { getProductImage, getBrandImage } from '@/lib/image-map'
import { VIDEO_OVERRIDES } from '@/lib/video-map'

// Dynamically import Supabase server client only when configured
async function getSupabase() {
  if (!isSupabaseConfigured()) return null
  const { createClient } = await import('@/lib/supabase/server')
  return await createClient()
}

// ── Sellers ───────────────────────────────────────────────

export async function getSellers(options?: { category?: string; market?: string; limit?: number }) {
  const supabase = await getSupabase()
  if (supabase) {
    let query = supabase.from('seller_profiles').select('*').eq('status', 'approved')
    if (options?.category) query = query.eq('category_id', options.category)
    if (options?.limit) query = query.limit(options.limit)
    const { data, error } = await query
    if (error) console.error('getSellers error:', error)
    return (data ?? []).map((s: any) => ({
      ...s,
      logo_url: s.logo_url || getBrandImage(s.slug),
      cover_image_url: s.cover_image_url || getBrandImage(s.slug),
    }))
  }
  let sellers = mockSellers
  if (options?.limit) sellers = sellers.slice(0, options.limit)
  return sellers
}

export async function getSellerBySlug(slug: string) {
  const supabase = await getSupabase()
  if (supabase) {
    const { data } = await supabase.from('seller_profiles').select('*').eq('slug', slug).single()
    if (!data) return null
    const d = data as any
    return { ...d, logo_url: d.logo_url || getBrandImage(slug), cover_image_url: d.cover_image_url || getBrandImage(slug) }
  }
  return mockSellers.find((s) => s.slug === slug) ?? null
}

// ── Products ──────────────────────────────────────────────

export async function getProducts(options?: { category?: string; sellerId?: string; limit?: number }) {
  const supabase = await getSupabase()
  if (supabase) {
    let query = supabase.from('products').select('*').eq('status', 'active')
    if (options?.category) query = query.eq('category_id', options.category)
    if (options?.sellerId) query = query.eq('seller_id', options.sellerId)
    if (options?.limit) query = query.limit(options.limit)
    const { data, error } = await query
    if (error) console.error('getProducts error:', error)
    return (data ?? []).map((p: any) => ({ ...p, image_url: p.image_url || getProductImage(p.slug) }))
  }
  let products = mockProducts
  if (options?.sellerId) products = products.filter((p) => p.seller_id === options.sellerId)
  if (options?.limit) products = products.slice(0, options.limit)
  return products
}

export async function getProductBySlug(slug: string) {
  const supabase = await getSupabase()
  if (supabase) {
    const { data } = await supabase.from('products').select('*').eq('slug', slug).single()
    if (!data) return null
    const d = data as any
    return { ...d, image_url: d.image_url || getProductImage(slug) }
  }
  return mockProducts.find((p) => p.slug === slug) ?? null
}

// ── Videos ────────────────────────────────────────────────

export async function getVideos(options?: { category?: string; featured?: boolean; limit?: number }) {
  const supabase = await getSupabase()
  if (supabase) {
    let query = supabase.from('videos').select('*')
    if (options?.featured) query = query.eq('is_featured', true)
    if (options?.limit) query = query.limit(options.limit)
    const { data, error } = await query
    if (error) console.error('getVideos error:', error)
    return (data ?? []).map((v: any) => {
      const override = VIDEO_OVERRIDES[v.id]
      return override ? { ...v, ...override } : v
    })
  }
  let videos = mockVideos
  if (options?.category) videos = videos.filter((v) => v.category === options.category)
  if (options?.featured) videos = videos.filter((v) => v.is_featured)
  if (options?.limit) videos = videos.slice(0, options.limit)
  return videos
}

// ── Categories ────────────────────────────────────────────

export async function getCategories() {
  const supabase = await getSupabase()
  if (supabase) {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    return data ?? []
  }
  return mockCategories
}

// ── Reviews ───────────────────────────────────────────────

export async function getReviews(options: { productId?: string; sellerId?: string }) {
  const supabase = await getSupabase()
  if (supabase) {
    let query = supabase.from('reviews').select('*').eq('status', 'active')
    if (options.productId) query = query.eq('product_id', options.productId)
    if (options.sellerId) query = query.eq('seller_id', options.sellerId)
    const { data } = await query
    return data ?? []
  }
  let reviews = mockReviews
  if (options.productId) reviews = reviews.filter((r) => r.product_id === options.productId)
  return reviews
}

// ── Deals ─────────────────────────────────────────────────

export async function getActiveDeals() {
  const supabase = await getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .gte('ends_at', new Date().toISOString())
    if (error) console.error('getActiveDeals error:', error)
    return data ?? []
  }
  return mockDeals
}

// ── Featured (for Homepage) ───────────────────────────────

export async function getFeaturedProducts(limit = 4) {
  return getProducts({ limit })
}

export async function getFeaturedSellers(limit = 6) {
  return getSellers({ limit })
}

export async function getFeaturedVideos(limit = 4) {
  return getVideos({ featured: true, limit })
}
