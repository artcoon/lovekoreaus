'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star, ShieldCheck, Globe, MapPin, Play, MessageSquare,
  ExternalLink, Mail, Phone, Package, Users, Award, ImageIcon,
  Send, Loader2, CheckCircle2, X, AlertCircle
} from 'lucide-react'

export function BrandDetail({ slug, seller, products, reviews }: {
  slug: string
  seller?: any
  products?: any[]
  reviews?: any[]
}) {
  const [showContact, setShowContact] = useState(false)

  const brand = {
    name: seller?.company_name_en || seller?.name || 'Brand',
    slug: seller?.slug || slug,
    category: seller?.seller_type || 'brand',
    type: seller?.seller_type || 'Brand',
    location: seller?.address ? `${seller.address.city || ''}, ${seller.address.country || 'KR'}` : 'South Korea',
    description: seller?.description_en || seller?.description || '',
    rating: seller?.rating_avg ?? seller?.rating ?? 0,
    reviewCount: seller?.review_count ?? seller?.reviewCount ?? 0,
    productCount: products?.length || 0,
    employees: '—',
    markets: seller?.target_markets || [],
    certs: seller?.certs || [],
    verified: seller?.is_verified ?? false,
    website: seller?.website_url || seller?.website || '',
    email: seller?.contact_email || seller?.email || '',
    phone: seller?.contact_phone || seller?.phone || '',
    govtSupport: seller?.govt_support ?? false,
    logoUrl: seller?.logo_url || null,
    coverUrl: seller?.cover_image_url || null,
    subscriptionTier: seller?.subscription_tier || 'free',
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-navy to-navy-light overflow-hidden">
          {brand.coverUrl && (
            <img src={brand.coverUrl} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-navy overflow-hidden">
              {brand.logoUrl ? (
                <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
              ) : (
                brand.name[0]
              )}
            </div>
            <div className="flex-1 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-navy">{brand.name}</h1>
                {brand.verified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                {brand.subscriptionTier !== 'free' && (
                  <Badge className="bg-amber-100 text-amber-700 text-[10px] capitalize">{brand.subscriptionTier}</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-3 mt-1 flex-wrap">
                <span className="capitalize">{brand.type}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {brand.location}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowContact(true)}
                className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 flex gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-navy">{brand.rating > 0 ? brand.rating.toFixed(1) : '—'}</span>
              <span className="text-sm text-gray-400">({brand.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="h-4 w-4" />
              {brand.productCount} products
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              {brand.markets.length} markets
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
        {/* Left content */}
        <div className="space-y-8">
          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-navy mb-4">About</h2>
            {brand.description ? (
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{brand.description}</p>
            ) : (
              <p className="text-sm text-gray-400">No description available.</p>
            )}
            {brand.certs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {brand.certs.map((c: string) => (
                  <Badge key={c} variant="secondary" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    {c}
                  </Badge>
                ))}
              </div>
            )}
            {brand.govtSupport && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">KOTRA / Government Export Support Participant</span>
              </div>
            )}
          </div>

          {/* Products from DB */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy">Products ({brand.productCount})</h2>
              <Link href="/products" className="text-sm text-accent-red hover:underline">View All</Link>
            </div>
            {products && products.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {products.slice(0, 4).map((p: any) => (
                  <Link key={p.slug} href={`/products/${p.slug}`}>
                    <div className="group rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                      <div className="aspect-square rounded-lg bg-gray-100 mb-3 flex items-center justify-center overflow-hidden">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name_en} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-200" />
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-navy group-hover:text-accent-red transition-colors line-clamp-1">{p.name_en || p.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-bold text-navy">{p.price_min ? `$${p.price_min}` : 'Contact'}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-500">{p.rating_avg?.toFixed(1) || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No products listed yet</p>
              </div>
            )}
          </div>

          {/* Reviews */}
          {reviews && reviews.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-navy mb-4">Buyer Reviews</h2>
              <div className="space-y-4">
                {reviews.slice(0, 5).map((r: any) => (
                  <div key={r.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`h-3 w-3 ${s <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}</div>
                      <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="mt-8 lg:mt-0 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-navy mb-4">Contact Information</h3>
            <div className="space-y-3">
              {brand.website && (
                <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent-red">
                  <ExternalLink className="h-4 w-4" />
                  {brand.website.replace('https://', '').replace('http://', '')}
                </a>
              )}
              {brand.email && (
                <a href={`mailto:${brand.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent-red">
                  <Mail className="h-4 w-4" />
                  {brand.email}
                </a>
              )}
              {brand.phone && (
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {brand.phone}
                </p>
              )}
              {!brand.website && !brand.email && !brand.phone && (
                <p className="text-sm text-gray-400">No contact info available</p>
              )}
            </div>

            {brand.markets.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-navy mb-3">Target Markets</h3>
                <div className="flex flex-wrap gap-2">
                  {brand.markets.map((m: string) => (
                    <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-navy mb-3">Company Info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium text-navy capitalize">{brand.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Verified</dt>
                  <dd className="font-medium text-navy">{brand.verified ? 'Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>

            <Button
              onClick={() => setShowContact(true)}
              className="w-full mt-6 bg-accent-red hover:bg-accent-red-dark text-white rounded-xl"
              size="lg"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact This Seller
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <ContactModal
          sellerName={brand.name}
          sellerEmail={brand.email}
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  )
}

// ── Contact Modal ─────────────────────────────────────────
function ContactModal({ sellerName, sellerEmail, onClose }: {
  sellerName: string; sellerEmail: string; onClose: () => void
}) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', company: '', country: '', message: '', type: 'inquiry' as string
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSending(true); setError('')
    try {
      // This would normally submit to the leads API
      await new Promise(r => setTimeout(r, 1000))
      setSent(true)
    } catch {
      setError('Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-navy mb-2">Message Sent!</h2>
          <p className="text-sm text-gray-500 mb-6">Your inquiry has been sent to {sellerName}. They typically respond within 24-48 hours.</p>
          <Button onClick={onClose} className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">Close</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Contact {sellerName}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5 text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Type</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white">
              <option value="inquiry">General Inquiry</option>
              <option value="quote">Request Quote</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={4} placeholder="Tell the seller what you're looking for..." className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={sending} className="flex-1 bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send Inquiry
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
