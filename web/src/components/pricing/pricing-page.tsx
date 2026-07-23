'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Loader2, Star, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function PricingPage() {
  const t = useTranslations('sellers')
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: string) => {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Stripe not configured yet. Set STRIPE_SECRET_KEY and price IDs.')
      }
    } catch {
      alert('Something went wrong.')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      key: 'free',
      icon: Star,
      name: t('freePlan'),
      price: '$0',
      desc: t('freePlanDesc'),
      features: [t('freeFeature1'), t('freeFeature2'), t('freeFeature3'), t('freeFeature4')],
      color: 'border-gray-200',
      btnVariant: 'outline' as const,
    },
    {
      key: 'pro',
      icon: Zap,
      name: t('proPlan'),
      price: t('proPlanPrice'),
      desc: t('proPlanDesc'),
      features: [t('proFeature1'), t('proFeature2'), t('proFeature3'), t('proFeature4'), t('proFeature5'), t('proFeature6')],
      color: 'border-accent-red',
      recommended: true,
      btnVariant: 'default' as const,
    },
    {
      key: 'premium',
      icon: Crown,
      name: t('premiumPlan'),
      price: t('premiumPlanPrice'),
      desc: t('premiumPlanDesc'),
      features: [t('premiumFeature1'), t('premiumFeature2'), t('premiumFeature3'), t('premiumFeature4'), t('premiumFeature5')],
      color: 'border-navy',
      btnVariant: 'default' as const,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-navy">{t('pricingTitle')}</h1>
        <p className="mt-3 text-gray-500">Choose the right plan for your business</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.key} className={`relative bg-white rounded-2xl border-2 ${plan.color} p-8 flex flex-col ${plan.recommended ? 'shadow-lg scale-105' : ''}`}>
            {plan.recommended && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-red text-white px-3 py-1">{t('recommended')}</Badge>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.recommended ? 'bg-accent-red text-white' : plan.key === 'premium' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'}`}>
                <plan.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">{plan.name}</h3>
                <p className="text-xs text-gray-400">{plan.desc}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-navy">{plan.price}</span>
              {plan.key !== 'free' && <span className="text-sm text-gray-400">/mo</span>}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {plan.key === 'free' ? (
              <Button variant="outline" className="w-full rounded-xl" disabled>
                {t('currentPlan')}
              </Button>
            ) : (
              <Button
                onClick={() => handleUpgrade(plan.key)}
                disabled={loading === plan.key}
                className={`w-full rounded-xl ${plan.recommended ? 'bg-accent-red hover:bg-accent-red-dark text-white' : 'bg-navy hover:bg-navy-light text-white'}`}
              >
                {loading === plan.key ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t('selectPlan')}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
