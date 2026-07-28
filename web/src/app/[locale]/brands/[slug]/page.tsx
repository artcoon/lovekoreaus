import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { BrandDetail } from '@/components/brands/brand-detail'
import { createMetadata } from '@/lib/seo/metadata'
import { localBusinessJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/components/seo/json-ld'
import { getSellerBySlug, getProducts, getReviews } from '@/lib/queries'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const seller = await getSellerBySlug(slug)
  const name = (seller as any)?.company_name_en || (seller as any)?.name_en || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return createMetadata({
    title: `${name} — Korean Brand & Seller`,
    description: (seller as any)?.description_en || `View ${name}'s profile, products, and video reviews on LoveKorea.Us.`,
    path: `/brands/${slug}`,
    locale,
    image: (seller as any)?.logo_url || '/images/og/lovekorea-og.jpg',
  })
}

export default async function BrandDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const seller = await getSellerBySlug(slug)

  let products: any[] = []
  let reviews: any[] = []
  if (seller) {
    const allProducts = await getProducts()
    products = (allProducts as any[]).filter((p: any) => p.seller_id === (seller as any).id || p.brandSlug === slug)
    reviews = await getReviews({ sellerId: (seller as any).id }) as any[]
  }

  const jsonLd = seller
    ? [
        localBusinessJsonLd({
          id: (seller as any).id,
          name: (seller as any).company_name_en || (seller as any).name_en || slug,
          description: (seller as any).description_en,
          type: (seller as any).seller_type || 'brand',
          rating: (seller as any).rating_avg ?? undefined,
          reviewCount: (seller as any).review_count ?? undefined,
          image: (seller as any).logo_url,
          url: `https://lovekorea.us/${locale}/brands/${slug}`,
        }),
        breadcrumbJsonLd([
          { name: 'Home', url: `https://lovekorea.us/${locale}` },
          { name: 'Directory', url: `https://lovekorea.us/${locale}/directory` },
          { name: (seller as any).company_name_en || slug, url: `https://lovekorea.us/${locale}/brands/${slug}` },
        ]),
      ]
    : []

  return (
    <>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <BrandDetail slug={slug} seller={seller as any} products={products} reviews={reviews} />
      </main>
      <GlobalFooter />
    </>
  )
}
