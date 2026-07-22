import { NextResponse } from 'next/server'
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

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      overview: { totalProducts: 0, activeProducts: 0, totalLeads: 0, newLeads: 0, totalViews: 0, avgRating: 0, reviewCount: 0 },
      leadsByStatus: [],
      leadsByType: [],
      productPerformance: [],
      recentActivity: [],
      monthlyLeads: [],
    })
  }

  const { supabase, user } = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const seller = await getSellerProfile(supabase, user.id)
  if (!seller) {
    return NextResponse.json({
      overview: { totalProducts: 0, activeProducts: 0, totalLeads: 0, newLeads: 0, totalViews: 0, avgRating: 0, reviewCount: 0 },
      leadsByStatus: [],
      leadsByType: [],
      productPerformance: [],
      recentActivity: [],
      monthlyLeads: [],
    })
  }

  // Run queries in parallel
  const [
    productsRes,
    leadsRes,
    reviewsRes,
    sellerRes,
  ] = await Promise.all([
    (supabase.from('products') as any)
      .select('id, name_en, status, image_url, price_min, created_at')
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false }),
    (supabase.from('leads') as any)
      .select('id, type, status, buyer_name, buyer_company, buyer_country, message, quantity, created_at, replied_at, product_id, products(name_en)')
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false }),
    (supabase.from('reviews') as any)
      .select('id, rating, comment, reviewer_name, created_at, product_id, products(name_en)')
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false })
      .limit(10),
    (supabase.from('seller_profiles') as any)
      .select('rating, review_count')
      .eq('id', seller.id)
      .single(),
  ])

  const products = productsRes.data || []
  const leads = leadsRes.data || []
  const reviews = reviewsRes.data || []
  const sellerData = sellerRes.data || {}

  // Compute stats
  const totalProducts = products.length
  const activeProducts = products.filter((p: any) => p.status === 'active').length
  const totalLeads = leads.length
  const newLeads = leads.filter((l: any) => l.status === 'new').length

  // Leads by status
  const statusCounts: Record<string, number> = {}
  leads.forEach((l: any) => { statusCounts[l.status] = (statusCounts[l.status] || 0) + 1 })
  const leadsByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }))

  // Leads by type
  const typeCounts: Record<string, number> = {}
  leads.forEach((l: any) => { typeCounts[l.type] = (typeCounts[l.type] || 0) + 1 })
  const leadsByType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }))

  // Product performance (leads per product)
  const productLeadCounts: Record<string, number> = {}
  leads.forEach((l: any) => {
    if (l.product_id) productLeadCounts[l.product_id] = (productLeadCounts[l.product_id] || 0) + 1
  })
  const productPerformance = products.map((p: any) => ({
    id: p.id,
    name: p.name_en,
    status: p.status,
    image_url: p.image_url,
    leads: productLeadCounts[p.id] || 0,
  })).sort((a: any, b: any) => b.leads - a.leads)

  // Monthly leads (last 6 months)
  const monthlyLeads: { month: string; count: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = d.toLocaleString('en', { month: 'short', year: '2-digit' })
    const count = leads.filter((l: any) => l.created_at?.startsWith(monthKey)).length
    monthlyLeads.push({ month: monthLabel, count })
  }

  // Recent activity — merge leads & reviews, sort by date
  const recentActivity = [
    ...leads.slice(0, 10).map((l: any) => ({
      type: 'lead' as const,
      id: l.id,
      title: `${l.type === 'quote' ? 'Quote request' : l.type === 'partnership' ? 'Partnership inquiry' : 'Inquiry'} from ${l.buyer_name}`,
      subtitle: l.products?.name_en || 'General inquiry',
      status: l.status,
      date: l.created_at,
    })),
    ...reviews.map((r: any) => ({
      type: 'review' as const,
      id: r.id,
      title: `${r.rating}★ review from ${r.reviewer_name}`,
      subtitle: r.products?.name_en || '',
      status: 'active',
      date: r.created_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15)

  // Response time (avg hours from created_at to replied_at)
  const repliedLeads = leads.filter((l: any) => l.replied_at)
  let avgResponseHours = 0
  if (repliedLeads.length > 0) {
    const totalHours = repliedLeads.reduce((sum: number, l: any) => {
      return sum + (new Date(l.replied_at).getTime() - new Date(l.created_at).getTime()) / 3600000
    }, 0)
    avgResponseHours = Math.round(totalHours / repliedLeads.length)
  }

  return NextResponse.json({
    overview: {
      totalProducts,
      activeProducts,
      totalLeads,
      newLeads,
      avgRating: sellerData.rating || 0,
      reviewCount: sellerData.review_count || 0,
      avgResponseHours,
      repliedRate: totalLeads > 0 ? Math.round((repliedLeads.length / totalLeads) * 100) : 0,
    },
    leadsByStatus,
    leadsByType,
    productPerformance,
    recentActivity,
    monthlyLeads,
  })
}
