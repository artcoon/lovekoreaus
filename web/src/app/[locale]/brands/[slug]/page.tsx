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
  const { getSellerBySlug } = await import('@/lib/queries')
  const seller = await getSellerBySlug(slug)

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <BrandDetail slug={slug} seller={seller as any} />
      </main>
      <GlobalFooter />
    </>
  )
}
