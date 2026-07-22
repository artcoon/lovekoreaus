import { useTranslations } from 'next-intl'
import { Building2, Globe, Video } from 'lucide-react'

export function TrustBar() {
  const t = useTranslations('trust')

  const stats = [
    { value: '2,500+', label: t('sellers'), icon: Building2 },
    { value: '15+', label: t('countries'), icon: Globe },
    { value: '2,000+', label: t('videos'), icon: Video },
  ]

  return (
    <section className="bg-white border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="h-5 w-5 text-navy mb-1 hidden sm:block" />
              <span className="text-2xl sm:text-3xl font-bold text-navy">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
