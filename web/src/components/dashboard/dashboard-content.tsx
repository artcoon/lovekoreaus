'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link } from '@/i18n/navigation'
import {
  Package, MessageSquare, Eye, TrendingUp, Star, Users,
  Plus, Settings, BarChart3, FileText, ChevronRight, Loader2,
  Pencil, Trash2, ExternalLink, AlertCircle, X, ImageIcon,
  Clock, Mail, Globe, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Inbox, Filter, Reply, XCircle, ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// ─── Types ────────────────────────────────────────────
type Product = {
  id: string; name: string; name_en: string; slug: string; description_en: string
  category_id: string | null; price_min: number | null; price_max: number | null
  currency: string; moq: number | null; image_url: string | null; status: string
  certifications: string[]; created_at: string
}

type SellerProfile = {
  id: string; company_name: string; company_name_en: string; slug: string
  description_en: string; contact_email: string; website: string | null
  target_markets: string[]; status: string; subscription_tier: string
  seller_type: string; rating: number | null; review_count: number | null
}

type DashboardData = {
  user: { id: string; email: string; full_name: string | null }
  profile: any; sellerProfile: SellerProfile | null
  stats: { productCount: number }
}

type Lead = {
  id: string; type: string; status: string; buyer_name: string; buyer_email: string
  buyer_company: string | null; buyer_country: string | null; message: string
  quantity: number | null; created_at: string; replied_at: string | null
  product_id: string | null; products: { name_en: string; slug: string; image_url: string | null } | null
}

type AnalyticsData = {
  overview: {
    totalProducts: number; activeProducts: number; totalLeads: number; newLeads: number
    avgRating: number; reviewCount: number; avgResponseHours: number; repliedRate: number
  }
  leadsByStatus: { status: string; count: number }[]
  leadsByType: { type: string; count: number }[]
  productPerformance: { id: string; name: string; status: string; image_url: string | null; leads: number }[]
  recentActivity: { type: string; id: string; title: string; subtitle: string; status: string; date: string }[]
  monthlyLeads: { month: string; count: number }[]
}

const CATEGORIES: Record<string, string> = {
  'c0000001-0000-4000-8000-000000000001': 'Beauty & Skincare',
  'c0000002-0000-4000-8000-000000000002': 'Food & Beverage',
  'c0000003-0000-4000-8000-000000000003': 'Fashion & Apparel',
  'c0000004-0000-4000-8000-000000000004': 'K-Pop & Entertainment',
  'c0000005-0000-4000-8000-000000000005': 'Health & Wellness',
  'c0000006-0000-4000-8000-000000000006': 'Technology',
  'c0000007-0000-4000-8000-000000000007': 'Home & Living',
  'c0000008-0000-4000-8000-000000000008': 'Stationery & Gifts',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-600',
  paused: 'bg-yellow-100 text-yellow-800',
}

// ─── Mini Bar Chart (pure CSS) ────────────────────────
function MiniBarChart({ data, height = 120 }: { data: { label: string; value: number }[]; height?: number }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-2 justify-between" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[10px] font-medium text-gray-600">{d.value}</span>
          <div
            className="w-full bg-accent-red/80 rounded-t-md min-h-[4px] transition-all duration-500"
            style={{ height: `${Math.max((d.value / max) * (height - 30), 4)}px` }}
          />
          <span className="text-[10px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string; sub: string; icon: any; accent?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? 'bg-navy text-white border-navy' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm ${accent ? 'text-white/70' : 'text-gray-500'}`}>{label}</span>
        <Icon className={`h-5 w-5 ${accent ? 'text-white/50' : 'text-gray-400'}`} />
      </div>
      <div className={`mt-2 text-2xl font-bold ${accent ? '' : 'text-navy'}`}>{value}</div>
      <p className={`mt-1 text-xs ${accent ? 'text-white/50' : 'text-gray-400'}`}>{sub}</p>
    </div>
  )
}

// ─── Product Form Modal ───────────────────────────────
function ProductFormModal({ product, onClose, onSaved }: {
  product: Product | null; onClose: () => void; onSaved: () => void
}) {
  const isEdit = !!product
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name_en: product?.name_en || '', description_en: product?.description_en || '',
    category_id: product?.category_id || '', price_min: product?.price_min?.toString() || '',
    price_max: product?.price_max?.toString() || '', currency: product?.currency || 'USD',
    moq: product?.moq?.toString() || '', image_url: product?.image_url || '',
    status: product?.status || 'active',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name_en.trim()) { setError('Product name is required'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        ...(isEdit ? { id: product.id } : {}),
        name: form.name_en, name_en: form.name_en, description_en: form.description_en,
        category_id: form.category_id || null, price_min: form.price_min || null,
        price_max: form.price_max || null, currency: form.currency,
        moq: form.moq || null, image_url: form.image_url || null, status: form.status,
      }
      const res = await fetch('/api/seller/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      onSaved(); onClose()
    } catch (err: any) { setError(err.message) } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <Input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} placeholder="e.g. Snail Mucin 96% Essence" className="rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} placeholder="Describe your product..." rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white">
              <option value="">Select category</option>
              {Object.entries(CATEGORIES).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label><Input type="number" step="0.01" value={form.price_min} onChange={(e) => setForm({ ...form, price_min: e.target.value })} placeholder="5.00" className="rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label><Input type="number" step="0.01" value={form.price_max} onChange={(e) => setForm({ ...form, price_max: e.target.value })} placeholder="25.00" className="rounded-xl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Currency</label><select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white"><option value="USD">USD</option><option value="KRW">KRW</option><option value="EUR">EUR</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">MOQ</label><Input type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} placeholder="100" className="rounded-xl" /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://example.com/image.jpg" className="rounded-xl" />
            {form.image_url && <div className="mt-2 w-20 h-20 rounded-lg border overflow-hidden bg-gray-50"><img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} /></div>}
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white"><option value="active">Active</option><option value="draft">Draft</option><option value="paused">Paused</option></select></div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{isEdit ? 'Save Changes' : 'Add Product'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirmation ──────────────────────────────
function DeleteConfirm({ productName, onCancel, onConfirm, deleting }: {
  productName: string; onCancel: () => void; onConfirm: () => void; deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4"><Trash2 className="h-6 w-6 text-red-600" /></div>
        <h3 className="text-lg font-bold text-navy mb-2">Delete Product</h3>
        <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete <strong>&quot;{productName}&quot;</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={onConfirm} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl">{deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Delete</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Lead Detail Modal ────────────────────────────────
function LeadDetailModal({ lead, onClose, onStatusChange }: {
  lead: Lead; onClose: () => void; onStatusChange: (id: string, status: string) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-navy">{lead.type === 'quote' ? 'Quote Request' : lead.type === 'partnership' ? 'Partnership Inquiry' : 'Product Inquiry'}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{new Date(lead.created_at).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-5">
          {/* Buyer info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center text-lg font-bold text-navy shrink-0">{lead.buyer_name[0]}</div>
            <div className="flex-1">
              <p className="font-medium text-navy">{lead.buyer_name}</p>
              <p className="text-sm text-gray-500">{lead.buyer_company || 'Individual buyer'}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.buyer_email}</span>
                {lead.buyer_country && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{lead.buyer_country}</span>}
              </div>
            </div>
            <Badge className={`${STATUS_COLORS[lead.status] || ''} text-[10px]`}>{lead.status}</Badge>
          </div>

          {/* Product */}
          {lead.products && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                {lead.products.image_url ? <img src={lead.products.image_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="h-5 w-5 text-gray-400 m-auto mt-2.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy truncate">{lead.products.name_en}</p>
                {lead.quantity && <p className="text-xs text-gray-400">Quantity: {lead.quantity} units</p>}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Message</label>
            <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">{lead.message}</div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {lead.status === 'new' && (
              <Button size="sm" variant="outline" onClick={() => { onStatusChange(lead.id, 'read'); onClose() }} className="flex-1 rounded-xl">
                <Eye className="h-4 w-4 mr-1" /> Mark as Read
              </Button>
            )}
            {(lead.status === 'new' || lead.status === 'read') && (
              <Button size="sm" onClick={() => { onStatusChange(lead.id, 'replied'); onClose() }} className="flex-1 bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
                <Reply className="h-4 w-4 mr-1" /> Mark as Replied
              </Button>
            )}
            {lead.status !== 'closed' && (
              <Button size="sm" variant="outline" onClick={() => { onStatusChange(lead.id, 'closed'); onClose() }} className="rounded-xl">
                <XCircle className="h-4 w-4 mr-1" /> Close
              </Button>
            )}
          </div>

          {lead.replied_at && (
            <p className="text-xs text-gray-400 text-center">
              Replied on {new Date(lead.replied_at).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────
export function DashboardContent() {
  const [tab, setTab] = useState<'overview' | 'products' | 'orders' | 'analytics' | 'profile'>('overview')
  const [loading, setLoading] = useState(true)
  const [dashData, setDashData] = useState<DashboardData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [leadsFilter, setLeadsFilter] = useState('all')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  // Modal state
  const [showProductForm, setShowProductForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Profile edit
  const [profileEditing, setProfileEditing] = useState(false)
  const [profileForm, setProfileForm] = useState<any>({})
  const [profileSaving, setProfileSaving] = useState(false)

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/seller/profile')
      if (res.ok) {
        const data = await res.json()
        setDashData(data)
        if (data.sellerProfile) {
          setProfileForm({
            company_name: data.sellerProfile.company_name || '',
            company_name_en: data.sellerProfile.company_name_en || '',
            description_en: data.sellerProfile.description_en || '',
            contact_email: data.sellerProfile.contact_email || '',
            website: data.sellerProfile.website || '',
            target_markets: data.sellerProfile.target_markets || [],
          })
        }
      }
    } finally { setLoading(false) }
  }, [])

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true)
    try {
      const res = await fetch('/api/seller/products')
      if (res.ok) { const data = await res.json(); setProducts(Array.isArray(data) ? data : []) }
    } finally { setProductsLoading(false) }
  }, [])

  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true)
    try {
      const res = await fetch(`/api/seller/leads?status=${leadsFilter}`)
      if (res.ok) { const data = await res.json(); setLeads(Array.isArray(data) ? data : []) }
    } finally { setLeadsLoading(false) }
  }, [leadsFilter])

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true)
    try {
      const res = await fetch('/api/seller/analytics')
      if (res.ok) { const data = await res.json(); setAnalytics(data) }
    } finally { setAnalyticsLoading(false) }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])
  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => {
    if (tab === 'orders') fetchLeads()
  }, [tab, fetchLeads])
  useEffect(() => {
    if (tab === 'analytics' || tab === 'overview') fetchAnalytics()
  }, [tab, fetchAnalytics])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/seller/products?id=${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) { setProducts(prev => prev.filter(p => p.id !== deleteTarget.id)); setDeleteTarget(null) }
    } finally { setDeleting(false) }
  }

  const handleLeadStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/seller/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        const updated = await res.json()
        setLeads(prev => prev.map(l => l.id === id ? updated : l))
      }
    } catch {}
  }

  const handleProfileSave = async () => {
    setProfileSaving(true)
    try {
      const res = await fetch('/api/seller/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (res.ok) { setProfileEditing(false); fetchDashboard() }
    } finally { setProfileSaving(false) }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-accent-red" /></div>
  }

  const seller = dashData?.sellerProfile
  const userName = dashData?.user?.full_name || dashData?.user?.email?.split('@')[0] || 'Seller'
  const ov = analytics?.overview

  const TABS = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'analytics' as const, label: 'Analytics' },
    { key: 'orders' as const, label: `Orders${leads.length ? ` (${leads.length})` : ''}` },
    { key: 'products' as const, label: `Products (${products.length})` },
    { key: 'profile' as const, label: 'Profile' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Seller Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {seller?.company_name_en || userName}
            {seller?.status === 'pending' && <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-[10px]">Pending Approval</Badge>}
            {seller?.status === 'approved' && <Badge className="ml-2 bg-green-100 text-green-800 text-[10px]">Approved</Badge>}
          </p>
        </div>
        <Button onClick={() => { setEditProduct(null); setShowProductForm(true) }} className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${tab === t.key ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >{t.label}</button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ──────────────────────────── */}
      {tab === 'overview' && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Products" value={products.length.toString()} sub={`${products.filter(p => p.status === 'active').length} active`} icon={Package} />
            <StatCard label="Total Leads" value={(ov?.totalLeads || 0).toString()} sub={`${ov?.newLeads || 0} new`} icon={MessageSquare} accent />
            <StatCard label="Avg. Rating" value={ov?.avgRating ? ov.avgRating.toFixed(1) : '—'} sub={`${ov?.reviewCount || 0} reviews`} icon={Star} />
            <StatCard label="Response Rate" value={`${ov?.repliedRate || 0}%`} sub={ov?.avgResponseHours ? `Avg. ${ov.avgResponseHours}h` : 'No replies yet'} icon={Clock} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Leads chart */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-navy">Leads (Last 6 Months)</h2>
                <button onClick={() => setTab('analytics')} className="text-sm text-accent-red hover:underline flex items-center gap-1">Details <ChevronRight className="h-3 w-3" /></button>
              </div>
              {analytics?.monthlyLeads && analytics.monthlyLeads.length > 0 ? (
                <MiniBarChart data={analytics.monthlyLeads.map(m => ({ label: m.month, value: m.count }))} height={140} />
              ) : (
                <div className="flex items-center justify-center h-[140px] text-gray-400 text-sm">No data yet</div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-navy">Recent Activity</h2>
                <button onClick={() => setTab('orders')} className="text-sm text-accent-red hover:underline flex items-center gap-1">View All <ChevronRight className="h-3 w-3" /></button>
              </div>
              {analytics?.recentActivity && analytics.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {analytics.recentActivity.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${a.type === 'lead' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                        {a.type === 'lead' ? <MessageSquare className="h-4 w-4 text-blue-600" /> : <Star className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-navy truncate">{a.title}</p>
                        <p className="text-xs text-gray-400">{a.subtitle}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{timeAgo(a.date)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[140px] text-gray-400 text-sm">No activity yet</div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-navy mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { icon: Package, label: 'Add Product', desc: 'List a new product', action: () => { setEditProduct(null); setShowProductForm(true) } },
                { icon: Inbox, label: 'View Orders', desc: 'Manage inquiries', action: () => setTab('orders') },
                { icon: BarChart3, label: 'Analytics', desc: 'Check performance', action: () => setTab('analytics') },
                { icon: FileText, label: 'Edit Profile', desc: 'Update business info', action: () => setTab('profile') },
                { icon: TrendingUp, label: 'Upgrade Plan', desc: 'Get more features', action: () => {} },
              ].map(a => (
                <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-accent-red/30 transition-colors text-center">
                  <a.icon className="h-6 w-6 text-navy" />
                  <span className="text-sm font-medium text-navy">{a.label}</span>
                  <span className="text-xs text-gray-400">{a.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─── ANALYTICS TAB ─────────────────────────── */}
      {tab === 'analytics' && (
        <>
          {analyticsLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
          ) : analytics ? (
            <>
              {/* Key Metrics */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Leads" value={analytics.overview.totalLeads.toString()} sub={`${analytics.overview.newLeads} unread`} icon={MessageSquare} accent />
                <StatCard label="Response Rate" value={`${analytics.overview.repliedRate}%`} sub={analytics.overview.avgResponseHours ? `Avg. ${analytics.overview.avgResponseHours}h response` : 'No replies'} icon={CheckCircle2} />
                <StatCard label="Products" value={`${analytics.overview.activeProducts}/${analytics.overview.totalProducts}`} sub="active / total" icon={Package} />
                <StatCard label="Rating" value={analytics.overview.avgRating ? analytics.overview.avgRating.toFixed(1) : '—'} sub={`${analytics.overview.reviewCount} reviews`} icon={Star} />
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Monthly trend */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-navy mb-4">Monthly Leads</h2>
                  <MiniBarChart data={analytics.monthlyLeads.map(m => ({ label: m.month, value: m.count }))} height={160} />
                </div>

                {/* Leads breakdown */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-navy mb-4">Lead Breakdown</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 mb-3">By Status</h3>
                      {analytics.leadsByStatus.length > 0 ? analytics.leadsByStatus.map(s => (
                        <div key={s.status} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${s.status === 'new' ? 'bg-blue-500' : s.status === 'read' ? 'bg-yellow-500' : s.status === 'replied' ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-sm text-gray-700 capitalize">{s.status}</span>
                          </div>
                          <span className="text-sm font-medium text-navy">{s.count}</span>
                        </div>
                      )) : <p className="text-sm text-gray-400">No leads yet</p>}
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 mb-3">By Type</h3>
                      {analytics.leadsByType.length > 0 ? analytics.leadsByType.map(t => (
                        <div key={t.type} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <span className="text-sm text-gray-700 capitalize">{t.type}</span>
                          <span className="text-sm font-medium text-navy">{t.count}</span>
                        </div>
                      )) : <p className="text-sm text-gray-400">No leads yet</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product performance */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-navy mb-4">Product Performance</h2>
                {analytics.productPerformance.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.productPerformance.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <span className="text-sm font-bold text-gray-300 w-6 text-center">{i + 1}</span>
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="h-5 w-5 text-gray-300 m-auto mt-2.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-navy truncate">{p.name}</p>
                          <Badge className={`text-[10px] ${STATUS_COLORS[p.status] || ''}`}>{p.status}</Badge>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-navy">{p.leads}</p>
                          <p className="text-[10px] text-gray-400">leads</p>
                        </div>
                        {/* mini bar */}
                        <div className="w-24 h-3 bg-gray-100 rounded-full overflow-hidden shrink-0 hidden sm:block">
                          <div className="h-full bg-accent-red/70 rounded-full transition-all duration-500" style={{ width: `${analytics.productPerformance.length > 0 ? (p.leads / Math.max(...analytics.productPerformance.map(x => x.leads), 1)) * 100 : 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-8">Add products to see performance data</p>
                )}
              </div>
            </>
          ) : null}
        </>
      )}

      {/* ─── ORDERS TAB ────────────────────────────── */}
      {tab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-navy">Inquiries & Orders</h2>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {['all', 'new', 'read', 'replied', 'closed'].map(s => (
                  <button key={s} onClick={() => setLeadsFilter(s)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${leadsFilter === s ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >{s}</button>
                ))}
              </div>
            </div>
          </div>

          {leadsLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Inbox className="h-16 w-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium text-gray-500 mb-1">{leadsFilter === 'all' ? 'No inquiries yet' : `No ${leadsFilter} inquiries`}</p>
              <p className="text-sm">Inquiries from buyers will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {leads.map(lead => (
                <button key={lead.id} onClick={() => setSelectedLead(lead)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors text-left">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${lead.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {lead.buyer_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium text-navy ${lead.status === 'new' ? 'font-bold' : ''}`}>{lead.buyer_name}</span>
                      <Badge className={`${STATUS_COLORS[lead.status] || ''} text-[10px]`}>{lead.status}</Badge>
                      <Badge variant="secondary" className="text-[10px] capitalize">{lead.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {lead.buyer_company ? `${lead.buyer_company} · ` : ''}{lead.products?.name_en || 'General inquiry'}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{lead.message}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{timeAgo(lead.created_at)}</p>
                    {lead.quantity && <p className="text-[10px] text-gray-400 mt-0.5">Qty: {lead.quantity}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── PRODUCTS TAB ──────────────────────────── */}
      {tab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Your Products</h2>
            <Button onClick={() => { setEditProduct(null); setShowProductForm(true) }} size="sm" className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </div>
          {productsLoading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium text-gray-500 mb-1">No products yet</p>
              <p className="text-sm mb-6">Start by adding your first product to your catalog.</p>
              <Button onClick={() => { setEditProduct(null); setShowProductForm(true) }} className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl"><Plus className="h-4 w-4 mr-2" /> Add Product</Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                    {p.image_url ? <img src={p.image_url} alt={p.name_en} className="w-full h-full object-cover" /> : <ImageIcon className="h-6 w-6 text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-navy truncate">{p.name_en}</p>
                      <Badge className={`text-[10px] shrink-0 ${STATUS_COLORS[p.status] || ''}`}>{p.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {CATEGORIES[p.category_id || ''] || 'Uncategorized'}
                      {p.price_min ? ` · $${p.price_min}` : ''}{p.price_max ? `–$${p.price_max}` : ''}{p.moq ? ` · MOQ ${p.moq}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/products/${p.slug}`}><Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg"><ExternalLink className="h-4 w-4 text-gray-400" /></Button></Link>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => { setEditProduct(p); setShowProductForm(true) }}><Pencil className="h-4 w-4 text-gray-400" /></Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:text-red-600" onClick={() => setDeleteTarget(p)}><Trash2 className="h-4 w-4 text-gray-400" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── PROFILE TAB ───────────────────────────── */}
      {tab === 'profile' && seller && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-navy">Business Profile</h2>
            {!profileEditing ? (
              <Button variant="outline" size="sm" onClick={() => setProfileEditing(true)} className="rounded-xl"><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setProfileEditing(false)} className="rounded-xl">Cancel</Button>
                <Button size="sm" onClick={handleProfileSave} disabled={profileSaving} className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
                  {profileSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}Save
                </Button>
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: 'Company Name (Korean)', key: 'company_name', display: seller.company_name },
              { label: 'Company Name (English)', key: 'company_name_en', display: seller.company_name_en },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                {profileEditing ? <Input value={profileForm[f.key]} onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })} className="rounded-xl" /> : <p className="text-sm text-navy font-medium">{f.display || '—'}</p>}
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              {profileEditing ? <textarea value={profileForm.description_en} onChange={e => setProfileForm({ ...profileForm, description_en: e.target.value })} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none" /> : <p className="text-sm text-gray-600">{seller.description_en || '—'}</p>}
            </div>
            {[
              { label: 'Contact Email', key: 'contact_email', display: seller.contact_email },
              { label: 'Website', key: 'website', display: seller.website },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                {profileEditing ? <Input value={profileForm[f.key]} onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })} className="rounded-xl" /> : <p className="text-sm text-gray-600">{f.display || '—'}</p>}
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Seller Type</label>
              <p className="text-sm text-gray-600 capitalize">{seller.seller_type || '—'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Target Markets</label>
              <div className="flex flex-wrap gap-1.5">{(seller.target_markets || []).map(m => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Subscription</label>
              <Badge className="text-xs capitalize">{seller.subscription_tier || 'free'}</Badge>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Profile URL</label>
              <Link href={`/brands/${seller.slug}`} className="text-sm text-accent-red hover:underline flex items-center gap-1">/brands/{seller.slug} <ExternalLink className="h-3 w-3" /></Link>
            </div>
          </div>
        </div>
      )}

      {tab === 'profile' && !seller && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500 mb-2">No Seller Profile</p>
          <p className="text-sm text-gray-400 mb-6">Complete seller onboarding to access your business profile.</p>
          <Link href="/seller-onboarding"><Button className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">Complete Onboarding</Button></Link>
        </div>
      )}

      {/* ─── MODALS ────────────────────────────────── */}
      {showProductForm && (
        <ProductFormModal product={editProduct} onClose={() => { setShowProductForm(false); setEditProduct(null) }} onSaved={fetchProducts} />
      )}
      {deleteTarget && (
        <DeleteConfirm productName={deleteTarget.name_en} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} deleting={deleting} />
      )}
      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} onStatusChange={handleLeadStatusChange} />
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}
