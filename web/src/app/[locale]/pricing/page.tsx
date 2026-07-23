import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { PricingPage } from '@/components/pricing/pricing-page'

export const metadata: Metadata = {
  title: 'Pricing — LoveKorea.Us',
  description: 'Choose the right plan for your Korean business. Free, Pro, and Premium plans available.',
}

export default function Pricing() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <PricingPage />
      </main>
      <GlobalFooter />
    </>
  )
}
