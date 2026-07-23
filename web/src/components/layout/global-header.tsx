'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search, Menu, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageToggle } from './language-toggle'
import { SearchBar } from '@/components/search/search-bar'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'

const categories = [
  { key: 'beauty', href: '/products?category=beauty', label: 'Beauty' },
  { key: 'food', href: '/products?category=food', label: 'Food' },
  { key: 'fashion', href: '/products?category=fashion', label: 'Fashion' },
  { key: 'kpop', href: '/products?category=kpop', label: 'K-Pop' },
  { key: 'health', href: '/products?category=health', label: 'Health' },
  { key: 'tech', href: '/products?category=tech', label: 'Tech' },
  { key: 'home', href: '/products?category=home', label: 'Home' },
  { key: 'directory', href: '/directory', label: 'Directory' },
  { key: 'watch', href: '/watch', label: 'Watch' },
  { key: 'deals', href: '/deals', label: 'Deals' },
] as const

export function GlobalHeader() {
  const t = useTranslations('nav')
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) return
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

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
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-accent-red flex items-center justify-center text-xs font-bold">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm max-w-[120px] truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[60]">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.user_metadata?.role || 'buyer'}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                    <User className="h-4 w-4 text-gray-400" /> Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-accent-red hover:bg-accent-red-dark text-white">
                {t('login')}
              </Button>
            </Link>
          )}
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
                {user && (
                  <div className="px-4 py-3 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-accent-red flex items-center justify-center text-sm font-bold">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                        <p className="text-xs text-white/50">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}
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
                <Link href="/sellers" className="px-4 py-3 text-sm font-medium text-accent-red hover:bg-white/10 rounded-lg">
                  {t('forSellers')}
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" className="px-4 py-3 text-sm hover:bg-white/10 rounded-lg">Dashboard</Link>
                    <button onClick={handleSignOut} className="px-4 py-3 text-sm text-left text-red-400 hover:bg-white/10 rounded-lg">Sign Out</button>
                  </>
                ) : (
                  <Link href="/login" className="px-4 py-3 text-sm hover:bg-white/10 rounded-lg">{t('login')}</Link>
                )}
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
