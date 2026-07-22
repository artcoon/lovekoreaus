import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { ProductDetail } from '@/components/products/product-detail'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${title} — Korean Product`,
    description: `View details, reviews, and video for ${title}. Verified Korean product on LoveKorea.Us.`,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <ProductDetail slug={slug} />
      </main>
      <GlobalFooter />
    </>
  )
}
