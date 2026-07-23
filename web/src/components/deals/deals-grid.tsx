'use client'

import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'
import { Star, Sparkles, ImageIcon } from 'lucide-react'

const PRODUCT_IMAGES: Record<string, string> = {
  'snail-mucin-essence': '/images/products/snail-mucin-essence.jpg',
  'bibigo-mandu': '/images/products/bibigo-mandu.jpg',
  'jeju-green-tea-serum': '/images/products/jeju-green-tea-serum.jpg',
  'galaxy-buds3-pro': '/images/products/galaxy-buds3-pro.jpg',
  'hanbok-modern-dress': '/images/products/hanbok-modern-dress.jpg',
  'red-ginseng-extract': '/images/products/red-ginseng-extract.jpg',
  'tteokbokki-kit': '/images/products/tteokbokki-kit.jpg',
  'bt21-plush': '/images/products/bt21-plush.jpg',
  'soju-glasses-set': '/images/products/soju-glasses-set.jpg',
  'vitamin-c-megadose': '/images/products/vitamin-c-megadose.jpg',
  'locknlock-container-set': '/images/products/locknlock-container-set.jpg',
  'monami-pluspen-36': '/images/products/monami-pluspen-36.jpg',
  'goongbe-baby-lotion': '/images/products/goongbe-baby-lotion.jpg',
  'bowwow-dental-chew': '/images/products/bowwow-dental-chew.jpg',
  'celadon-tea-cup-set': '/images/products/celadon-tea-cup-set.jpg',
  'ceramic-car-coating': '/images/products/ceramic-car-coating.jpg',
  'mediheal-nmf-mask': '/images/products/mediheal-nmf-mask.jpg',
  'shin-ramyun-black': '/images/products/shin-ramyun-black.jpg',
}

const sponsoredProducts = [
  { slug: 'jeju-green-tea-serum', name: 'Jeju Green Tea Seed Serum', brand: 'Innisfree', price: '$22.00', rating: 4.7, discount: '15% OFF' },
  { slug: 'mediheal-nmf-mask', name: 'Mediheal N.M.F Aquaring Mask', brand: 'Mediheal', price: '$12.99', rating: 4.6, discount: '20% OFF' },
  { slug: 'tteokbokki-kit', name: 'Tteokbokki Home Kit — Spicy Rose', brand: 'Yopokki', price: '$6.99', rating: 4.4, discount: 'Buy 2 Get 1' },
  { slug: 'bt21-plush', name: 'BT21 Baby Plush Doll 20cm', brand: 'LINE FRIENDS', price: '$24.99', rating: 4.8, discount: '10% OFF' },
  { slug: 'soju-glasses-set', name: 'Traditional Soju Glass Set', brand: 'Korea Craft', price: '$18.00', rating: 4.3, discount: 'Free Shipping' },
  { slug: 'hanbok-modern-dress', name: 'Modern Hanbok Wrap Dress', brand: 'K-Style Fashion', price: '$89.00', rating: 4.5, discount: '25% OFF' },
]

export function DealsGrid({ products }: { products?: any[] }) {
  const items = products?.length ? products.map((p: any) => ({
    slug: p.slug || '',
    name: p.name || '',
    brand: p.brand || p.seller_name || '',
    price: p.price || `$${p.price_min ?? 0}`,
    rating: p.rating ?? 0,
    discount: p.discount || '',
    image: p.image_url || PRODUCT_IMAGES[p.slug] || null,
  })) : sponsoredProducts.map(p => ({ ...p, image: PRODUCT_IMAGES[p.slug] || null }))

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-6 w-6 text-navy" />
          <h2 className="text-2xl font-bold text-navy">Sponsored Products</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-gray-200" />
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-accent-red text-white text-[10px]">
                    {p.discount || 'Deal'}
                  </Badge>
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
