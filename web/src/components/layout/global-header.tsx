'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search, Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageToggle } from './language-toggle'
import { SearchBar } from '@/components/search/search-bar'

const categories = [
  { key: 'beauty', href: '/products?category=beauty' },
  { key: 'food', href: '/products?category=food' },
  { key: 'fashion', href: '/products?category=fashion' },
  { key: 'culture', href: '/products?category=culture' },
  { key: 'b2b', href: '/products?category=b2b' },
  { key: 'directory', href: '/directory' },
  { key: 'watch', href: '/watch' },
  { key: 'deals', href: '/deals' },
] as const

export function GlobalHeader() {
  const t = useTranslations('nav')
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-navy text-white">
      {/* Top bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            Love<span className="text-accent-red">Korea</span>.Us
          </span>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <SearchBar variant="header" />
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <Link href="/sellers">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              {t('forSellers')}
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="sm"
              className="bg-accent-red hover:bg-accent-red-dark text-white"
            >
              {t('login')}
            </Button>
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <Sheet>
            <SheetTrigger className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-navy text-white border-navy-light">
              <nav className="flex flex-col gap-1 mt-8">
                {categories.map((cat) => (
                  <Link
                    key={cat.key}
                    href={cat.href}
                    className="px-4 py-3 text-sm hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {t(cat.key)}
                  </Link>
                ))}
                <div className="my-4 border-t border-white/10" />
                <Link
                  href="/sellers"
                  className="px-4 py-3 text-sm font-medium text-accent-red hover:bg-white/10 rounded-lg"
                >
                  {t('forSellers')}
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-3 text-sm hover:bg-white/10 rounded-lg"
                >
                  {t('login')}
                </Link>
                <div className="px-4 py-3">
                  <LanguageToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Category nav (desktop) */}
      <nav className="hidden md:block border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8 overflow-x-auto">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className="whitespace-nowrap px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              {t(cat.key)}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile search (expandable) */}
      {searchOpen && (
        <div className="md:hidden border-t border-white/10 p-3">
          <SearchBar variant="header" />
        </div>
      )}
    </header>
  )
}
