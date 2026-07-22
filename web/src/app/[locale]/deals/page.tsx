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

export default function DealsPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <DealsHero />
        <FlashSale />
        <DealsGrid />
      </main>
      <GlobalFooter />
    </>
  )
}
