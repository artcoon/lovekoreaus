import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { BrandDetail } from '@/components/brands/brand-detail'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${title} — Korean Brand`,
    description: `View ${title}'s profile, products, and video reviews on LoveKorea.Us.`,
  }
}

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { getSellerBySlug, getProducts, getReviews } = await import('@/lib/queries')
  const seller = await getSellerBySlug(slug)

  // Fetch seller's products and reviews if seller found
  let products: any[] = []
  let reviews: any[] = []
  if (seller) {
    const allProducts = await getProducts()
    products = (allProducts as any[]).filter((p: any) => p.seller_id === (seller as any).id || p.brandSlug === slug)
    reviews = await getReviews({}) as any[]
  }

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <BrandDetail slug={slug} seller={seller as any} products={products} reviews={reviews} />
      </main>
      <GlobalFooter />
    </>
  )
}
