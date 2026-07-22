import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { DealsHero } from '@/components/deals/deals-hero'
import { FlashSale } from '@/components/deals/flash-sale'
import { DealsGrid } from '@/components/deals/deals-grid'

export const metadata: Metadata = {
  title: 'Deals — Korean Product Deals & Promotions',
  description: 'Discover flash sales, sponsored products, and exclusive deals on Korean goods.',
}

export default async function DealsPage() {
  const { getActiveDeals, getProducts } = await import('@/lib/queries')
  const [deals, products] = await Promise.all([
    getActiveDeals(),
    getProducts({ limit: 6 }),
  ])

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <DealsHero />
        <FlashSale deals={deals as any} />
        <DealsGrid products={products as any} />
      </main>
      <GlobalFooter />
    </>
  )
}
