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
    let query = supabase.from('products').select('*, seller_profiles(company_name_en, slug)')
      .eq('status', 'active')
    if (options?.category) query = query.eq('category_id', options.category)
    if (options?.sellerId) query = query.eq('seller_id', options.sellerId)
    if (options?.limit) query = query.limit(options.limit)
    const { data, error } = await query
    if (error) console.error('getProducts error:', error)
    return (data ?? []).map((p: any) => {
      const seller = p.seller_profiles as any
      return {
        ...p,
        brand: seller?.company_name_en || p.name_en?.split(' ')[0] || 'Korean Brand',
        brandSlug: seller?.slug || '',
        hasVideo: false,
        certs: [] as string[],
        image_url: p.image_url || getProductImage(p.slug),
      }
    })
  }
  let products = mockProducts
  if (options?.sellerId) products = products.filter((p) => p.seller_id === options.sellerId)
  if (options?.limit) products = products.slice(0, options.limit)
  return products
}

export async function getProductBySlug(slug: string) {
  const supabase = await getSupabase()
  if (supabase) {
    const { data } = await supabase.from('products').select('*, seller_profiles(company_name_en, slug)').eq('slug', slug).single()
    if (!data) return null
    const d = data as any
    const seller = d.seller_profiles as any
    return {
      ...d,
      brand: seller?.company_name_en || d.name_en?.split(' ')[0] || 'Korean Brand',
      brandSlug: seller?.slug || '',
      hasVideo: false,
      certs: [] as string[],
      image_url: d.image_url || getProductImage(slug),
    }
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
      .select('*, products(slug, name_en, price_min), seller_profiles(company_name_en)')
      .eq('is_active', true)
    if (error) console.error('getActiveDeals error:', error)
    return (data ?? []).map((d: any) => {
      const product = d.products as any
      const seller = d.seller_profiles as any
      return {
        ...d,
        slug: product?.slug || '',
        name_en: product?.name_en || d.title || '',
        brand: seller?.company_name_en || d.brand || '',
        original_price: d.original_price ?? product?.price_min ?? 0,
        deal_price: d.deal_price ?? d.original_price ?? product?.price_min ?? 0,
        discount_percent: d.discount_percent ?? 0,
      }
    })
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
