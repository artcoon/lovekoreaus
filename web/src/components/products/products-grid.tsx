'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Star, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const categories = ['All', 'Beauty', 'Food & Health', 'Fashion', 'K-Culture', 'Tech', 'Home']

interface ProductItem {
  slug: string
  name_en: string
  brand: string
  price_min: number | null
  rating_avg: number
  review_count: number
  hasVideo: boolean
  certs: string[]
}

export function ProductsGrid({ products }: { products: ProductItem[] }) {
  const [activeCategory, setActiveCategory] = useState('All')

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
        {products.map((product) => (
          <Link key={product.slug} href={`/products/${product.slug}`}>
            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="relative aspect-square bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-300">
                  {product.name_en[0]}
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
                  {product.name_en}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-navy">
                    {product.price_min ? `$${product.price_min.toFixed(2)}` : 'Contact'}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium text-navy">{product.rating_avg}</span>
                  <span className="text-xs text-gray-400">({product.review_count})</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
