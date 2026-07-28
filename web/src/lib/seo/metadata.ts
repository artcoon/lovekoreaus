import type { Metadata } from 'next'

const SITE_URL = 'https://lovekorea.us'

export function createMetadata({
  title,
  description,
  path,
  image = '/images/og/lovekorea-og.jpg',
  locale = 'en',
  noIndex = false,
}: {
  title: string
  description: string
  path: string
  image?: string
  locale?: string
  noIndex?: boolean
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en': `${SITE_URL}/en${path}`,
        'ko': `${SITE_URL}/ko${path}`,
        'ja': `${SITE_URL}/ja${path}`,
        'zh': `${SITE_URL}/zh${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      locale: locale === 'ko' ? 'ko_KR' : locale === 'ja' ? 'ja_JP' : locale === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}
