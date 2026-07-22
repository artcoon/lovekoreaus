import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const footerCategories = [
  { key: 'beauty', href: '/products?category=beauty' },
  { key: 'food', href: '/products?category=food' },
  { key: 'fashion', href: '/products?category=fashion' },
  { key: 'culture', href: '/products?category=culture' },
  { key: 'b2b', href: '/products?category=b2b' },
] as const

const footerLinks = [
  { key: 'about', href: '/about' },
  { key: 'terms', href: '/terms' },
  { key: 'privacy', href: '/privacy' },
  { key: 'faq', href: '/faq' },
  { key: 'contact', href: '/contact' },
] as const

export function GlobalFooter() {
  const t = useTranslations()

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              Love<span className="text-accent-red">Korea</span>.Us
            </Link>
            <p className="mt-3 text-sm text-white/60">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white/80">
              {t('categories.title')}
            </h3>
            <ul className="space-y-2">
              {footerCategories.map((cat) => (
                <li key={cat.key}>
                  <Link
                    href={cat.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {t(`nav.${cat.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white/80">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/directory"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t('nav.directory')}
                </Link>
              </li>
              <li>
                <Link
                  href="/watch"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t('nav.watch')}
                </Link>
              </li>
              <li>
                <Link
                  href="/sellers"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t('nav.forSellers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white/80">
              {t('footer.about')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {t(`footer.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com/@lovekorea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://instagram.com/lovekorea.us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
