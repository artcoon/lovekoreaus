import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { ProductDetail } from '@/components/products/product-detail'
import { createMetadata } from '@/lib/seo/metadata'
import { productJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld'
import { JsonLd } from '@/components/seo/json-ld'
import { getProductBySlug, getReviews } from '@/lib/queries'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const product = await getProductBySlug(slug)
  const name = product?.name_en || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const brand = (product as any)?.brand || 'Korean Brand'
  return createMetadata({
    title: `${name} — ${brand} | Korean Products`,
    description: product?.description_en || `View ${name} specifications, pricing, and reviews on LoveKorea.Us.`,
    path: `/products/${slug}`,
    locale,
    image: (product as any)?.image_url || '/images/og/lovekorea-og.jpg',
  })
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const product = await getProductBySlug(slug)
  const reviews = product ? await getReviews({ productId: product.id }) : []

  const jsonLd = product
    ? [
        productJsonLd({
          id: product.id,
          name: product.name_en || slug,
          description: product.description_en,
          brand: (product as any).brand,
          brandSlug: (product as any).brandSlug,
          price: product.price_min ?? undefined,
          rating: product.rating_avg ?? undefined,
          reviewCount: product.review_count ?? undefined,
          image: (product as any).image_url,
          category: (product as any).category,
          url: `https://lovekorea.us/${locale}/products/${slug}`,
        }),
        breadcrumbJsonLd([
          { name: 'Home', url: `https://lovekorea.us/${locale}` },
          { name: 'Products', url: `https://lovekorea.us/${locale}/products` },
          { name: product.name_en || slug, url: `https://lovekorea.us/${locale}/products/${slug}` },
        ]),
      ]
    : []

  return (
    <>
      {jsonLd.length > 0 && <JsonLd data={jsonLd} />}
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <ProductDetail slug={slug} product={product as any} reviews={reviews as any} />
      </main>
      <GlobalFooter />
    </>
  )
}
