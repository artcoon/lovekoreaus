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

const CATEGORY_IMAGES: Record<string, string> = {
  beauty: '/images/products/snail-mucin-essence.jpg',
  food: '/images/products/bibigo-mandu.jpg',
  fashion: '/images/products/hanbok-modern-dress.jpg',
  kpop: '/images/products/bt21-plush.jpg',
  health: '/images/products/red-ginseng-extract.jpg',
  tech: '/images/products/galaxy-buds3-pro.jpg',
  home: '/images/products/locknlock-container-set.jpg',
  stationery: '/images/products/monami-pluspen-36.jpg',
  baby: '/images/products/goongbe-baby-lotion.jpg',
  pets: '/images/products/bowwow-dental-chew.jpg',
  traditional: '/images/products/celadon-tea-cup-set.jpg',
  automotive: '/images/products/ceramic-car-coating.jpg',
}

const categories = [
  { key: 'beauty', icon: Sparkles, href: '/products?category=beauty', color: 'bg-pink-50 text-pink-600', label: 'K-Beauty & Skincare' },
  { key: 'food', icon: UtensilsCrossed, href: '/products?category=food', color: 'bg-orange-50 text-orange-600', label: 'K-Food & Beverage' },
  { key: 'fashion', icon: Shirt, href: '/products?category=fashion', color: 'bg-purple-50 text-purple-600', label: 'K-Fashion & Apparel' },
  { key: 'kpop', icon: Music, href: '/products?category=kpop', color: 'bg-blue-50 text-blue-600', label: 'K-Pop & Entertainment' },
  { key: 'health', icon: Heart, href: '/products?category=health', color: 'bg-emerald-50 text-emerald-600', label: 'K-Health & Wellness' },
  { key: 'tech', icon: Cpu, href: '/products?category=tech', color: 'bg-cyan-50 text-cyan-600', label: 'K-Technology' },
  { key: 'home', icon: Home, href: '/products?category=home', color: 'bg-amber-50 text-amber-600', label: 'K-Home & Living' },
  { key: 'stationery', icon: Gift, href: '/products?category=stationery', color: 'bg-violet-50 text-violet-600', label: 'K-Stationery & Gifts' },
  { key: 'baby', icon: Baby, href: '/products?category=baby', color: 'bg-rose-50 text-rose-600', label: 'K-Baby & Kids' },
  { key: 'pets', icon: PawPrint, href: '/products?category=pets', color: 'bg-lime-50 text-lime-600', label: 'K-Pets' },
  { key: 'traditional', icon: Amphora, href: '/products?category=traditional', color: 'bg-teal-50 text-teal-600', label: 'K-Traditional & Artisan' },
  { key: 'automotive', icon: Car, href: '/products?category=automotive', color: 'bg-slate-50 text-slate-600', label: 'K-Automotive & Industrial' },
]

export function CategoryGrid() {
  const t = useTranslations()

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy">
          {t('categories.title')}
        </h2>
        <p className="mt-2 text-gray-500 text-sm">Browse products across 12 categories</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="group relative overflow-hidden flex flex-col items-center gap-3 rounded-xl border border-border/40 bg-white p-5 hover:shadow-md hover:border-navy/20 transition-all"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                style={{ backgroundImage: `url('${CATEGORY_IMAGES[cat.key]}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 group-hover:from-white/70 group-hover:to-white/50 transition-colors" />
              <div
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}
              >
                <cat.icon className="h-6 w-6" />
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
