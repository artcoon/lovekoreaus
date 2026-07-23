import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { ProductsPageClient } from '@/components/products/products-page-client'

export const metadata: Metadata = {
  title: 'Products — Korean Products Marketplace | LoveKorea.us',
  description: 'Browse verified Korean products across beauty, food, fashion, K-pop, health, tech, and more. Compare prices, read reviews, and connect with sellers.',
}

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
