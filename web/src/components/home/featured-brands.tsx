import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ShieldCheck } from 'lucide-react'

const BRAND_IMAGES: Record<string, string> = {
  'hana-cosmetics': '/images/brands/hana-cosmetics.jpg',
  'kimchi-world': '/images/brands/kimchi-world.jpg',
  'k-style-fashion': '/images/brands/k-style-fashion.jpg',
  'seoul-tech': '/images/brands/seoul-tech.jpg',
  'green-tea-farm': '/images/brands/green-tea-farm.jpg',
  'hallyu-goods': '/images/brands/hallyu-goods.jpg',
}

export function FeaturedBrands({ brands }: { brands?: any[] }) {
  const t = useTranslations()
  const items = brands?.length ? brands.map((b: any) => ({
    id: b.id || b.slug,
    slug: b.slug,
    name: b.company_name_en || b.company_name || b.name || 'Unknown',
    type: b.seller_type || b.type || 'Brand',
    rating: b.rating_avg ?? b.rating ?? 0,
    products: b.product_count ?? b.products ?? b.productCount ?? 0,
    verified: b.is_verified ?? b.verified ?? false,
    image: b.logo_url || b.cover_image_url || BRAND_IMAGES[b.slug] || null,
  })) : [
    { id: '1', slug: 'hana-cosmetics', name: 'Hana Cosmetics', type: 'manufacturer', rating: 4.8, products: 45, verified: true, image: '/images/brands/hana-cosmetics.jpg' },
    { id: '2', slug: 'kimchi-world', name: 'Kimchi World', type: 'brand', rating: 4.6, products: 32, verified: true, image: '/images/brands/kimchi-world.jpg' },
    { id: '3', slug: 'green-tea-farm', name: 'Green Tea Farm Jeju', type: 'manufacturer', rating: 4.7, products: 68, verified: true, image: '/images/brands/green-tea-farm.jpg' },
    { id: '4', slug: 'hallyu-goods', name: 'Hallyu Goods', type: 'distributor', rating: 4.4, products: 120, verified: false, image: '/images/brands/hallyu-goods.jpg' },
  ]

  return (
    <section className="py-16 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">
            {t('brands.title')}
          </h2>
          <Link
            href="/directory"
            className="text-sm text-navy hover:text-accent-red font-medium transition-colors"
          >
            {t('common.viewAll')} →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.slug}`}>
              <Card className="group hover:shadow-lg transition-all border-border/40 h-full overflow-hidden">
                <div className="relative h-36 overflow-hidden bg-muted">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-muted-foreground/30">{brand.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 text-white font-semibold text-lg drop-shadow-md">
                    {brand.name}
                  </h3>
                  {brand.verified && (
                    <Badge className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] gap-1">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground capitalize">{brand.type}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{brand.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {brand.products} products
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
