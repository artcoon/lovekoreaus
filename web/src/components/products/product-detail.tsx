'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star, ShieldCheck, Play, Heart, Share2, MessageSquare,
  FileText, Globe, Package, ChevronRight
} from 'lucide-react'

const mockProduct = {
  name: 'Snail Mucin 96% Power Repairing Essence',
  brand: 'COSRX',
  brandSlug: 'cosrx',
  category: 'Beauty & Cosmetics',
  price: '$15.99',
  moq: '100 units',
  rating: 4.8,
  reviewCount: 2340,
  description: `Advanced snail secretion filtrate with 96% concentration for deep hydration, skin repair, and elasticity improvement. Lightweight gel texture absorbs quickly without sticky residue. Suitable for all skin types including sensitive skin.`,
  specs: {
    'Volume': '100ml',
    'Skin Type': 'All',
    'Key Ingredient': 'Snail Secretion Filtrate 96%',
    'Shelf Life': '12 months',
    'Made In': 'South Korea',
  },
  certs: ['FDA Registered', 'Cruelty-Free', 'Dermatologist Tested'],
  markets: ['US', 'Japan', 'China', 'EU'],
  hasVideo: true,
}

const mockReviews = [
  { user: 'Sarah M.', country: 'US', rating: 5, text: 'Best skincare product I have ever used. My skin has never been this hydrated and glowy.', date: '2026-06-15' },
  { user: 'Yuki T.', country: 'JP', rating: 4, text: 'Great product, gentle on sensitive skin. Packaging could be improved for shipping.', date: '2026-05-28' },
  { user: 'Emily K.', country: 'US', rating: 5, text: 'Repurchased 3 times already. The snail mucin is a game changer for texture improvement.', date: '2026-05-10' },
]

export function ProductDetail({ slug, product }: { slug: string; product?: any }) {
  const data = product
    ? {
        ...mockProduct,
        name: product.name_en || mockProduct.name,
        price: product.price_min ? `$${product.price_min.toFixed(2)}` : mockProduct.price,
        rating: product.rating_avg ?? mockProduct.rating,
        reviewCount: product.review_count ?? mockProduct.reviewCount,
        description: product.description_en || mockProduct.description,
        specs: (product.specs && Object.keys(product.specs).length > 0) ? product.specs : mockProduct.specs,
        certs: product.certs?.length ? product.certs : mockProduct.certs,
        markets: product.available_markets?.length ? product.available_markets : mockProduct.markets,
        brand: product.brand || mockProduct.brand,
        brandSlug: product.brandSlug || mockProduct.brandSlug,
        moq: product.moq ? `${product.moq} ${product.unit || 'units'}` : mockProduct.moq,
      }
    : mockProduct

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-navy">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-navy">{data.category}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-400 truncate">{data.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[1fr_420px] lg:gap-10">
        {/* Left: Image + Video */}
        <div>
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <span className="text-6xl font-bold text-gray-300">{data.name[0]}</span>
            </div>
          </div>
          {data.hasVideo && (
            <div className="mt-4 bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
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
            <Link href={`/brands/${data.brandSlug}`} className="text-sm text-accent-red font-medium hover:underline">
              {data.brand}
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-navy leading-snug">{data.name}</h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-navy">{mockProduct.rating}</span>
                <span className="text-sm text-gray-400">({data.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {data.certs.map((c: string) => (
                <Badge key={c} variant="secondary" className="text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {c}
                </Badge>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="text-3xl font-bold text-navy">{data.price}</div>
              <p className="text-sm text-gray-500 mt-1">MOQ: {data.moq}</p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button className="w-full bg-accent-red hover:bg-accent-red-dark text-white rounded-xl" size="lg">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Inquiry
              </Button>
              <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy/5 rounded-xl" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Request Quote
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl" size="lg">
                  <Heart className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl" size="lg">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-navy mb-3">Available Markets</h3>
              <div className="flex gap-2 flex-wrap">
                {data.markets.map((m: string) => (
                  <Badge key={m} variant="outline" className="text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-navy mb-4">Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
        </div>
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
      </div>

      {/* Reviews */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-navy mb-6">Buyer Reviews</h2>
        <div className="space-y-6">
          {mockReviews.map((r, i) => (
            <div key={i} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-sm font-bold text-navy">
                  {r.user[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">{r.user}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{r.country} · {r.date}</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 ml-11">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
