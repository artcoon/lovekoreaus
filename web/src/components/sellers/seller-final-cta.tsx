'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function SellerFinalCta() {
  const t = useTranslations('sellers')

  return (
    <section className="py-20 bg-navy">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          {t('ctaTitle')}
        </h2>
        <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
          {t('ctaSubtext')}
        </p>
        <Link href="/signup?role=seller" className="mt-8 inline-block">
          <Button
            size="lg"
            className="bg-accent-red hover:bg-accent-red-dark text-white px-10 rounded-xl text-base"
          >
            {t('ctaCta')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
