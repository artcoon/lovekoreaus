'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { SearchBar } from '@/components/search/search-bar'

export function HeroSection() {
  const t = useTranslations('hero')
  const nav = useTranslations('nav')

  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/brands/hana-cosmetics.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,32,47,0.2),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            {t('headline')}
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">
            {t('subtext')}
          </p>

          {/* Search bar */}
          <div className="mt-8 relative max-w-lg">
            <SearchBar variant="hero" />
          </div>

          {/* Market selector */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-white/50">Markets:</span>
            {['US', 'JP', 'CN', 'Global'].map((market) => (
              <button
                key={market}
                className="px-4 py-1.5 text-sm rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                {market === 'US' ? '🇺🇸 USA' : market === 'JP' ? '🇯🇵 Japan' : market === 'CN' ? '🇨🇳 China' : '🌍 Global'}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-accent-red hover:bg-accent-red-dark text-white px-8 rounded-xl">
                {t('cta')}
              </Button>
            </Link>
            <Link href="/sellers">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white px-8 rounded-xl"
              >
                {t('ctaSeller')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
