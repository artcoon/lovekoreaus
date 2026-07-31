import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Sparkles,
  UtensilsCrossed,
  Shirt,
  Music,
  Heart,
  Gift,
  Amphora,
} from 'lucide-react'

const CATEGORY_IMAGES: Record<string, string> = {
  beauty: '/images/landscapes/hanok-village-1.jpg',
  food: '/images/landscapes/hanok-village-2.jpg',
  fashion: '/images/landscapes/hanok-village-3.jpg',
  kpop: '/images/landscapes/hanok-village-4.jpg',
  health: '/images/landscapes/hanok-village-5.jpg',
  stationery: '/images/landscapes/hanok-village-6.jpg',
  traditional: '/images/landscapes/hanok-village-9.jpg',
}

const categories = [
  { key: 'beauty', icon: Sparkles, href: '/categories/k-beauty', color: 'bg-pink-200 text-pink-800 shadow-sm shadow-pink-300/50', label: 'K-Beauty & Skincare' },
  { key: 'food', icon: UtensilsCrossed, href: '/categories/k-food', color: 'bg-orange-200 text-orange-800 shadow-sm shadow-orange-300/50', label: 'K-Food & Beverage' },
  { key: 'fashion', icon: Shirt, href: '/categories/k-fashion', color: 'bg-purple-200 text-purple-800 shadow-sm shadow-purple-300/50', label: 'K-Fashion & Apparel' },
  { key: 'kpop', icon: Music, href: '/categories/k-pop', color: 'bg-blue-200 text-blue-800 shadow-sm shadow-blue-300/50', label: 'K-Pop & Entertainment' },
  { key: 'health', icon: Heart, href: '/categories/k-health', color: 'bg-emerald-200 text-emerald-800 shadow-sm shadow-emerald-300/50', label: 'K-Health & Wellness' },
  { key: 'stationery', icon: Gift, href: '/categories/k-stationery', color: 'bg-violet-200 text-violet-800 shadow-sm shadow-violet-300/50', label: 'K-Stationery & Gifts' },
  { key: 'traditional', icon: Amphora, href: '/categories/k-culture', color: 'bg-teal-200 text-teal-800 shadow-sm shadow-teal-300/50', label: 'K-Culture & Heritage' },
]

export function CategoryGrid() {
  const t = useTranslations()

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy">
          {t('categories.title')}
        </h2>
        <p className="mt-2 text-gray-500 text-sm">Browse products across 7 categories</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group relative overflow-hidden flex flex-col items-center gap-3 rounded-xl border border-border/40 bg-white p-5 hover:shadow-md hover:border-navy/20 transition-all"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75 group-hover:opacity-90 transition-opacity duration-500"
                style={{ backgroundImage: `url('${CATEGORY_IMAGES[cat.key]}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/45 to-white/25 group-hover:from-white/60 group-hover:via-white/35 group-hover:to-white/20 transition-colors" />
              <div
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-xl ${cat.color} group-hover:scale-110 transition-transform shadow-sm`}
              >
                <cat.icon className="h-6 w-6" strokeWidth={2.25} />
              </div>
              <span className="relative z-10 text-xs font-medium text-foreground text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
