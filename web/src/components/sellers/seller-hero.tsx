'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Globe, Eye } from 'lucide-react'

export function SellerHero() {
  const t = useTranslations('sellers')

  const stats = [
    { icon: Users, value: '10,000+', label: t('stat1') },
    { icon: Globe, value: '50+', label: t('stat2') },
    { icon: Eye, value: '500K+', label: t('stat3') },
  ]

  return (
    <section className="relative bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,32,47,0.2),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-red/10 border border-accent-red/30 px-4 py-1.5 text-sm text-accent-red font-medium mb-6">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-red animate-pulse" />
            For Korean Businesses
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
            {t('heroSubtext')}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup?role=seller">
              <Button size="lg" className="bg-accent-red hover:bg-accent-red-dark text-white px-8 rounded-xl text-base">
                {t('heroCta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white px-8 rounded-xl text-base"
              >
                {t('heroCtaLogin')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-6 w-6 text-accent-red mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
