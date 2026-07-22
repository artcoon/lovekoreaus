'use client'

import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { Star, Sparkles } from 'lucide-react'

const sponsoredProducts = [
  { slug: 'jeju-green-tea-serum', name: 'Jeju Green Tea Seed Serum', brand: 'Innisfree', price: '$22.00', rating: 4.7 },
  { slug: 'centella-toner', name: 'Centella Calming Toner', brand: 'Hana Cosmetics', price: '$18.50', rating: 4.6 },
  { slug: 'tteokbokki-kit', name: 'Tteokbokki Home Kit — Spicy Rose', brand: 'Yopokki', price: '$6.99', rating: 4.4 },
  { slug: 'bt21-plush', name: 'BT21 Baby Plush Doll 20cm', brand: 'LINE FRIENDS', price: '$24.99', rating: 4.8 },
  { slug: 'soju-glasses-set', name: 'Traditional Soju Glass Set', brand: 'Korea Craft', price: '$18.00', rating: 4.3 },
  { slug: 'hanbok-modern-dress', name: 'Modern Hanbok Wrap Dress', brand: 'K-Style Fashion', price: '$89.00', rating: 4.5 },
]

export function DealsGrid() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-6 w-6 text-navy" />
          <h2 className="text-2xl font-bold text-navy">Sponsored Products</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsoredProducts.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-300">
                  {p.name[0]}
                  <Badge className="absolute top-3 right-3 bg-navy/80 text-white text-[10px]">Sponsored</Badge>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500">{p.brand}</p>
                  <h3 className="mt-1 text-sm font-medium text-navy group-hover:text-accent-red transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-navy">{p.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-medium text-navy">{p.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
