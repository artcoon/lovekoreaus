import { useTranslations } from 'next-intl'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { HeroSection } from '@/components/home/hero-section'
import { TrustBar } from '@/components/home/trust-bar'
import { HowItWorks } from '@/components/home/how-it-works'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { WatchPreview } from '@/components/home/watch-preview'
import { FeaturedBrands } from '@/components/home/featured-brands'
import { SellerCta } from '@/components/home/seller-cta'

export default function HomePage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <HowItWorks />
        <CategoryGrid />
        <FeaturedProducts />
        <WatchPreview />
        <FeaturedBrands />
        <SellerCta />
      </main>
      <GlobalFooter />
    </>
  )
}
