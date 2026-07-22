import type { MetadataRoute } from 'next'

const BASE_URL = 'https://lovekorea.us'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/sellers',
    '/directory',
    '/watch',
    '/products',
    '/deals',
    '/login',
    '/signup',
  ]

  const locales = ['en', 'ko']

  const entries: MetadataRoute.Sitemap = []

  for (const page of staticPages) {
    for (const locale of locales) {
      const url = locale === 'en' ? `${BASE_URL}${page}` : `${BASE_URL}/${locale}${page}`
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      })
    }
  }

  // In production, dynamically add product/brand pages from DB
  // const products = await getProducts()
  // products.forEach(p => entries.push({ url: `${BASE_URL}/products/${p.slug}`, ... }))

  return entries
}
