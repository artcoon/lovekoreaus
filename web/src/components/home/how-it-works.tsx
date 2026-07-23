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
    <section className="relative py-16 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/images/products/snail-mucin-essence.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/75 to-white/60" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-navy">
          {t('title')}
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-sm border border-border/40 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-navy/5 mb-4">
                <step.icon className="h-7 w-7 text-navy" />
              </div>
              <span className="absolute top-4 right-4 text-4xl font-bold text-navy/5">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
