export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LoveKorea.Us',
    url: 'https://lovekorea.us',
    logo: 'https://lovekorea.us/images/og/lovekorea-og.jpg',
    sameAs: [
      'https://youtube.com/@lovekorea',
      'https://instagram.com/lovekorea.us',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://lovekorea.us/contact',
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LoveKorea.Us',
    url: 'https://lovekorea.us',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://lovekorea.us/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function productJsonLd(product: {
  id: string
  name: string
  description?: string | null
  brand?: string
  brandSlug?: string
  price?: number | null
  rating?: number
  reviewCount?: number
  image?: string
  category?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `View ${product.name} on LoveKorea.Us`,
    image: product.image || 'https://lovekorea.us/images/og/lovekorea-og.jpg',
    url: product.url,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Korean Brand',
      url: product.brandSlug ? `https://lovekorea.us/brands/${product.brandSlug}` : undefined,
    },
    category: product.category,
    offers: product.price
      ? {
          '@type': 'Offer',
          url: product.url,
          priceCurrency: 'USD',
          price: product.price,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
    aggregateRating:
      product.rating && product.reviewCount && product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  }
}

export function localBusinessJsonLd(seller: {
  id: string
  name: string
  description?: string | null
  type?: string
  rating?: number
  reviewCount?: number
  image?: string
  url: string
  address?: { city?: string; country?: string }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': seller.type === 'manufacturer' ? 'Manufacturer' : seller.type === 'distributor' ? 'WholesaleStore' : 'Brand',
    name: seller.name,
    description: seller.description || `View ${seller.name} on LoveKorea.Us`,
    image: seller.image || 'https://lovekorea.us/images/og/lovekorea-og.jpg',
    url: seller.url,
    address: seller.address
      ? {
          '@type': 'PostalAddress',
          addressLocality: seller.address.city || 'Seoul',
          addressCountry: seller.address.country || 'KR',
        }
      : undefined,
    aggregateRating:
      seller.rating && seller.reviewCount && seller.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: seller.rating,
            reviewCount: seller.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  }
}

export function videoObjectJsonLd(video: {
  id: string
  title: string
  description?: string
  thumbnail: string
  uploadDate?: string
  duration?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || `Watch ${video.title} on LoveKorea.Us`,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.uploadDate || '2024-01-01',
    duration: video.duration,
    contentUrl: video.url,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
