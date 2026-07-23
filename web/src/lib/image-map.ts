// Image mapping for products and brands — used as fallback when DB has no image
export const PRODUCT_IMAGES: Record<string, string> = {
  'snail-mucin-essence': '/images/products/snail-mucin-essence.jpg',
  'cosrx-snail-mucin': '/images/products/snail-mucin-essence.jpg',
  'bibigo-mandu': '/images/products/bibigo-mandu.jpg',
  'hanbok-modern-dress': '/images/products/hanbok-modern-dress.jpg',
  'red-ginseng-extract': '/images/products/red-ginseng-extract.jpg',
  'jeju-green-tea-serum': '/images/products/jeju-green-tea-serum.jpg',
  'innisfree-green-tea': '/images/products/jeju-green-tea-serum.jpg',
  'tteokbokki-kit': '/images/products/tteokbokki-kit.jpg',
  'bt21-plush': '/images/products/bt21-plush.jpg',
  'soju-glasses-set': '/images/products/soju-glasses-set.jpg',
  'vitamin-c-megadose': '/images/products/vitamin-c-megadose.jpg',
  'galaxy-buds3-pro': '/images/products/galaxy-buds3-pro.jpg',
  'locknlock-container-set': '/images/products/locknlock-container-set.jpg',
  'monami-pluspen-36': '/images/products/monami-pluspen-36.jpg',
  'goongbe-baby-lotion': '/images/products/goongbe-baby-lotion.jpg',
  'bowwow-dental-chew': '/images/products/bowwow-dental-chew.jpg',
  'celadon-tea-cup-set': '/images/products/celadon-tea-cup-set.jpg',
  'ceramic-car-coating': '/images/products/ceramic-car-coating.jpg',
  'mediheal-nmf-mask': '/images/products/mediheal-nmf-mask.jpg',
  'shin-ramyun-black': '/images/products/shin-ramyun-black.jpg',
  'ginseng-eye-cream': '/images/products/red-ginseng-extract.jpg',
}

export const BRAND_IMAGES: Record<string, string> = {
  'hana-cosmetics': '/images/brands/hana-cosmetics.jpg',
  'kimchi-world': '/images/brands/kimchi-world.jpg',
  'k-style-fashion': '/images/brands/k-style-fashion.jpg',
  'seoul-tech': '/images/brands/seoul-tech.jpg',
  'green-tea-farm': '/images/brands/green-tea-farm.jpg',
  'hallyu-goods': '/images/brands/hallyu-goods.jpg',
  'cosrx': '/images/brands/hana-cosmetics.jpg',
  'cj-bibigo': '/images/brands/kimchi-world.jpg',
  'innisfree': '/images/brands/green-tea-farm.jpg',
  'seoul-fashion': '/images/brands/k-style-fashion.jpg',
  'k-culture-store': '/images/brands/hallyu-goods.jpg',
}

export function getProductImage(slug: string): string | null {
  return PRODUCT_IMAGES[slug] || null
}

export function getBrandImage(slug: string): string | null {
  return BRAND_IMAGES[slug] || null
}
