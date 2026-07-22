import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, ShieldCheck } from 'lucide-react'

const mockBrands = [
  { id: '1', slug: 'cosrx', name: 'COSRX', type: 'Brand', rating: 4.8, products: 45, verified: true },
  { id: '2', slug: 'cj-bibigo', name: 'CJ Bibigo', type: 'Brand', rating: 4.6, products: 32, verified: true },
  { id: '3', slug: 'innisfree', name: 'Innisfree', type: 'Brand', rating: 4.7, products: 68, verified: true },
  { id: '4', slug: 'samsung', name: 'Samsung', type: 'Manufacturer', rating: 4.5, products: 120, verified: true },
]

export function FeaturedBrands() {
  const t = useTranslations()

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
          {mockBrands.map((brand) => (
            <Link key={brand.id} href={`/brands/${brand.slug}`}>
              <Card className="group hover:shadow-lg transition-all border-border/40 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-navy/5 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-navy">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold group-hover:text-navy transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{brand.type}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{brand.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {brand.products} products
                  </p>
                  {brand.verified && (
                    <Badge
                      variant="secondary"
                      className="mt-3 gap-1 text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {t('brands.verified')}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
