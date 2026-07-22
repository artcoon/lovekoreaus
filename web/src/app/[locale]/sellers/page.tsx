import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { SellerHero } from '@/components/sellers/seller-hero'
import { SellerHowItWorks } from '@/components/sellers/seller-how-it-works'
import { SellerBenefits } from '@/components/sellers/seller-benefits'
import { SellerPricing } from '@/components/sellers/seller-pricing'
import { SellerFaq } from '@/components/sellers/seller-faq'
import { SellerFinalCta } from '@/components/sellers/seller-final-cta'

export const metadata: Metadata = {
  title: 'For Sellers — Grow Your Korean Business Globally',
  description:
    'Register your Korean business for free. Reach buyers in the US, Japan, and China with video-first product discovery.',
}

export default function SellersPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1">
        <SellerHero />
        <SellerHowItWorks />
        <SellerBenefits />
        <SellerPricing />
        <SellerFaq />
        <SellerFinalCta />
      </main>
      <GlobalFooter />
    </>
  )
}
