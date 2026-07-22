'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { Globe } from 'lucide-react'
import { locales, localeNames, type Locale } from '@/i18n/config'

export function LanguageToggle() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="h-4 w-4 text-white/60" />
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            l === locale
              ? 'bg-white/20 text-white font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          {localeNames[l]}
        </button>
      ))}
    </div>
  )
}
