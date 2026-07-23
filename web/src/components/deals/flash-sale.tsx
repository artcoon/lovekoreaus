'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { Clock, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getProductImage } from '@/lib/image-map'

const flashSaleItems = [
  { slug: 'snail-mucin-essence', name: 'Snail Mucin 96% Essence', brand: 'COSRX', original: '$15.99', deal: '$9.99', discount: 37 },
  { slug: 'red-ginseng-extract', name: 'Red Ginseng Extract 240g', brand: 'CheongKwanJang', original: '$55.00', deal: '$39.99', discount: 27 },
  { slug: 'bibigo-mandu', name: 'Wang Mandu Dumplings 4-Pack', brand: 'CJ CheilJedang', original: '$35.96', deal: '$24.99', discount: 30 },
]

function useCountdown(hours: number) {
  const [timeLeft, setTimeLeft] = useState(hours * 3600)
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(timer)
  }, [])
  const h = Math.floor(timeLeft / 3600)
  const m = Math.floor((timeLeft % 3600) / 60)
  const s = timeLeft % 60
  return { h, m, s }
}

export function FlashSale({ deals }: { deals?: any[] }) {
  const { h, m, s } = useCountdown(6)
  const items = deals?.length ? deals.map((d: any) => ({
    slug: d.slug || d.product_slug || '',
    name: d.name || d.name_en || d.title || '',
    brand: d.brand || '',
    original: d.original || `$${d.original_price ?? 0}`,
    deal: d.deal || `$${d.deal_price ?? 0}`,
    discount: d.discount ?? d.discount_percent ?? 0,
    image: d.image_url || getProductImage(d.slug) || getProductImage(d.product_slug) || null,
  })) : flashSaleItems.map((item) => ({ ...item, image: getProductImage(item.slug) || null }))

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-accent-red fill-accent-red" />
            <h2 className="text-2xl font-bold text-navy">Flash Sale</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">Ends in</span>
            <div className="flex gap-1">
              {[
                { val: h, label: 'h' },
                { val: m, label: 'm' },
                { val: s, label: 's' },
              ].map((t) => (
                <span key={t.label} className="bg-navy text-white text-sm font-mono font-bold px-2 py-1 rounded">
                  {String(t.val).padStart(2, '0')}{t.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link key={item.slug} href={`/products/${item.slug}`}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative">
                <Badge className="absolute top-3 left-3 bg-accent-red text-white z-10">
                  -{item.discount}%
                </Badge>
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-300 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    item.name[0]
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500">{item.brand}</p>
                  <h3 className="mt-1 text-sm font-medium text-navy group-hover:text-accent-red transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-accent-red">{item.deal}</span>
                    <span className="text-sm text-gray-400 line-through">{item.original}</span>
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
