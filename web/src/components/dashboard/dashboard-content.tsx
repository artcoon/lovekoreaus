'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link } from '@/i18n/navigation'
import {
  Package, MessageSquare, Eye, TrendingUp, Star, Users,
  Plus, Settings, BarChart3, FileText, ChevronRight, Loader2,
  Pencil, Trash2, ExternalLink, AlertCircle, X, ImageIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'

type Product = {
  id: string
  name: string
  name_en: string
  slug: string
  description_en: string
  category_id: string | null
  price_min: number | null
  price_max: number | null
  currency: string
  moq: number | null
  image_url: string | null
  status: string
  certifications: string[]
  created_at: string
}

type SellerProfile = {
  id: string
  company_name: string
  company_name_en: string
  slug: string
  description_en: string
  contact_email: string
  website: string | null
  target_markets: string[]
  status: string
  subscription_tier: string
  seller_type: string
  rating: number | null
  review_count: number | null
}

type DashboardData = {
  user: { id: string; email: string; full_name: string | null }
  profile: any
  sellerProfile: SellerProfile | null
  stats: { productCount: number }
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

// ─── Product Form Modal ───────────────────────────────
function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!product
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name_en: product?.name_en || '',
    description_en: product?.description_en || '',
    category_id: product?.category_id || '',
    price_min: product?.price_min?.toString() || '',
    price_max: product?.price_max?.toString() || '',
    currency: product?.currency || 'USD',
    moq: product?.moq?.toString() || '',
    image_url: product?.image_url || '',
    status: product?.status || 'active',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name_en.trim()) { setError('Product name is required'); return }

    setSaving(true)
    setError('')

    try {
      const payload = {
        ...(isEdit ? { id: product.id } : {}),
        name: form.name_en,
        name_en: form.name_en,
        description_en: form.description_en,
        category_id: form.category_id || null,
        price_min: form.price_min || null,
        price_max: form.price_max || null,
        currency: form.currency,
        moq: form.moq || null,
        image_url: form.image_url || null,
        status: form.status,
      }

      const res = await fetch('/api/seller/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      onSaved()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <Input
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              placeholder="e.g. Snail Mucin 96% Essence"
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description_en}
              onChange={(e) => setForm({ ...form, description_en: e.target.value })}
              placeholder="Describe your product..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red bg-white"
            >
              <option value="">Select category</option>
              {Object.entries(CATEGORIES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <Input
                type="number"
                step="0.01"
                value={form.price_min}
                onChange={(e) => setForm({ ...form, price_min: e.target.value })}
                placeholder="5.00"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <Input
                type="number"
                step="0.01"
                value={form.price_max}
                onChange={(e) => setForm({ ...form, price_max: e.target.value })}
                placeholder="25.00"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red bg-white"
              >
                <option value="USD">USD</option>
                <option value="KRW">KRW</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MOQ (Minimum Order Quantity)</label>
            <Input
              type="number"
              value={form.moq}
              onChange={(e) => setForm({ ...form, moq: e.target.value })}
              placeholder="100"
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="rounded-xl"
            />
            {form.image_url && (
              <div className="mt-2 w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red bg-white"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isEdit ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirmation ──────────────────────────────
function DeleteConfirm({
  productName,
  onCancel,
  onConfirm,
  deleting,
}: {
  productName: string
  onCancel: () => void
  onConfirm: () => void
  deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-navy mb-2">Delete Product</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete <strong>&quot;{productName}&quot;</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 rounded-xl">Cancel</Button>
          <Button onClick={onConfirm} disabled={deleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl">
            {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────
export function DashboardContent() {
  const [tab, setTab] = useState<'overview' | 'products' | 'profile'>('overview')
  const [loading, setLoading] = useState(true)
  const [dashData, setDashData] = useState<DashboardData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(false)

  // Modal state
  const [showProductForm, setShowProductForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

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
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true)
    try {
      const res = await fetch('/api/seller/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : [])
      }
    } finally {
      setProductsLoading(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])
  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/seller/products?id=${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        setDeleteTarget(null)
      }
    } finally {
      setDeleting(false)
    }
  }

  const handleProfileSave = async () => {
    setProfileSaving(true)
    try {
      const res = await fetch('/api/seller/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      })
      if (res.ok) {
        setProfileEditing(false)
        fetchDashboard()
      }
    } finally {
      setProfileSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent-red" />
      </div>
    )
  }

  const seller = dashData?.sellerProfile
  const userName = dashData?.user?.full_name || dashData?.user?.email?.split('@')[0] || 'Seller'

  const stats = [
    { label: 'Total Products', value: products.length.toString(), icon: Package, sub: `${products.filter(p => p.status === 'active').length} active` },
    { label: 'Profile Views', value: seller?.review_count?.toString() || '0', icon: Eye, sub: 'All time' },
    { label: 'Rating', value: seller?.rating?.toFixed(1) || '—', icon: Star, sub: `${seller?.review_count || 0} reviews` },
    { label: 'Plan', value: (seller?.subscription_tier || 'free').toUpperCase(), icon: TrendingUp, sub: seller?.status || 'pending' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Seller Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {seller?.company_name_en || userName}
            {seller?.status === 'pending' && (
              <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-[10px]">Pending Approval</Badge>
            )}
            {seller?.status === 'approved' && (
              <Badge className="ml-2 bg-green-100 text-green-800 text-[10px]">Approved</Badge>
            )}
          </p>
        </div>
        <Button
          onClick={() => { setEditProduct(null); setShowProductForm(true) }}
          className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {(['overview', 'products', 'profile'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
              tab === t ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'overview' ? 'Overview' : t === 'products' ? `Products (${products.length})` : 'Profile'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <s.icon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-navy">{s.value}</div>
                <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy">Recent Products</h2>
              <button onClick={() => setTab('products')} className="text-sm text-accent-red hover:underline flex items-center gap-1">
                View All <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No products yet</p>
                <Button
                  onClick={() => { setEditProduct(null); setShowProductForm(true) }}
                  className="mt-4 bg-accent-red hover:bg-accent-red-dark text-white rounded-xl"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name_en} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{p.name_en}</p>
                      <p className="text-xs text-gray-400">
                        {p.price_min ? `$${p.price_min}` : '—'}
                        {p.price_max ? ` – $${p.price_max}` : ''}
                        {p.moq ? ` · MOQ ${p.moq}` : ''}
                      </p>
                    </div>
                    <Badge
                      variant={p.status === 'active' ? 'default' : 'secondary'}
                      className={`text-[10px] ${p.status === 'active' ? 'bg-green-100 text-green-800' : ''}`}
                    >
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-navy mb-4">Quick Actions</h2>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { icon: Package, label: 'Add Product', desc: 'List a new product', action: () => { setEditProduct(null); setShowProductForm(true) } },
                { icon: FileText, label: 'Edit Profile', desc: 'Update business info', action: () => setTab('profile') },
                { icon: BarChart3, label: 'View Products', desc: 'Manage listings', action: () => setTab('products') },
                { icon: TrendingUp, label: 'Upgrade Plan', desc: 'Get more features', action: () => {} },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={a.action}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-accent-red/30 transition-colors text-center"
                >
                  <a.icon className="h-6 w-6 text-navy" />
                  <span className="text-sm font-medium text-navy">{a.label}</span>
                  <span className="text-xs text-gray-400">{a.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Your Products</h2>
            <Button
              onClick={() => { setEditProduct(null); setShowProductForm(true) }}
              size="sm"
              className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Package className="h-16 w-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium text-gray-500 mb-1">No products yet</p>
              <p className="text-sm mb-6">Start by adding your first product to your catalog.</p>
              <Button
                onClick={() => { setEditProduct(null); setShowProductForm(true) }}
                className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name_en} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-navy truncate">{p.name_en}</p>
                      <Badge
                        variant={p.status === 'active' ? 'default' : 'secondary'}
                        className={`text-[10px] shrink-0 ${p.status === 'active' ? 'bg-green-100 text-green-800' : p.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {CATEGORIES[p.category_id || ''] || 'Uncategorized'}
                      {p.price_min ? ` · $${p.price_min}` : ''}
                      {p.price_max ? `–$${p.price_max}` : ''}
                      {p.moq ? ` · MOQ ${p.moq}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/products/${p.slug}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg"
                      onClick={() => { setEditProduct(p); setShowProductForm(true) }}
                    >
                      <Pencil className="h-4 w-4 text-gray-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg hover:text-red-600"
                      onClick={() => setDeleteTarget(p)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && seller && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-navy">Business Profile</h2>
            {!profileEditing ? (
              <Button variant="outline" size="sm" onClick={() => setProfileEditing(true)} className="rounded-xl">
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setProfileEditing(false)} className="rounded-xl">Cancel</Button>
                <Button
                  size="sm"
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                  className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl"
                >
                  {profileSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Company Name (Korean)</label>
              {profileEditing ? (
                <Input
                  value={profileForm.company_name}
                  onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                  className="rounded-xl"
                />
              ) : (
                <p className="text-sm text-navy font-medium">{seller.company_name || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Company Name (English)</label>
              {profileEditing ? (
                <Input
                  value={profileForm.company_name_en}
                  onChange={(e) => setProfileForm({ ...profileForm, company_name_en: e.target.value })}
                  className="rounded-xl"
                />
              ) : (
                <p className="text-sm text-navy font-medium">{seller.company_name_en || '—'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              {profileEditing ? (
                <textarea
                  value={profileForm.description_en}
                  onChange={(e) => setProfileForm({ ...profileForm, description_en: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red resize-none"
                />
              ) : (
                <p className="text-sm text-gray-600">{seller.description_en || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Contact Email</label>
              {profileEditing ? (
                <Input
                  value={profileForm.contact_email}
                  onChange={(e) => setProfileForm({ ...profileForm, contact_email: e.target.value })}
                  className="rounded-xl"
                />
              ) : (
                <p className="text-sm text-gray-600">{seller.contact_email || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
              {profileEditing ? (
                <Input
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                  className="rounded-xl"
                />
              ) : (
                <p className="text-sm text-gray-600">{seller.website || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Seller Type</label>
              <p className="text-sm text-gray-600 capitalize">{seller.seller_type || '—'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Target Markets</label>
              <div className="flex flex-wrap gap-1.5">
                {(seller.target_markets || []).map((m) => (
                  <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Subscription</label>
              <Badge className="text-xs capitalize">{seller.subscription_tier || 'free'}</Badge>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Profile URL</label>
              <Link href={`/brands/${seller.slug}`} className="text-sm text-accent-red hover:underline flex items-center gap-1">
                /brands/{seller.slug} <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {tab === 'profile' && !seller && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500 mb-2">No Seller Profile</p>
          <p className="text-sm text-gray-400 mb-6">Complete seller onboarding to access your business profile.</p>
          <Link href="/seller-onboarding">
            <Button className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
              Complete Onboarding
            </Button>
          </Link>
        </div>
      )}

      {/* Modals */}
      {showProductForm && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowProductForm(false); setEditProduct(null) }}
          onSaved={fetchProducts}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          productName={deleteTarget.name_en}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  )
}
