import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { Link } from '@/i18n/navigation'
import { Sparkles, UtensilsCrossed, Shirt, Music, Heart, Gift, Amphora } from 'lucide-react'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Browse Categories — K-Beauty, K-Food, K-Fashion & More',
  description: 'Explore verified Korean products and brands by category.',
  path: '/categories',
})

const categories = [
  { key: 'beauty', href: '/categories/k-beauty', label: 'K-Beauty & Skincare', icon: Sparkles, image: '/images/landscapes/hanok-village-1.jpg' },
  { key: 'food', href: '/categories/k-food', label: 'K-Food & Beverage', icon: UtensilsCrossed, image: '/images/landscapes/hanok-village-2.jpg' },
  { key: 'fashion', href: '/categories/k-fashion', label: 'K-Fashion & Apparel', icon: Shirt, image: '/images/landscapes/hanok-village-3.jpg' },
  { key: 'kpop', href: '/categories/k-pop', label: 'K-Pop & Entertainment', icon: Music, image: '/images/landscapes/hanok-village-4.jpg' },
  { key: 'health', href: '/categories/k-health', label: 'K-Health & Wellness', icon: Heart, image: '/images/landscapes/hanok-village-5.jpg' },
  { key: 'stationery', href: '/categories/k-stationery', label: 'K-Stationery & Gifts', icon: Gift, image: '/images/landscapes/hanok-village-6.jpg' },
  { key: 'kculture', href: '/categories/k-culture', label: 'K-Culture & Heritage', icon: Amphora, image: '/images/landscapes/hanok-village-9.jpg' },
]

export default function CategoriesPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-navy">Browse Categories</h1>
            <p className="mt-2 text-gray-500">Discover Korean products and brands across every category.</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="group relative overflow-hidden rounded-2xl border border-border/40 bg-white p-6 shadow-sm hover:shadow-lg transition-all"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white shadow-md">
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-semibold text-navy">{cat.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </>
  )
}
