import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ImageIcon } from 'lucide-react'
import Image from 'next/image'

// Image map for mock products
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

export function FeaturedProducts({ products }: { products?: any[] }) {
  const t = useTranslations()
  const items = products?.length ? products.map((p: any) => ({
    id: p.id || p.slug,
    slug: p.slug,
    name: p.name_en || p.name || 'Product',
    brand: p.brand || p.seller_name || '',
    priceMin: p.priceMin ?? p.price_min ?? 0,
    priceMax: p.priceMax ?? p.price_max ?? 0,
    rating: p.rating_avg ?? p.rating ?? 0,
    reviewCount: p.reviewCount ?? p.review_count ?? 0,
    category: p.category || '',
    isSponsored: p.isSponsored ?? p.is_sponsored ?? false,
    image: p.image_url || PRODUCT_IMAGES[p.slug] || null,
  })) : [
    { id: '1', slug: 'snail-mucin-essence', name: 'COSRX Snail Mucin 96% Essence', brand: 'COSRX', image: '/images/products/snail-mucin-essence.jpg', priceMin: 12.99, priceMax: 15.99, rating: 4.8, reviewCount: 1240, category: 'K-Beauty', isSponsored: true },
    { id: '2', slug: 'bibigo-mandu', name: 'Bibigo Mandu Dumplings', brand: 'CJ Bibigo', image: '/images/products/bibigo-mandu.jpg', priceMin: 8.99, priceMax: 12.99, rating: 4.6, reviewCount: 890, category: 'K-Food', isSponsored: false },
    { id: '3', slug: 'jeju-green-tea-serum', name: 'Innisfree Green Tea Seed Serum', brand: 'Innisfree', image: '/images/products/jeju-green-tea-serum.jpg', priceMin: 18.0, priceMax: 22.0, rating: 4.7, reviewCount: 650, category: 'K-Beauty', isSponsored: true },
    { id: '4', slug: 'galaxy-buds3-pro', name: 'Samsung Galaxy Buds3 Pro', brand: 'Samsung', image: '/images/products/galaxy-buds3-pro.jpg', priceMin: 199.99, priceMax: 249.99, rating: 4.5, reviewCount: 2100, category: 'Electronics', isSponsored: false },
  ]

  return (
    <section className="py-16 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">
            {t('featured.title')}
          </h2>
          <Link
            href="/products"
            className="text-sm text-navy hover:text-accent-red font-medium transition-colors"
          >
            {t('common.viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all border-border/40 h-full">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8 text-gray-200" />
                    </div>
                  )}
                  {product.isSponsored && (
                    <Badge className="absolute top-2 left-2 bg-accent-red/90 text-white text-xs">
                      {t('featured.sponsored')}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <h3 className="text-sm font-medium mt-1 line-clamp-2 group-hover:text-navy transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-navy">
                    ${product.priceMin.toFixed(2)}
                    {product.priceMax > product.priceMin &&
                      ` — $${product.priceMax.toFixed(2)}`}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
