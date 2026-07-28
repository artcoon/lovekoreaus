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
    <section className="relative py-20 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/images/products/bibigo-mandu.jpg')" }}
      />
      <div className="absolute inset-0 bg-navy/30" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-white drop-shadow-md">
          {t('title')}
        </h2>
        <p className="mt-2 text-center text-white/80 text-sm drop-shadow">
          Find, verify, and connect with Korean sellers in three simple steps.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/90 mb-4 shadow-lg">
                <step.icon className="h-7 w-7 text-navy" />
              </div>
              <span className="absolute top-4 right-4 text-4xl font-bold text-white/30">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold text-white drop-shadow-md">{step.title}</h3>
              <p className="mt-2 text-sm text-white drop-shadow-md leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
