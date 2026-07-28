declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set' | 'consent',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: Record<string, unknown>[]
  }
}

export const GA_EVENT_CATEGORIES = {
  ENGAGEMENT: 'engagement',
  ECOMMERCE: 'ecommerce',
  SELLER: 'seller',
  AUTH: 'auth',
  SEARCH: 'search',
  VIDEO: 'video',
  LEAD: 'lead',
} as const

export function gtag(
  command: 'config' | 'event' | 'js' | 'set' | 'consent',
  targetId: string | Date,
  config?: Record<string, unknown>
) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag(command, targetId, config)
}

export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean | Record<string, unknown>> = {}
) {
  gtag('event', name, params as Record<string, unknown>)
}

export function trackPageView(url: string, title?: string) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!gaId) return
  gtag('config', gaId, {
    page_location: url,
    page_title: title || document.title,
  })
}

export function trackProductView(product: {
  id: string
  name: string
  brand?: string
  category?: string
  price?: number
}) {
  trackEvent('view_item', {
    currency: 'USD',
    value: product.price ?? 0,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand ?? '',
        item_category: product.category ?? '',
        price: product.price ?? 0,
      },
    ] as unknown as Record<string, unknown>,
  })
}

export function trackSellerView(seller: {
  id: string
  name: string
  type?: string
}) {
  trackEvent('view_seller', {
    seller_id: seller.id,
    seller_name: seller.name,
    seller_type: seller.type ?? '',
  })
}

export function trackLeadSubmit(params: {
  type: 'inquiry' | 'quote'
  product_id?: string
  seller_id?: string
}) {
  trackEvent('generate_lead', {
    currency: 'USD',
    value: 1,
    lead_type: params.type,
    product_id: params.product_id ?? '',
    seller_id: params.seller_id ?? '',
  })
}

export function trackSignUp(method: 'email' | 'google' | 'kakao' | 'unknown' = 'unknown') {
  trackEvent('sign_up', { method })
}

export function trackSellerOnboardingStep(step: string) {
  trackEvent('seller_onboarding_step', { step })
}

export function trackVideoPlay(videoId: string, title: string, category?: string) {
  trackEvent('video_play', {
    video_id: videoId,
    video_title: title,
    video_category: category ?? '',
  })
}

export function trackSearch(query: string, resultsCount?: number) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount ?? 0,
  })
}
