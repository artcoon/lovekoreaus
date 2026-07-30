import { useTranslations } from 'next-intl'
import { Search, ShieldCheck, Handshake } from 'lucide-react'

export function HowItWorks() {
  const t = useTranslations('howItWorks')

  const steps = [
    { icon: Search, title: t('step1Title'), desc: t('step1Desc'), num: '01' },
    { icon: ShieldCheck, title: t('step2Title'), desc: t('step2Desc'), num: '02' },
    { icon: Handshake, title: t('step3Title'), desc: t('step3Desc'), num: '03' },
  ]

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-navy via-navy to-navy-light">
      <div className="absolute inset-0 bg-[url('/images/landscapes/hanok-village-2.jpg')] bg-cover bg-center opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/85 to-navy/80" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">
          {t('title')}
        </h2>
        <p className="mt-2 text-center text-white/70 text-sm">
          Find, verify, and connect with Korean sellers in three simple steps.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${
                idx === 0 ? 'bg-pink-100 text-pink-600' :
                idx === 1 ? 'bg-emerald-100 text-emerald-600' :
                'bg-amber-100 text-amber-600'
              }`}>
                <step.icon className="h-7 w-7" />
              </div>
              <span className="absolute top-4 right-4 text-4xl font-bold text-navy/5">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
