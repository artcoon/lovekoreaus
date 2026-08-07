import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { ProductsPageClient } from '@/components/products/products-page-client'
import { createMetadata } from '@/lib/seo/metadata'
import { getCategories, getProducts } from '@/lib/queries'

export const metadata: Metadata = createMetadata({
  title: 'Korean Products Marketplace — K-Beauty, K-Food, K-Pop & More',
  description: 'Browse verified Korean products across beauty, food, fashion, K-pop, health, tech, and home. Compare prices, read reviews, and connect directly with sellers.',
  path: '/products',
})

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { category?: string }
}) {
  const categorySlug = searchParams?.category ?? ''
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  const matchedCategory = categorySlug
    ? categories.find((c: any) => c.slug === categorySlug || c.slug === `k-${categorySlug}`)
    : null

  const filteredProducts = matchedCategory
    ? products.filter((p: any) => p.category_id === matchedCategory.id)
    : products

  const categoryTitle = matchedCategory
    ? matchedCategory.name_en
    : undefined

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <ProductsPageClient products={filteredProducts as any} categoryTitle={categoryTitle} />
      </main>
      <GlobalFooter />
    </>
  )
}
