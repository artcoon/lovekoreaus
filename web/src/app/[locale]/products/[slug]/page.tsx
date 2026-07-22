import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { ProductDetail } from '@/components/products/product-detail'
import { getProductBySlug } from '@/lib/queries'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const title = product?.name_en || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${title} — Korean Product`,
    description: product?.description_en || `View details, reviews, and video for ${title}.`,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <ProductDetail slug={slug} product={product as any} />
      </main>
      <GlobalFooter />
    </>
  )
}
