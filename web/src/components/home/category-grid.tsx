import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Sparkles,
  UtensilsCrossed,
  Shirt,
  Palette,
  Briefcase,
  MapPin,
  Play,
  Tag,
} from 'lucide-react'

const categories = [
  { key: 'beauty', icon: Sparkles, href: '/products?category=beauty', color: 'bg-pink-50 text-pink-600' },
  { key: 'food', icon: UtensilsCrossed, href: '/products?category=food', color: 'bg-orange-50 text-orange-600' },
  { key: 'fashion', icon: Shirt, href: '/products?category=fashion', color: 'bg-purple-50 text-purple-600' },
  { key: 'culture', icon: Palette, href: '/products?category=culture', color: 'bg-blue-50 text-blue-600' },
  { key: 'b2b', icon: Briefcase, href: '/products?category=b2b', color: 'bg-emerald-50 text-emerald-600' },
  { key: 'directory', icon: MapPin, href: '/directory', color: 'bg-cyan-50 text-cyan-600' },
  { key: 'watch', icon: Play, href: '/watch', color: 'bg-red-50 text-red-600' },
  { key: 'deals', icon: Tag, href: '/deals', color: 'bg-amber-50 text-amber-600' },
]

export function CategoryGrid() {
  const t = useTranslations()

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy">
          {t('categories.title')}
        </h2>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/40 bg-white p-6 hover:shadow-md hover:border-navy/20 transition-all"
            >
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="h-7 w-7" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                {t(`nav.${cat.key}`)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
