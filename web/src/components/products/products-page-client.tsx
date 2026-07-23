'use client'

import { useState } from 'react'
import { ProductsHero } from './products-hero'
import { ProductsGrid } from './products-grid'

interface ProductItem {
  slug: string
  name_en: string
  description_en?: string | null
  brand: string
  brandSlug?: string
  price_min: number | null
  price_max?: number | null
  rating_avg: number
  review_count: number
  hasVideo: boolean
  certs: string[]
  category_id?: string | null
  image_url?: string | null
  moq?: number | null
  is_sponsored?: boolean
  view_count?: number
  created_at?: string
}

export function ProductsPageClient({ products }: { products: ProductItem[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter by hero search
  const filtered = searchQuery.trim()
    ? products.filter(p =>
        p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description_en && p.description_en.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products

  return (
    <>
      <ProductsHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={products.length}
      />
      <ProductsGrid products={filtered} />
    </>
  )
}
