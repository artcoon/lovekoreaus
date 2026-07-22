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
import { getFeaturedProducts, getFeaturedSellers, getFeaturedVideos } from '@/lib/queries'

export default async function HomePage() {
  const [products, sellers, videos] = await Promise.all([
    getFeaturedProducts(4),
    getFeaturedSellers(4),
    getFeaturedVideos(4),
  ])

  return (
    <>
      <GlobalHeader />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <HowItWorks />
        <CategoryGrid />
        <FeaturedProducts products={products as any} />
        <WatchPreview videos={videos as any} />
        <FeaturedBrands brands={sellers as any} />
        <SellerCta />
      </main>
      <GlobalFooter />
    </>
  )
}
