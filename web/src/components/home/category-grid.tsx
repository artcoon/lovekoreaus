import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  Sparkles,
  UtensilsCrossed,
  Shirt,
  Music,
  Heart,
  Cpu,
  Home,
  Gift,
  Baby,
  PawPrint,
  Amphora,
  Car,
} from 'lucide-react'

const categories = [
  { key: 'beauty', icon: Sparkles, href: '/products?category=beauty', color: 'bg-pink-50 text-pink-600', label: 'Beauty & Skincare' },
  { key: 'food', icon: UtensilsCrossed, href: '/products?category=food', color: 'bg-orange-50 text-orange-600', label: 'Food & Beverage' },
  { key: 'fashion', icon: Shirt, href: '/products?category=fashion', color: 'bg-purple-50 text-purple-600', label: 'Fashion & Apparel' },
  { key: 'kpop', icon: Music, href: '/products?category=kpop', color: 'bg-blue-50 text-blue-600', label: 'K-Pop & Entertainment' },
  { key: 'health', icon: Heart, href: '/products?category=health', color: 'bg-emerald-50 text-emerald-600', label: 'Health & Wellness' },
  { key: 'tech', icon: Cpu, href: '/products?category=tech', color: 'bg-cyan-50 text-cyan-600', label: 'Technology' },
  { key: 'home', icon: Home, href: '/products?category=home', color: 'bg-amber-50 text-amber-600', label: 'Home & Living' },
  { key: 'stationery', icon: Gift, href: '/products?category=stationery', color: 'bg-violet-50 text-violet-600', label: 'Stationery & Gifts' },
  { key: 'baby', icon: Baby, href: '/products?category=baby', color: 'bg-rose-50 text-rose-600', label: 'Baby & Kids' },
  { key: 'pets', icon: PawPrint, href: '/products?category=pets', color: 'bg-lime-50 text-lime-600', label: 'Pets' },
  { key: 'traditional', icon: Amphora, href: '/products?category=traditional', color: 'bg-teal-50 text-teal-600', label: 'Traditional & Artisan' },
  { key: 'automotive', icon: Car, href: '/products?category=automotive', color: 'bg-slate-50 text-slate-600', label: 'Automotive & Industrial' },
]

export function CategoryGrid() {
  const t = useTranslations()

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy">
          {t('categories.title')}
        </h2>
        <p className="mt-2 text-gray-500 text-sm">Browse products across 12 categories</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border/40 bg-white p-5 hover:shadow-md hover:border-navy/20 transition-all"
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
