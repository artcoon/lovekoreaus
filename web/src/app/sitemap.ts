import type { MetadataRoute } from 'next'
import { getProducts, getSellers, getCategories } from '@/lib/queries'

const SITE_URL = 'https://lovekorea.us'
const LOCALES = ['en', 'ko', 'ja', 'zh']

const STATIC_PATHS = [
  '',
  '/products',
  '/directory',
  '/k-contents',
  '/sellers',
  '/sale',
  '/about',
  '/contact',
  '/faq',
  '/terms',
  '/privacy',
  '/login',
  '/signup',
  '/seller-onboarding',
  '/search',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages for all locales
  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.7,
      })
    }
  }

  // Categories
  try {
    const categories = await getCategories()
    for (const locale of LOCALES) {
      for (const category of categories) {
        const slug = (category as any).slug || (category as any).id
        entries.push({
          url: `${SITE_URL}/${locale}/categories/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  } catch {
    // ignore
  }

  // Products
  try {
    const products = await getProducts()
    for (const locale of LOCALES) {
      for (const product of products) {
        entries.push({
          url: `${SITE_URL}/${locale}/products/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  } catch {
    // ignore
  }

  // Sellers / Brands
  try {
    const sellers = await getSellers()
    for (const locale of LOCALES) {
      for (const seller of sellers) {
        const slug = (seller as any).slug || (seller as any).id
        entries.push({
          url: `${SITE_URL}/${locale}/brands/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }
    }
  } catch {
    // ignore
  }

  return entries
}
