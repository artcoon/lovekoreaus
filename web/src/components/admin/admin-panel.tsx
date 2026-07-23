'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users, Package, ShieldCheck, BarChart3, Plus,
  CheckCircle, XCircle, Clock, Pencil, Trash2, Save, X,
  Loader2, Search, RefreshCw, MessageSquare, Star, Mail,
  Globe, Eye, AlertTriangle, Flag, ChevronRight, ImageIcon,
  ExternalLink, Building2, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type Tab = 'overview' | 'sellers' | 'products' | 'orders' | 'reviews'

// ─── Types ────────────────────────────────────────────
interface Product {
  id: string; name: string; name_en: string; slug: string; status: string
  price_min: number; price_max: number; moq: number; rating_avg: number
  review_count: number; image_url: string | null
  seller_profiles?: { company_name_en: string }
}

interface Seller {
  id: string; company_name: string; company_name_en: string; slug: string
  seller_type: string; status: string; is_verified: boolean; rating_avg: number
  review_count: number; contact_email: string; subscription_tier: string
  created_at: string; description_en?: string; target_markets?: string[]
}

interface Lead {
  id: string; type: string; status: string; buyer_name: string; buyer_email: string
  buyer_company: string | null; buyer_country: string | null; message: string
  quantity: number | null; created_at: string; replied_at: string | null
  products?: { name_en: string; slug: string } | null
  seller_profiles?: { company_name_en: string } | null
}

interface Review {
  id: string; rating: number; comment: string; reviewer_name: string
  reviewer_country: string | null; status: string; created_at: string
  products?: { name_en: string; slug: string } | null
  seller_profiles?: { company_name_en: string } | null
}

interface PlatformStats {
  sellers: { total: number; pending: number; approved: number; rejected: number }
  products: { total: number; active: number; draft: number; inactive: number }
  leads: { total: number; new: number; read: number; replied: number; closed: number }
  reviews: { total: number; active: number; flagged: number }
  recentSellers: Seller[]
  recentLeads: Lead[]
  recentReviews: Review[]
}

// ─── Helpers ──────────────────────────────────────────
const statusColor = (status: string) => {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700', approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700', draft: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700', inactive: 'bg-red-100 text-red-700',
    suspended: 'bg-red-100 text-red-700', flagged: 'bg-orange-100 text-orange-700',
    removed: 'bg-red-100 text-red-700', new: 'bg-blue-100 text-blue-700',
    read: 'bg-yellow-100 text-yellow-700', replied: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600',
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

const inputClass = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/30 bg-white'

// ─── Seller Detail Modal ──────────────────────────────
function SellerDetailModal({ seller, onClose, onAction }: {
  seller: Seller; onClose: () => void
  onAction: (id: string, updates: Record<string, any>) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Seller Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-navy/10 flex items-center justify-center text-xl font-bold text-navy">
              {(seller.company_name_en || seller.company_name)?.[0] || 'S'}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-navy">{seller.company_name_en || seller.company_name}</h3>
              {seller.company_name && seller.company_name !== seller.company_name_en && (
                <p className="text-sm text-gray-500">{seller.company_name}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-[10px] ${statusColor(seller.status)}`}>{seller.status}</Badge>
                {seller.is_verified && <Badge className="text-[10px] bg-blue-100 text-blue-700">Verified</Badge>}
                <Badge variant="secondary" className="text-[10px] capitalize">{seller.subscription_tier}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Seller Type</label>
              <p className="text-sm capitalize">{seller.seller_type}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Contact Email</label>
              <p className="text-sm">{seller.contact_email || '—'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Rating</label>
              <p className="text-sm">★ {seller.rating_avg || '—'} ({seller.review_count || 0} reviews)</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Registered</label>
              <p className="text-sm">{new Date(seller.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {seller.description_en && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <p className="text-sm text-gray-600">{seller.description_en}</p>
            </div>
          )}

          {seller.target_markets && seller.target_markets.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Target Markets</label>
              <div className="flex flex-wrap gap-1.5">
                {seller.target_markets.map(m => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-navy mb-3">Actions</h4>
            <div className="flex flex-wrap gap-2">
              {seller.status === 'pending' && (
                <>
                  <Button size="sm" onClick={() => { onAction(seller.id, { status: 'approved', is_verified: true }); onClose() }} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                    <CheckCircle className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" onClick={() => { onAction(seller.id, { status: 'rejected' }); onClose() }} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </>
              )}
              {seller.status === 'approved' && (
                <Button size="sm" variant="outline" onClick={() => { onAction(seller.id, { status: 'suspended' }); onClose() }} className="rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                  <AlertTriangle className="h-4 w-4 mr-1" /> Suspend
                </Button>
              )}
              {(seller.status === 'rejected' || seller.status === 'suspended') && (
                <Button size="sm" onClick={() => { onAction(seller.id, { status: 'approved', is_verified: true }); onClose() }} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                  <CheckCircle className="h-4 w-4 mr-1" /> Re-Approve
                </Button>
              )}
              {!seller.is_verified && seller.status === 'approved' && (
                <Button size="sm" variant="outline" onClick={() => { onAction(seller.id, { is_verified: true }); onClose() }} className="rounded-xl">
                  <ShieldCheck className="h-4 w-4 mr-1" /> Verify
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => { onAction(seller.id, { subscription_tier: seller.subscription_tier === 'free' ? 'pro' : seller.subscription_tier === 'pro' ? 'premium' : 'free' }); onClose() }} className="rounded-xl">
                Cycle Plan ({seller.subscription_tier})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Lead Detail Modal ────────────────────────────────
function LeadDetailModal({ lead, onClose, onUpdate, onDelete }: {
  lead: Lead; onClose: () => void
  onUpdate: (id: string, updates: Record<string, any>) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy capitalize">{lead.type} Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">{lead.buyer_name[0]}</div>
            <div className="flex-1">
              <p className="font-medium text-navy">{lead.buyer_name}</p>
              <p className="text-sm text-gray-500">{lead.buyer_company || 'Individual'}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.buyer_email}</span>
                {lead.buyer_country && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{lead.buyer_country}</span>}
              </div>
            </div>
            <Badge className={`${statusColor(lead.status)} text-[10px]`}>{lead.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-xs text-gray-500">Product</span><p className="font-medium">{lead.products?.name_en || 'General'}</p></div>
            <div><span className="text-xs text-gray-500">Seller</span><p className="font-medium">{lead.seller_profiles?.company_name_en || '—'}</p></div>
            {lead.quantity && <div><span className="text-xs text-gray-500">Quantity</span><p className="font-medium">{lead.quantity} units</p></div>}
            <div><span className="text-xs text-gray-500">Date</span><p className="font-medium">{new Date(lead.created_at).toLocaleDateString()}</p></div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Message</label>
            <div className="p-4 bg-gray-50 rounded-xl text-sm whitespace-pre-wrap">{lead.message}</div>
          </div>

          <div className="flex gap-2 pt-2">
            {lead.status !== 'closed' && (
              <Button size="sm" onClick={() => { onUpdate(lead.id, { status: 'closed' }); onClose() }} variant="outline" className="rounded-xl">Close</Button>
            )}
            <Button size="sm" onClick={() => { onDelete(lead.id); onClose() }} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Panel ─────────────────────────────────
export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [sellers, setSellers] = useState<Seller[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Edit state
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Record<string, any>>({})
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', name_en: '', slug: '', price_min: 0, price_max: 0, moq: 1, status: 'active', description_en: '' })

  // Detail modals
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // ─── Fetch functions ────────────────────────────────
  const fetchStats = useCallback(async () => {
    try { const res = await fetch('/api/admin/stats'); if (res.ok) setStats(await res.json()) } catch {}
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try { const res = await fetch('/api/admin/products'); if (res.ok) setProducts(await res.json()) } catch {}
    setLoading(false)
  }, [])

  const fetchSellers = useCallback(async () => {
    setLoading(true)
    try { const res = await fetch('/api/admin/sellers'); if (res.ok) setSellers(await res.json()) } catch {}
    setLoading(false)
  }, [])

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try { const res = await fetch('/api/admin/leads'); if (res.ok) setLeads(await res.json()) } catch {}
    setLoading(false)
  }, [])

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try { const res = await fetch('/api/admin/reviews'); if (res.ok) setReviews(await res.json()) } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
    if (activeTab === 'products' || activeTab === 'overview') fetchProducts()
    if (activeTab === 'sellers' || activeTab === 'overview') fetchSellers()
    if (activeTab === 'orders') fetchLeads()
    if (activeTab === 'reviews') fetchReviews()
  }, [activeTab, fetchStats, fetchProducts, fetchSellers, fetchLeads, fetchReviews])

  // ─── Action handlers ────────────────────────────────
  const handleUpdateSeller = async (id: string, updates: Record<string, any>) => {
    setActionLoading(id)
    await fetch('/api/admin/sellers', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) })
    await fetchSellers(); fetchStats()
    setActionLoading(null)
  }

  const handleDeleteSeller = async (id: string) => {
    if (!confirm('Delete this seller and all their data?')) return
    setActionLoading(id)
    await fetch(`/api/admin/sellers?id=${id}`, { method: 'DELETE' })
    await fetchSellers(); fetchStats()
    setActionLoading(null)
  }

  const handleUpdateProduct = async (id: string) => {
    setActionLoading(id)
    await fetch('/api/admin/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...editForm }) })
    setEditingProduct(null); setEditForm({})
    await fetchProducts(); fetchStats()
    setActionLoading(null)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    setActionLoading(id)
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
    await fetchProducts(); fetchStats()
    setActionLoading(null)
  }

  const handleAddProduct = async () => {
    setActionLoading('new')
    await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProduct) })
    setShowAddProduct(false); setNewProduct({ name: '', name_en: '', slug: '', price_min: 0, price_max: 0, moq: 1, status: 'active', description_en: '' })
    await fetchProducts(); fetchStats()
    setActionLoading(null)
  }

  const handleUpdateLead = async (id: string, updates: Record<string, any>) => {
    await fetch('/api/admin/leads', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) })
    await fetchLeads(); fetchStats()
  }

  const handleDeleteLead = async (id: string) => {
    await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' })
    await fetchLeads(); fetchStats()
  }

  const handleUpdateReview = async (id: string, updates: Record<string, any>) => {
    setActionLoading(id)
    await fetch('/api/admin/reviews', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) })
    await fetchReviews(); fetchStats()
    setActionLoading(null)
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return
    setActionLoading(id)
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
    await fetchReviews(); fetchStats()
    setActionLoading(null)
  }

  // ─── Filtered data ──────────────────────────────────
  const filteredProducts = products.filter(p =>
    (!searchQuery || (p.name_en || p.name).toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || p.status === statusFilter)
  )
  const filteredSellers = sellers.filter(s =>
    (!searchQuery || (s.company_name_en || s.company_name).toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || s.status === statusFilter)
  )
  const filteredLeads = leads.filter(l =>
    (!searchQuery || l.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) || l.buyer_email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || l.status === statusFilter)
  )
  const filteredReviews = reviews.filter(r =>
    (!searchQuery || r.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase()) || r.comment.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (statusFilter === 'all' || r.status === statusFilter)
  )

  const pendingCount = sellers.filter(s => s.status === 'pending').length
  const newLeadsCount = leads.filter(l => l.status === 'new').length
  const flaggedCount = reviews.filter(r => r.status === 'flagged').length

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sellers', label: 'Sellers', icon: Users, badge: pendingCount || undefined },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: MessageSquare, badge: newLeadsCount || undefined },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: flaggedCount || undefined },
  ]

  // ─── Render ─────────────────────────────────────────
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage sellers, products, and content</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => { fetchStats(); fetchProducts(); fetchSellers(); fetchLeads(); fetchReviews() }} className="gap-1.5 rounded-xl">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setSearchQuery(''); setStatusFilter('all') }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}>
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.badge && <span className="ml-1 text-[10px] bg-accent-red text-white px-1.5 py-0.5 rounded-full">{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {activeTab === 'overview' && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Sellers', value: stats?.sellers.total || 0, sub: `${stats?.sellers.pending || 0} pending`, icon: Users, color: 'bg-blue-500' },
              { label: 'Active Products', value: stats?.products.active || 0, sub: `${stats?.products.total || 0} total`, icon: Package, color: 'bg-green-500' },
              { label: 'Total Leads', value: stats?.leads.total || 0, sub: `${stats?.leads.new || 0} new`, icon: MessageSquare, color: 'bg-purple-500' },
              { label: 'Reviews', value: stats?.reviews.total || 0, sub: `${stats?.reviews.flagged || 0} flagged`, icon: Star, color: 'bg-yellow-500' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}><s.icon className="h-4 w-4 text-white" /></div>
                </div>
                <div className="mt-2 text-2xl font-bold text-navy">{s.value}</div>
                <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Pending Approvals */}
          {pendingCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <h2 className="text-lg font-bold text-navy">Pending Approvals ({pendingCount})</h2>
                </div>
                <button onClick={() => { setActiveTab('sellers'); setStatusFilter('pending') }} className="text-sm text-accent-red hover:underline flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></button>
              </div>
              <div className="space-y-2">
                {sellers.filter(s => s.status === 'pending').slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center font-bold text-yellow-700">{(s.company_name_en || s.company_name)?.[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-navy">{s.company_name_en || s.company_name}</p>
                        <p className="text-xs text-gray-400 capitalize">{s.seller_type} · {s.contact_email}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="sm" onClick={() => handleUpdateSeller(s.id, { status: 'approved', is_verified: true })} className="h-8 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs">
                        {actionLoading === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />} Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateSeller(s.id, { status: 'rejected' })} className="h-8 rounded-lg text-xs text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="h-3 w-3 mr-1" /> Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedSeller(s)} className="h-8 rounded-lg text-xs">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Leads */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-navy">Recent Leads</h2>
                <button onClick={() => setActiveTab('orders')} className="text-sm text-accent-red hover:underline">View All</button>
              </div>
              {(stats?.recentLeads || []).length > 0 ? (
                <div className="space-y-2">
                  {(stats?.recentLeads || []).slice(0, 5).map(l => (
                    <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy">{l.buyer_name} <span className="text-gray-400 font-normal">· {l.buyer_company || 'Individual'}</span></p>
                        <p className="text-xs text-gray-400 truncate">{l.products?.name_en || 'General'} → {l.seller_profiles?.company_name_en || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={`text-[10px] ${statusColor(l.status)}`}>{l.status}</Badge>
                        <span className="text-[10px] text-gray-400">{timeAgo(l.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400 text-center py-6">No leads yet</p>}
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-navy">Recent Reviews</h2>
                <button onClick={() => setActiveTab('reviews')} className="text-sm text-accent-red hover:underline">View All</button>
              </div>
              {(stats?.recentReviews || []).length > 0 ? (
                <div className="space-y-2">
                  {(stats?.recentReviews || []).slice(0, 5).map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy">{r.reviewer_name} <span className="text-yellow-500">{'★'.repeat(r.rating)}</span></p>
                        <p className="text-xs text-gray-400 truncate">{r.comment}</p>
                      </div>
                      <Badge className={`text-[10px] ${statusColor(r.status)}`}>{r.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400 text-center py-6">No reviews yet</p>}
            </div>
          </div>
        </>
      )}

      {/* ═══ SELLERS ═══ */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <h2 className="text-lg font-bold text-navy shrink-0">All Sellers</h2>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search sellers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full rounded-lg bg-gray-50 border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/30" />
              </div>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['all', 'pending', 'approved', 'rejected'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${statusFilter === s ? 'bg-white text-navy shadow-sm' : 'text-gray-500'}`}>{s}</button>
              ))}
            </div>
          </div>

          {loading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div> : (
            <div className="space-y-2">
              {filteredSellers.map(s => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50">
                  <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-lg font-bold text-navy shrink-0">
                    {(s.company_name_en || s.company_name)?.[0] || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-navy">{s.company_name_en || s.company_name}</p>
                      {s.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />}
                    </div>
                    <p className="text-xs text-gray-400 capitalize">{s.seller_type} · {s.contact_email} · {s.subscription_tier}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={`text-[10px] ${statusColor(s.status)}`}>{s.status}</Badge>
                    {s.status === 'pending' && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleUpdateSeller(s.id, { status: 'approved', is_verified: true })} className="h-8 w-8 p-0 rounded-lg text-green-500 hover:text-green-700 hover:bg-green-50">
                          {actionLoading === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleUpdateSeller(s.id, { status: 'rejected' })} className="h-8 w-8 p-0 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50">
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setSelectedSeller(s)} className="h-8 w-8 p-0 rounded-lg"><Eye className="h-3.5 w-3.5 text-gray-400" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteSeller(s.id)} className="h-8 w-8 p-0 rounded-lg hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredSellers.length === 0 && <p className="text-center text-gray-400 py-8">No sellers found</p>}
            </div>
          )}
        </div>
      )}

      {/* ═══ PRODUCTS ═══ */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <h2 className="text-lg font-bold text-navy shrink-0">All Products</h2>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full rounded-lg bg-gray-50 border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/30" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {['all', 'active', 'draft', 'inactive'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${statusFilter === s ? 'bg-white text-navy shadow-sm' : 'text-gray-500'}`}>{s}</button>
                ))}
              </div>
              <Button size="sm" onClick={() => setShowAddProduct(true)} className="bg-accent-red hover:bg-accent-red-dark text-white gap-1.5 rounded-xl">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
          </div>

          {showAddProduct && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <h3 className="text-sm font-semibold text-navy mb-3">New Product</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input className={inputClass} placeholder="Name (Korean)" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input className={inputClass} placeholder="Name (English)" value={newProduct.name_en} onChange={e => setNewProduct({...newProduct, name_en: e.target.value})} />
                <input className={inputClass} placeholder="Slug" value={newProduct.slug} onChange={e => setNewProduct({...newProduct, slug: e.target.value})} />
                <input className={inputClass} placeholder="Min Price" type="number" value={newProduct.price_min || ''} onChange={e => setNewProduct({...newProduct, price_min: +e.target.value})} />
                <input className={inputClass} placeholder="Max Price" type="number" value={newProduct.price_max || ''} onChange={e => setNewProduct({...newProduct, price_max: +e.target.value})} />
                <input className={inputClass} placeholder="MOQ" type="number" value={newProduct.moq || ''} onChange={e => setNewProduct({...newProduct, moq: +e.target.value})} />
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleAddProduct} disabled={actionLoading === 'new'} className="bg-accent-red hover:bg-accent-red-dark text-white gap-1.5 rounded-xl">
                  {actionLoading === 'new' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddProduct(false)} className="rounded-xl">Cancel</Button>
              </div>
            </div>
          )}

          {loading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Seller</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      {editingProduct === p.id ? (
                        <>
                          <td className="py-3 px-2"><input className={inputClass} value={editForm.name_en ?? p.name_en} onChange={e => setEditForm({...editForm, name_en: e.target.value})} /></td>
                          <td className="py-3 px-2 text-xs text-gray-500">{p.seller_profiles?.company_name_en || '—'}</td>
                          <td className="py-3 px-2"><div className="flex gap-1"><input className={`${inputClass} w-20`} type="number" value={editForm.price_min ?? p.price_min} onChange={e => setEditForm({...editForm, price_min: +e.target.value})} /><input className={`${inputClass} w-20`} type="number" value={editForm.price_max ?? p.price_max} onChange={e => setEditForm({...editForm, price_max: +e.target.value})} /></div></td>
                          <td className="py-3 px-2"><select className={inputClass} value={editForm.status ?? p.status} onChange={e => setEditForm({...editForm, status: e.target.value})}><option value="active">Active</option><option value="draft">Draft</option><option value="inactive">Inactive</option></select></td>
                          <td className="py-3 px-2 text-right"><div className="flex gap-1 justify-end">
                            <Button size="sm" onClick={() => handleUpdateProduct(p.id)} disabled={actionLoading === p.id} className="h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg">{actionLoading === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}</Button>
                            <Button size="sm" variant="outline" onClick={() => { setEditingProduct(null); setEditForm({}) }} className="h-8 rounded-lg"><X className="h-3 w-3" /></Button>
                          </div></td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-2"><p className="font-medium text-navy">{p.name_en || p.name}</p><p className="text-xs text-gray-400">{p.slug}</p></td>
                          <td className="py-3 px-2 text-xs text-gray-500">{p.seller_profiles?.company_name_en || '—'}</td>
                          <td className="py-3 px-2 text-gray-600">${p.price_min}–${p.price_max}</td>
                          <td className="py-3 px-2"><Badge className={`text-[10px] ${statusColor(p.status)}`}>{p.status}</Badge></td>
                          <td className="py-3 px-2 text-right"><div className="flex gap-1 justify-end">
                            <button onClick={() => { setEditingProduct(p.id); setEditForm({}) }} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-navy"><Pencil className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">{actionLoading === p.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}</button>
                          </div></td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <p className="text-center text-gray-400 py-8">No products found</p>}
            </div>
          )}
        </div>
      )}

      {/* ═══ ORDERS / LEADS ═══ */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <h2 className="text-lg font-bold text-navy shrink-0">All Inquiries & Orders</h2>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full rounded-lg bg-gray-50 border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/30" />
              </div>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['all', 'new', 'read', 'replied', 'closed'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${statusFilter === s ? 'bg-white text-navy shadow-sm' : 'text-gray-500'}`}>{s}</button>
              ))}
            </div>
          </div>

          {loading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div> : (
            <div className="space-y-2">
              {filteredLeads.map(l => (
                <button key={l.id} onClick={() => setSelectedLead(l)} className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50 text-left">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${l.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{l.buyer_name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium text-navy ${l.status === 'new' ? 'font-bold' : ''}`}>{l.buyer_name}</span>
                      <Badge className={`${statusColor(l.status)} text-[10px]`}>{l.status}</Badge>
                      <Badge variant="secondary" className="text-[10px] capitalize">{l.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{l.products?.name_en || 'General'} → {l.seller_profiles?.company_name_en || '—'}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{l.message}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{timeAgo(l.created_at)}</p>
                    {l.quantity && <p className="text-[10px] text-gray-400">Qty: {l.quantity}</p>}
                  </div>
                </button>
              ))}
              {filteredLeads.length === 0 && <p className="text-center text-gray-400 py-8">No inquiries found</p>}
            </div>
          )}
        </div>
      )}

      {/* ═══ REVIEWS ═══ */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 flex-1">
              <h2 className="text-lg font-bold text-navy shrink-0">Content Moderation — Reviews</h2>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search reviews..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full rounded-lg bg-gray-50 border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/30" />
              </div>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['all', 'active', 'flagged', 'removed'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${statusFilter === s ? 'bg-white text-navy shadow-sm' : 'text-gray-500'}`}>{s}</button>
              ))}
            </div>
          </div>

          {loading ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div> : (
            <div className="space-y-3">
              {filteredReviews.map(r => (
                <div key={r.id} className={`p-4 rounded-xl border transition-colors ${r.status === 'flagged' ? 'border-orange-200 bg-orange-50/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-bold text-yellow-700 shrink-0">{r.reviewer_name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-navy">{r.reviewer_name}</span>
                        <span className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        <Badge className={`text-[10px] ${statusColor(r.status)}`}>{r.status}</Badge>
                        {r.reviewer_country && <span className="text-xs text-gray-400">{r.reviewer_country}</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{r.products?.name_en || 'General'} · {r.seller_profiles?.company_name_en || '—'} · {timeAgo(r.created_at)}</p>
                      <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {r.status === 'active' && (
                        <Button size="sm" variant="ghost" onClick={() => handleUpdateReview(r.id, { status: 'flagged' })} className="h-8 w-8 p-0 rounded-lg text-orange-500 hover:bg-orange-50" title="Flag">
                          <Flag className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {r.status === 'flagged' && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleUpdateReview(r.id, { status: 'active' })} className="h-8 w-8 p-0 rounded-lg text-green-500 hover:bg-green-50" title="Approve">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleUpdateReview(r.id, { status: 'removed' })} className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50" title="Remove">
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {r.status === 'removed' && (
                        <Button size="sm" variant="ghost" onClick={() => handleUpdateReview(r.id, { status: 'active' })} className="h-8 w-8 p-0 rounded-lg text-green-500 hover:bg-green-50" title="Restore">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteReview(r.id)} className="h-8 w-8 p-0 rounded-lg hover:text-red-500" title="Delete permanently">
                        {actionLoading === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 text-gray-400" />}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredReviews.length === 0 && <p className="text-center text-gray-400 py-8">No reviews found</p>}
            </div>
          )}
        </div>
      )}

      {/* ═══ MODALS ═══ */}
      {selectedSeller && <SellerDetailModal seller={selectedSeller} onClose={() => setSelectedSeller(null)} onAction={handleUpdateSeller} />}
      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={handleUpdateLead} onDelete={handleDeleteLead} />}
    </div>
  )
}
