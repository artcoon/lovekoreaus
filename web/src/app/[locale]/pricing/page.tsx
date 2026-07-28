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
        <section className="relative bg-navy py-16 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
            style={{ backgroundImage: "url('/images/landscapes/hanok-village-1.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 to-navy/90" />
          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-white">Choose the Right Plan for Your Business</h1>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto">
              From emerging Korean brands to established exporters, find a plan that helps you reach global buyers.
            </p>
          </div>
        </section>
        <PricingPage />
      </main>
      <GlobalFooter />
    </>
  )
}
