'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface PlanProps {
  name: string
  price: string | null
  desc: string
  features: string[]
  cta: string
  highlighted?: boolean
  badge?: string
}

function PlanCard({ name, price, desc, features, cta, highlighted, badge }: PlanProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col ${
        highlighted
          ? 'bg-navy text-white shadow-xl ring-2 ring-accent-red scale-[1.02]'
          : 'bg-white text-navy shadow-sm border border-gray-100'
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-red text-white text-xs font-bold px-4 py-1 rounded-full">
          {badge}
        </div>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="mt-4">
        {price ? (
          <span className="text-3xl font-bold">{price}</span>
        ) : (
          <span className="text-3xl font-bold">$0</span>
        )}
      </div>
      <p className={`mt-2 text-sm ${highlighted ? 'text-white/60' : 'text-gray-500'}`}>
        {desc}
      </p>
      <ul className="mt-6 space-y-3 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className={`h-4 w-4 mt-0.5 shrink-0 ${highlighted ? 'text-accent-red' : 'text-green-500'}`} />
            <span className={highlighted ? 'text-white/80' : 'text-gray-600'}>{f}</span>
          </li>
        ))}
      </ul>
      <Link href="/signup?role=seller" className="mt-8">
        <Button
          className={`w-full rounded-xl ${
            highlighted
              ? 'bg-accent-red hover:bg-accent-red-dark text-white'
              : 'bg-navy hover:bg-navy-light text-white'
          }`}
          size="lg"
        >
          {cta}
        </Button>
      </Link>
    </div>
  )
}

export function SellerPricing() {
  const t = useTranslations('sellers')

  const plans: PlanProps[] = [
    {
      name: t('freePlan'),
      price: null,
      desc: t('freePlanDesc'),
      features: [t('freeFeature1'), t('freeFeature2'), t('freeFeature3'), t('freeFeature4')],
      cta: t('selectPlan'),
    },
    {
      name: t('proPlan'),
      price: t('proPlanPrice'),
      desc: t('proPlanDesc'),
      features: [
        t('proFeature1'), t('proFeature2'), t('proFeature3'),
        t('proFeature4'), t('proFeature5'), t('proFeature6'),
      ],
      cta: t('selectPlan'),
      highlighted: true,
      badge: t('recommended'),
    },
    {
      name: t('premiumPlan'),
      price: t('premiumPlanPrice'),
      desc: t('premiumPlanDesc'),
      features: [
        t('premiumFeature1'), t('premiumFeature2'), t('premiumFeature3'),
        t('premiumFeature4'), t('premiumFeature5'),
      ],
      cta: t('selectPlan'),
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center">
          {t('pricingTitle')}
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
