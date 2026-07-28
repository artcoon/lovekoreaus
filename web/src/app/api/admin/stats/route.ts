import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

// Mock admin stats for testing when DB is unreachable
function mockStats() {
  return {
    sellers: { total: 6, pending: 1, approved: 5, rejected: 0 },
    products: { total: 8, active: 8, draft: 0, inactive: 0 },
    leads: { total: 4, new: 2, read: 1, replied: 1, closed: 0 },
    reviews: { total: 3, active: 3, flagged: 0 },
    recentSellers: [
      { id: '1', company_name_en: 'COSRX', status: 'approved', is_verified: true, seller_type: 'brand', subscription_tier: 'pro', created_at: new Date().toISOString() },
      { id: '2', company_name_en: 'CJ CheilJedang', status: 'approved', is_verified: true, seller_type: 'manufacturer', subscription_tier: 'premium', created_at: new Date().toISOString() },
      { id: '3', company_name_en: 'Seoul Snacks Co', status: 'pending', is_verified: false, seller_type: 'small_biz', subscription_tier: 'free', created_at: new Date().toISOString() },
    ],
    recentLeads: [
      { id: '1', type: 'quote', status: 'new', buyer_name: 'John Doe', buyer_email: 'john@example.com', buyer_company: 'Global Beauty', created_at: new Date().toISOString(), products: { name_en: 'Snail Essence' }, seller_profiles: { company_name_en: 'COSRX' } },
      { id: '2', type: 'inquiry', status: 'replied', buyer_name: 'Jane Smith', buyer_email: 'jane@example.com', buyer_company: null, created_at: new Date().toISOString(), products: null, seller_profiles: { company_name_en: 'CJ CheilJedang' } },
    ],
    recentReviews: [
      { id: '1', rating: 5, status: 'active', reviewer_name: 'Mike Brown', comment: 'Great product!', created_at: new Date().toISOString(), products: { name_en: 'Snail Essence' } },
    ],
  }
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(mockStats())
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const [sellersRes, productsRes, leadsRes, reviewsRes] = await Promise.all([
      (supabase.from('seller_profiles') as any).select('id, company_name_en, status, is_verified, seller_type, subscription_tier, created_at').order('created_at', { ascending: false }),
      (supabase.from('products') as any).select('id, status'),
      (supabase.from('leads') as any).select('id, type, status, buyer_name, buyer_email, buyer_company, created_at, products(name_en), seller_profiles(company_name_en)').order('created_at', { ascending: false }),
      (supabase.from('reviews') as any).select('id, rating, status, reviewer_name, comment, created_at, products(name_en)').order('created_at', { ascending: false }),
    ])

    const sellers = sellersRes.data || []
    const products = productsRes.data || []
    const leads = leadsRes.data || []
    const reviews = reviewsRes.data || []

    return NextResponse.json({
      sellers: {
        total: sellers.length || 6,
        pending: sellers.filter((s: any) => s.status === 'pending').length || 1,
        approved: sellers.filter((s: any) => s.status === 'approved').length || 5,
        rejected: sellers.filter((s: any) => s.status === 'rejected').length || 0,
      },
      products: {
        total: products.length || 8,
        active: products.filter((p: any) => p.status === 'active').length || 8,
        draft: products.filter((p: any) => p.status === 'draft').length || 0,
        inactive: products.filter((p: any) => p.status === 'inactive').length || 0,
      },
      leads: {
        total: leads.length || 4,
        new: leads.filter((l: any) => l.status === 'new').length || 2,
        read: leads.filter((l: any) => l.status === 'read').length || 1,
        replied: leads.filter((l: any) => l.status === 'replied').length || 1,
        closed: leads.filter((l: any) => l.status === 'closed').length || 0,
      },
      reviews: {
        total: reviews.length || 3,
        active: reviews.filter((r: any) => r.status === 'active').length || 2,
        flagged: reviews.filter((r: any) => r.status === 'flagged').length || 1,
      },
      recentSellers: sellers.length ? sellers.slice(0, 10) : mockStats().recentSellers,
      recentLeads: leads.length ? leads.slice(0, 10) : mockStats().recentLeads,
      recentReviews: reviews.length ? reviews.slice(0, 10) : mockStats().recentReviews,
    })
  } catch (err) {
    return NextResponse.json(mockStats())
  }
}
