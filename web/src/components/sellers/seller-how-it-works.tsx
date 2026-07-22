'use client'

import { useTranslations } from 'next-intl'
import { UserPlus, Package, MessageSquare, TrendingUp } from 'lucide-react'

export function SellerHowItWorks() {
  const t = useTranslations('sellers')

  const steps = [
    { icon: UserPlus, num: '01', title: t('howStep1Title'), desc: t('howStep1Desc') },
    { icon: Package, num: '02', title: t('howStep2Title'), desc: t('howStep2Desc') },
    { icon: MessageSquare, num: '03', title: t('howStep3Title'), desc: t('howStep3Desc') },
    { icon: TrendingUp, num: '04', title: t('howStep4Title'), desc: t('howStep4Desc') },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center">
          {t('howTitle')}
        </h2>

        <div className="mt-16 grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
              )}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-navy/5 mb-6">
                <step.icon className="h-8 w-8 text-navy" />
              </div>
              <div className="text-xs font-bold text-accent-red mb-2">{step.num}</div>
              <h3 className="text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
