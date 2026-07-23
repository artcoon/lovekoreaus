import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      sellers: { total: 0, pending: 0, approved: 0, rejected: 0 },
      products: { total: 0, active: 0, draft: 0, inactive: 0 },
      leads: { total: 0, new: 0, read: 0, replied: 0, closed: 0 },
      reviews: { total: 0, active: 0, flagged: 0 },
      recentSellers: [],
      recentLeads: [],
    })
  }

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
      total: sellers.length,
      pending: sellers.filter((s: any) => s.status === 'pending').length,
      approved: sellers.filter((s: any) => s.status === 'approved').length,
      rejected: sellers.filter((s: any) => s.status === 'rejected').length,
    },
    products: {
      total: products.length,
      active: products.filter((p: any) => p.status === 'active').length,
      draft: products.filter((p: any) => p.status === 'draft').length,
      inactive: products.filter((p: any) => p.status === 'inactive').length,
    },
    leads: {
      total: leads.length,
      new: leads.filter((l: any) => l.status === 'new').length,
      read: leads.filter((l: any) => l.status === 'read').length,
      replied: leads.filter((l: any) => l.status === 'replied').length,
      closed: leads.filter((l: any) => l.status === 'closed').length,
    },
    reviews: {
      total: reviews.length,
      active: reviews.filter((r: any) => r.status === 'active').length,
      flagged: reviews.filter((r: any) => r.status === 'flagged').length,
    },
    recentSellers: sellers.slice(0, 10),
    recentLeads: leads.slice(0, 10),
    recentReviews: reviews.slice(0, 10),
  })
}
