'use client'

import { Link } from '@/i18n/navigation'
import { MapPin, Star, ShieldCheck, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const BRAND_IMAGES: Record<string, string> = {
  'hana-cosmetics': '/images/brands/hana-cosmetics.jpg',
  'kimchi-world': '/images/brands/kimchi-world.jpg',
  'k-style-fashion': '/images/brands/k-style-fashion.jpg',
  'seoul-tech': '/images/brands/seoul-tech.jpg',
  'green-tea-farm': '/images/brands/green-tea-farm.jpg',
  'hallyu-goods': '/images/brands/hallyu-goods.jpg',
}

interface SellerItem {
  slug: string
  company_name_en: string
  seller_type: string
  description_en: string | null
  address: Record<string, string>
  rating_avg: number
  review_count: number
  target_markets: string[]
  is_verified: boolean
  certs: string[]
  logo_url?: string | null
  cover_image_url?: string | null
}

export function DirectoryGrid({ sellers }: { sellers: SellerItem[] }) {
  const mappedSellers = sellers.map((s) => ({
    slug: s.slug,
    name: s.company_name_en,
    type: s.seller_type,
    location: `${s.address?.city || 'Seoul'}, Korea`,
    rating: s.rating_avg,
    reviewCount: s.review_count,
    markets: s.target_markets,
    verified: s.is_verified,
    certs: s.certs || [],
    description: s.description_en || '',
    image: s.logo_url || s.cover_image_url || BRAND_IMAGES[s.slug] || null,
  }))
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{mappedSellers.length} businesses found</p>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-red">
          <option>Sort by: Relevance</option>
          <option>Rating: High to Low</option>
          <option>Most Reviews</option>
          <option>Newest</option>
        </select>
      </div>

      <div className="grid gap-4">
        {mappedSellers.map((seller) => (
          <Link key={seller.slug} href={`/brands/${seller.slug}`}>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                  {seller.image ? (
                    <img src={seller.image} alt={seller.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-navy">{seller.name[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-navy">{seller.name}</h3>
                    {seller.verified && (
                      <ShieldCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="capitalize">{seller.type}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {seller.location}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{seller.description}</p>
                  <div className="mt-3 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-navy">{seller.rating}</span>
                      <span className="text-sm text-gray-400">({seller.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{seller.markets.join(', ')}</span>
                    </div>
                    {seller.certs.length > 0 && (
                      <div className="flex gap-1">
                        {seller.certs.map((c) => (
                          <Badge key={c} variant="secondary" className="text-xs">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              page === 1
                ? 'bg-navy text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}
