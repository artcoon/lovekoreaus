import type { Metadata } from 'next'
import { Inter, Noto_Sans_KR } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { AnalyticsProvider } from '@/components/analytics/analytics-provider'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-ko',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const SITE_URL = 'https://lovekorea.us'
const SITE_NAME = 'LoveKorea.Us'
const DEFAULT_DESCRIPTION =
  "Korea's Gateway to the U.S., Japan & China — Discover verified Korean products, brands, and businesses with video reviews."

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Discover the Best of Korea`,
    template: '%s | LoveKorea.Us',
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: [
    'Korean products',
    'K-beauty',
    'K-food',
    'K-pop',
    'Korean brands',
    'Korean exporters',
    'Korean manufacturers',
    'Korean B2B',
  ],
  authors: [{ name: 'LoveKorea.Us' }],
  creator: 'LoveKorea.Us',
  publisher: 'LoveKorea.Us',
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: `${SITE_NAME} — Discover the Best of Korea`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/images/og/lovekorea-og.jpg',
        width: 1200,
        height: 630,
        alt: 'LoveKorea.Us — Discover the Best of Korea',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Discover the Best of Korea`,
    description: DEFAULT_DESCRIPTION,
    images: ['/images/og/lovekorea-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en': `${SITE_URL}/en`,
      'ko': `${SITE_URL}/ko`,
      'ja': `${SITE_URL}/ja`,
      'zh': `${SITE_URL}/zh`,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <AnalyticsProvider />
      </body>
    </html>
  )
}
