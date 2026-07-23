'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star, ShieldCheck, Play, Heart, Share2, MessageSquare,
  FileText, Globe, Package, ChevronRight, ImageIcon,
  Send, X, Loader2, CheckCircle2, AlertCircle, Copy, Check
} from 'lucide-react'

export function ProductDetail({ slug, product, reviews }: { slug: string; product?: any; reviews?: any[] }) {
  const [showInquiry, setShowInquiry] = useState(false)
  const [inquiryType, setInquiryType] = useState<'inquiry' | 'quote'>('inquiry')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const data = {
    name: product?.name_en || 'Product',
    price: product?.price_min ? `$${product.price_min.toFixed(2)}` : 'Contact for price',
    priceMax: product?.price_max && product.price_max !== product.price_min ? `$${product.price_max.toFixed(2)}` : null,
    rating: product?.rating_avg ?? 0,
    reviewCount: product?.review_count ?? 0,
    description: product?.description_en || product?.description || '',
    specs: (product?.specs && Object.keys(product.specs).length > 0) ? product.specs : {},
    certs: product?.certs?.length ? product.certs : [],
    markets: product?.available_markets?.length ? product.available_markets : [],
    brand: product?.brand || '',
    brandSlug: product?.brandSlug || '',
    category: product?.category || '',
    moq: product?.moq ? `${product.moq} ${product.unit || 'units'}` : null,
    hasVideo: product?.hasVideo ?? false,
    imageUrl: product?.image_url || null,
    isSponsor: product?.is_sponsored ?? false,
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-navy">Products</Link>
        {data.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-navy">{data.category}</span>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-400 truncate max-w-[200px]">{data.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-10">
        {/* Left: Image + Video */}
        <div>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
              {data.imageUrl ? (
                <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 text-gray-200 mx-auto" />
                  <span className="text-sm text-gray-300 mt-2 block">{data.brand}</span>
                </div>
              )}
            </div>
          </div>
          {data.hasVideo && (
            <div className="mt-4 bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-video bg-gray-200 flex items-center justify-center cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-accent-red transition-colors">
                  <Play className="h-7 w-7 text-white fill-white ml-1" />
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-navy">Product Review Video</p>
                <p className="text-xs text-gray-500 mt-1">Watch a detailed review on YouTube</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Info + Actions */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {data.brand && (
              <Link href={`/brands/${data.brandSlug}`} className="text-sm text-accent-red font-medium hover:underline">
                {data.brand}
              </Link>
            )}
            <h1 className="mt-2 text-2xl font-bold text-navy leading-snug">{data.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(data.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-navy ml-1">{data.rating > 0 ? data.rating.toFixed(1) : '—'}</span>
                <span className="text-sm text-gray-400">({data.reviewCount} reviews)</span>
              </div>
              {data.isSponsor && <Badge className="bg-amber-100 text-amber-700 text-[10px]">Sponsored</Badge>}
            </div>

            {data.certs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {data.certs.map((c: string) => (
                  <Badge key={c} className="bg-green-50 text-green-700 text-xs border border-green-200">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    {c}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-navy">{data.price}</span>
                {data.priceMax && <span className="text-sm text-gray-400">— {data.priceMax}</span>}
              </div>
              {data.moq && <p className="text-sm text-gray-500 mt-1">MOQ: {data.moq}</p>}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={() => { setInquiryType('inquiry'); setShowInquiry(true) }}
                className="w-full bg-accent-red hover:bg-accent-red-dark text-white rounded-xl" size="lg"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Inquiry
              </Button>
              <Button
                onClick={() => { setInquiryType('quote'); setShowInquiry(true) }}
                variant="outline"
                className="w-full border-navy text-navy hover:bg-navy/5 rounded-xl" size="lg"
              >
                <FileText className="h-4 w-4 mr-2" />
                Request Quote
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSaved(!saved)}
                  className={`flex-1 rounded-xl ${saved ? 'bg-pink-50 border-pink-200 text-pink-600' : ''}`}
                  size="lg"
                >
                  <Heart className={`h-4 w-4 mr-1 ${saved ? 'fill-pink-500 text-pink-500' : ''}`} />
                  {saved ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex-1 rounded-xl" size="lg">
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Share2 className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
              </div>
            </div>

            {data.markets.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-semibold text-navy mb-3">Available Markets</h3>
                <div className="flex gap-2 flex-wrap">
                  {data.markets.map((m: string) => (
                    <Badge key={m} variant="outline" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />{m}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        {data.description && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-navy mb-4">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{data.description}</p>
          </div>
        )}
        {Object.keys(data.specs).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-navy mb-4">Specifications</h2>
            <dl className="space-y-3">
              {Object.entries(data.specs).map(([key, val]: [string, any]) => (
                <div key={key} className="flex justify-between text-sm">
                  <dt className="text-gray-500">{key}</dt>
                  <dd className="font-medium text-navy">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Reviews from DB or mock */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-navy mb-6">
          Buyer Reviews {data.reviewCount > 0 && <span className="text-gray-400 font-normal">({data.reviewCount})</span>}
        </h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((r: any, i: number) => (
              <div key={r.id || i} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-sm font-bold text-navy">
                    {(r.user_name || r.user || 'A')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">{r.user_name || r.user || 'Anonymous'}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`h-3 w-3 ${s <= (r.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {r.country && `${r.country} · `}
                        {r.created_at ? new Date(r.created_at).toLocaleDateString() : r.date || ''}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 ml-11">{r.body || r.text || ''}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <InquiryModal
          productName={data.name}
          brandName={data.brand}
          type={inquiryType}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </div>
  )
}

function InquiryModal({ productName, brandName, type, onClose }: {
  productName: string; brandName: string; type: 'inquiry' | 'quote'; onClose: () => void
}) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', company: '', country: '', quantity: '', message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }
    setSending(true); setError('')
    try {
      await new Promise(r => setTimeout(r, 1000))
      setSent(true)
    } catch {
      setError('Failed to send. Please try again.')
    } finally { setSending(false) }
  }

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-navy mb-2">{type === 'quote' ? 'Quote Requested!' : 'Inquiry Sent!'}</h2>
          <p className="text-sm text-gray-500 mb-6">Your {type === 'quote' ? 'quote request' : 'inquiry'} for <strong>{productName}</strong> has been sent to {brandName}.</p>
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
          <h2 className="text-lg font-bold text-navy">{type === 'quote' ? 'Request Quote' : 'Send Inquiry'} — {productName}</h2>
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
          {type === 'quote' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desired Quantity</label>
              <input value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="e.g. 500 units" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={4} placeholder={type === 'quote' ? 'Describe your requirements, target price, delivery timeline...' : 'What would you like to know about this product?'} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={sending} className="flex-1 bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              {type === 'quote' ? 'Request Quote' : 'Send Inquiry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
