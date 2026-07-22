'use client'

import { useTranslations } from 'next-intl'
import { Globe, Play, ShieldCheck, Mail, Languages, Building } from 'lucide-react'

export function SellerBenefits() {
  const t = useTranslations('sellers')

  const benefits = [
    { icon: Globe, title: t('benefit1Title'), desc: t('benefit1Desc') },
    { icon: Play, title: t('benefit2Title'), desc: t('benefit2Desc') },
    { icon: ShieldCheck, title: t('benefit3Title'), desc: t('benefit3Desc') },
    { icon: Mail, title: t('benefit4Title'), desc: t('benefit4Desc') },
    { icon: Languages, title: t('benefit5Title'), desc: t('benefit5Desc') },
    { icon: Building, title: t('benefit6Title'), desc: t('benefit6Desc') },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-navy text-center">
          {t('benefitsTitle')}
        </h2>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-red/10">
                <b.icon className="h-6 w-6 text-accent-red" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-navy">{b.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
