import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Globe, Video, Users } from 'lucide-react'

export function SellerCta() {
  const t = useTranslations('sellerCta')

  const benefits = [
    { icon: Globe, text: t('benefit1') },
    { icon: Video, text: t('benefit2') },
    { icon: Users, text: t('benefit3') },
  ]

  return (
    <section className="bg-gradient-to-r from-accent-red to-accent-red-dark py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {t('headline')}
            </h2>
            <p className="mt-3 text-white/80 max-w-lg">
              {t('subtext')}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-white/90">
                  <b.icon className="h-4 w-4" />
                  <span className="text-sm">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/sellers">
            <Button
              size="lg"
              className="bg-white text-accent-red hover:bg-white/90 font-semibold px-10 rounded-xl shadow-lg"
            >
              {t('cta')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
