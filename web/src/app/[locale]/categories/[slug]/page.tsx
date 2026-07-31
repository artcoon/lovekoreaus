import type { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { ProductsPageClient } from '@/components/products/products-page-client'

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>
}

const urlToDbSlug: Record<string, string> = {
  'k-beauty': 'beauty',
  'k-food': 'food',
  'k-fashion': 'fashion',
  'k-pop': 'kpop',
  'k-health': 'health',
  'k-stationery': 'stationery',
  'k-culture': 'traditional',
  'k-traditional': 'traditional',
}

const displayNames: Record<string, string> = {
  beauty: 'K-Beauty & Skincare',
  food: 'K-Food & Beverage',
  fashion: 'K-Fashion & Apparel',
  kpop: 'K-Pop & Entertainment',
  health: 'K-Health & Wellness',
  stationery: 'K-Stationery & Gifts',
  traditional: 'K-Culture & Heritage',
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const dbSlug = urlToDbSlug[slug.toLowerCase()] || slug
  const title = displayNames[dbSlug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  return {
    title: `${title} — Korean Products Marketplace | LoveKorea.us`,
    description: `Browse verified Korean ${title} products. Compare prices, read reviews, and connect with sellers.`,
  }
}

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: CategoryPageProps) {
  unstable_noStore()
  const { slug } = await params
  const { getProducts, getCategories } = await import('@/lib/queries')

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  const dbSlug = urlToDbSlug[slug.toLowerCase()] || slug
  const category = categories.find((c: any) =>
    c.slug === dbSlug ||
    c.slug === slug ||
    c.slug === slug.replace(/^k-/, '') ||
    c.slug === slug.replace(/-/g, '')
  )

  const filteredProducts = category
    ? products.filter((p: any) =>
        p.category_id === category.id ||
        (p.category_slug || '').toLowerCase() === (category.slug || '').toLowerCase() ||
        (p.category || '').toLowerCase() === (category.slug || '').toLowerCase()
      )
    : products

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <ProductsPageClient
          products={filteredProducts as any}
          categoryTitle={displayNames[category?.slug || dbSlug] || category?.name_en || category?.name || slug.replace(/-/g, ' ')}
        />
      </main>
      <GlobalFooter />
    </>
  )
}
