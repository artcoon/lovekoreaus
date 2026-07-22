'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Star, ShieldCheck, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const categories = ['All', 'Beauty', 'Food & Health', 'Fashion', 'K-Culture', 'Tech', 'Home']

const mockProducts = [
  {
    slug: 'snail-mucin-essence',
    name: 'Snail Mucin 96% Power Repairing Essence',
    brand: 'COSRX',
    category: 'Beauty',
    price: '$15.99',
    rating: 4.8,
    reviewCount: 2340,
    hasVideo: true,
    certs: ['FDA'],
    image: null,
  },
  {
    slug: 'bibigo-mandu',
    name: 'Bibigo Wang Mandu — Pork & Vegetable Dumplings',
    brand: 'CJ CheilJedang',
    category: 'Food & Health',
    price: '$8.99',
    rating: 4.6,
    reviewCount: 890,
    hasVideo: true,
    certs: ['HACCP', 'FDA'],
    image: null,
  },
  {
    slug: 'hanbok-modern-dress',
    name: 'Modern Hanbok Wrap Dress — Spring Edition',
    brand: 'K-Style Fashion',
    category: 'Fashion',
    price: '$89.00',
    rating: 4.5,
    reviewCount: 156,
    hasVideo: false,
    certs: [],
    image: null,
  },
  {
    slug: 'red-ginseng-extract',
    name: 'Korean Red Ginseng Extract 240g',
    brand: 'CheongKwanJang',
    category: 'Food & Health',
    price: '$55.00',
    rating: 4.9,
    reviewCount: 1200,
    hasVideo: true,
    certs: ['HACCP'],
    image: null,
  },
  {
    slug: 'jeju-green-tea-serum',
    name: 'Jeju Green Tea Seed Hyaluronic Serum',
    brand: 'Innisfree',
    category: 'Beauty',
    price: '$22.00',
    rating: 4.7,
    reviewCount: 780,
    hasVideo: true,
    certs: [],
    image: null,
  },
  {
    slug: 'tteokbokki-kit',
    name: 'Premium Tteokbokki Home Kit — Spicy Rose',
    brand: 'Yopokki',
    category: 'Food & Health',
    price: '$6.99',
    rating: 4.4,
    reviewCount: 456,
    hasVideo: false,
    certs: ['HACCP'],
    image: null,
  },
  {
    slug: 'bt21-plush',
    name: 'BT21 Baby Series Plush Doll 20cm',
    brand: 'LINE FRIENDS',
    category: 'K-Culture',
    price: '$24.99',
    rating: 4.8,
    reviewCount: 3400,
    hasVideo: true,
    certs: [],
    image: null,
  },
  {
    slug: 'soju-glasses-set',
    name: 'Traditional Soju Glass Set — 6 Pieces',
    brand: 'Korea Craft',
    category: 'Home',
    price: '$18.00',
    rating: 4.3,
    reviewCount: 234,
    hasVideo: false,
    certs: [],
    image: null,
  },
]

export function ProductsGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered = activeCategory === 'All'
    ? mockProducts
    : mockProducts.filter((p) => p.category === activeCategory)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-navy text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <Link key={product.slug} href={`/products/${product.slug}`}>
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="relative aspect-square bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-300">
                  {product.name[0]}
                </div>
                {product.hasVideo && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent-red flex items-center justify-center">
                    <Play className="h-3.5 w-3.5 text-white fill-white ml-0.5" />
                  </div>
                )}
                {product.certs.length > 0 && (
                  <div className="absolute top-3 left-3 flex gap-1">
                    {product.certs.map((c) => (
                      <Badge key={c} className="bg-green-500 text-white text-[10px]">{c}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500">{product.brand}</p>
                <h3 className="mt-1 text-sm font-medium text-navy line-clamp-2 group-hover:text-accent-red transition-colors">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-navy">{product.price}</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium text-navy">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
