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
import { getFeaturedProducts, getFeaturedSellers, getVideos } from '@/lib/queries'
import { createMetadata } from '@/lib/seo/metadata'
import { JsonLd } from '@/components/seo/json-ld'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld'

export const revalidate = 0

export const metadata = createMetadata({
  title: 'LoveKorea.Us — Discover the Best of Korea',
  description: "Korea's Gateway to the U.S., Japan & China — Discover verified Korean products, brands, and businesses with video reviews.",
  path: '',
})

export default async function HomePage() {
  const [products, sellers, videos] = await Promise.all([
    getFeaturedProducts(4),
    getFeaturedSellers(4),
    getVideos({ limit: 50 }),
  ])

  const kpopVideos = videos
    .filter((v: any) => v.category === 'K-Pop')
    .slice(0, 10)

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <GlobalHeader />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <HowItWorks />
        <CategoryGrid />
        <FeaturedProducts products={products as any} />
        <WatchPreview videos={kpopVideos as any} title="Trending K-Pop" subtitle="From Gangnam Style to the latest hits — watch the K-Pop videos the world loves." />
        <FeaturedBrands brands={sellers as any} />
        <SellerCta />
      </main>
      <GlobalFooter />
    </>
  )
}
