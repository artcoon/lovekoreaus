'use client'

import { Link } from '@/i18n/navigation'
import { MapPin, Star, ShieldCheck, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockSellers = [
  {
    slug: 'hana-cosmetics',
    name: 'Hana Cosmetics Co.',
    category: 'Beauty & Cosmetics',
    type: 'Manufacturer',
    location: 'Seoul, Korea',
    rating: 4.8,
    reviewCount: 124,
    markets: ['US', 'JP'],
    verified: true,
    certs: ['FDA', 'ISO'],
    description: 'Premium Korean skincare and cosmetics manufacturer with 15 years of export experience.',
  },
  {
    slug: 'kimchi-world',
    name: 'Kimchi World Inc.',
    category: 'Food & Health',
    type: 'Brand',
    location: 'Busan, Korea',
    rating: 4.6,
    reviewCount: 89,
    markets: ['US', 'CN'],
    verified: true,
    certs: ['HACCP', 'FDA'],
    description: 'Traditional Korean fermented foods producer, specializing in premium kimchi and condiments.',
  },
  {
    slug: 'k-style-fashion',
    name: 'K-Style Fashion',
    category: 'Fashion & Lifestyle',
    type: 'Brand',
    location: 'Seoul, Korea',
    rating: 4.5,
    reviewCount: 67,
    markets: ['US', 'JP', 'CN'],
    verified: false,
    certs: [],
    description: 'Contemporary Korean fashion brand blending traditional aesthetics with modern streetwear.',
  },
  {
    slug: 'seoul-tech',
    name: 'Seoul Tech Solutions',
    category: 'Business & Trade',
    type: 'Service',
    location: 'Incheon, Korea',
    rating: 4.9,
    reviewCount: 45,
    markets: ['Global'],
    verified: true,
    certs: ['ISO'],
    description: 'B2B technology services provider specializing in Korean market entry and localization.',
  },
  {
    slug: 'green-tea-farm',
    name: 'Green Tea Farm Jeju',
    category: 'Food & Health',
    type: 'Manufacturer',
    location: 'Jeju, Korea',
    rating: 4.7,
    reviewCount: 56,
    markets: ['US', 'JP'],
    verified: true,
    certs: ['HACCP'],
    description: 'Organic green tea producer from Jeju Island. Premium matcha and loose-leaf tea exports.',
  },
  {
    slug: 'hallyu-goods',
    name: 'Hallyu Goods Co.',
    category: 'Culture & Goods',
    type: 'Distributor',
    location: 'Seoul, Korea',
    rating: 4.4,
    reviewCount: 178,
    markets: ['US', 'JP', 'CN'],
    verified: false,
    certs: [],
    description: 'K-pop merchandise and Korean cultural goods distributor for global markets.',
  },
]

export function DirectoryGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{mockSellers.length} businesses found</p>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-red">
          <option>Sort by: Relevance</option>
          <option>Rating: High to Low</option>
          <option>Most Reviews</option>
          <option>Newest</option>
        </select>
      </div>

      <div className="grid gap-4">
        {mockSellers.map((seller) => (
          <Link key={seller.slug} href={`/brands/${seller.slug}`}>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-navy shrink-0">
                  {seller.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-navy">{seller.name}</h3>
                    {seller.verified && (
                      <ShieldCheck className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>{seller.category}</span>
                    <span>·</span>
                    <span>{seller.type}</span>
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
