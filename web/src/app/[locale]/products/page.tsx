import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { ProductsPageClient } from '@/components/products/products-page-client'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Korean Products Marketplace — K-Beauty, K-Food, K-Pop & More',
  description: 'Browse verified Korean products across beauty, food, fashion, K-pop, health, tech, and home. Compare prices, read reviews, and connect directly with sellers.',
  path: '/products',
})

export default async function ProductsPage() {
  const { getProducts } = await import('@/lib/queries')
  const products = await getProducts()

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <ProductsPageClient products={products as any} />
      </main>
      <GlobalFooter />
    </>
  )
}
