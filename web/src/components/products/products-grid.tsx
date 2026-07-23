'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import {
  Star, Play, SlidersHorizontal, Grid3X3, LayoutList,
  ChevronDown, ShieldCheck, ImageIcon, ArrowUpDown, X,
  Sparkles, UtensilsCrossed, Shirt, Music, Heart, Cpu,
  Home, Gift, Baby, PawPrint, Amphora, Car, Package
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ── Category config ──────────────────────────────────────
const CATEGORY_MAP: Record<string, { label: string; icon: typeof Sparkles; slug: string }> = {
  c1: { label: 'Beauty & Skincare', icon: Sparkles, slug: 'beauty' },
  c2: { label: 'Food & Beverage', icon: UtensilsCrossed, slug: 'food' },
  c3: { label: 'Fashion & Apparel', icon: Shirt, slug: 'fashion' },
  c4: { label: 'K-Pop & Entertainment', icon: Music, slug: 'kpop' },
  c5: { label: 'Health & Wellness', icon: Heart, slug: 'health' },
  c6: { label: 'Technology & Electronics', icon: Cpu, slug: 'tech' },
  c7: { label: 'Home & Living', icon: Home, slug: 'home' },
  c8: { label: 'Stationery & Gifts', icon: Gift, slug: 'stationery' },
  c9: { label: 'Baby & Kids', icon: Baby, slug: 'baby' },
  c10: { label: 'Pets', icon: PawPrint, slug: 'pets' },
  c11: { label: 'Traditional & Artisan', icon: Amphora, slug: 'traditional' },
  c12: { label: 'Automotive & Industrial', icon: Car, slug: 'automotive' },
}

type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

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

export function ProductsGrid({ products, initialCategory }: { products: ProductItem[]; initialCategory?: string }) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999])
  const [showCertsOnly, setShowCertsOnly] = useState(false)
  const [showVideoOnly, setShowVideoOnly] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  // Derive available categories from products
  const categoriesWithCount = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach(p => {
      const catId = p.category_id || 'other'
      counts[catId] = (counts[catId] || 0) + 1
    })
    return Object.entries(CATEGORY_MAP)
      .filter(([id]) => counts[id])
      .map(([id, cat]) => ({ id, ...cat, count: counts[id] || 0 }))
  }, [products])

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...products]

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category_id === activeCategory)
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name_en.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.description_en && p.description_en.toLowerCase().includes(q))
      )
    }

    // Price range
    result = result.filter(p => {
      if (!p.price_min) return true
      return p.price_min >= priceRange[0] && p.price_min <= priceRange[1]
    })

    // Certs filter
    if (showCertsOnly) {
      result = result.filter(p => p.certs.length > 0)
    }

    // Video filter
    if (showVideoOnly) {
      result = result.filter(p => p.hasVideo)
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => (b.view_count || b.review_count) - (a.view_count || a.review_count))
        break
      case 'newest':
        result.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
        break
      case 'price-low':
        result.sort((a, b) => (a.price_min || 0) - (b.price_min || 0))
        break
      case 'price-high':
        result.sort((a, b) => (b.price_min || 0) - (a.price_min || 0))
        break
      case 'rating':
        result.sort((a, b) => b.rating_avg - a.rating_avg)
        break
    }

    // Sponsored first
    result.sort((a, b) => (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0))

    return result
  }, [products, activeCategory, searchQuery, sortBy, priceRange, showCertsOnly, showVideoOnly])

  const activeFilters = [
    ...(activeCategory !== 'all' ? [{ key: 'category', label: CATEGORY_MAP[activeCategory]?.label || activeCategory }] : []),
    ...(showCertsOnly ? [{ key: 'certs', label: 'Certified' }] : []),
    ...(showVideoOnly ? [{ key: 'video', label: 'Has Video' }] : []),
    ...(searchQuery ? [{ key: 'search', label: `"${searchQuery}"` }] : []),
  ]

  const clearFilter = (key: string) => {
    if (key === 'category') setActiveCategory('all')
    if (key === 'certs') setShowCertsOnly(false)
    if (key === 'video') setShowVideoOnly(false)
    if (key === 'search') setSearchQuery('')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* ── Category pills ─────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-navy text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          <Package className="h-3.5 w-3.5" />
          All ({products.length})
        </button>
        {categoriesWithCount.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label} ({cat.count})
            </button>
          )
        })}
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 mb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-navy">{filtered.length}</span> products
          </p>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {activeFilters.map(f => (
                <button
                  key={f.key}
                  onClick={() => clearFilter(f.key)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy/10 text-navy text-xs font-medium hover:bg-navy/20 transition-colors"
                >
                  {f.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              {activeFilters.length > 1 && (
                <button
                  onClick={() => { setActiveCategory('all'); setShowCertsOnly(false); setShowVideoOnly(false); setSearchQuery('') }}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl text-xs ${showFilters ? 'bg-navy text-white border-navy hover:bg-navy/90' : ''}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
            Filters
          </Button>

          {/* Sort dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="rounded-xl text-xs"
            >
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
              {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1 min-w-[180px]">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSortDropdown(false) }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortBy === opt.value ? 'bg-navy/5 text-navy font-medium' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* View mode toggle */}
          <div className="hidden sm:flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-navy' : 'text-gray-400'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-navy' : 'text-gray-400'}`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Advanced filters panel ─────────────────────────── */}
      {showFilters && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Price Range (USD)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                  placeholder="Min"
                />
                <span className="text-gray-300">—</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowCertsOnly(!showCertsOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showCertsOnly ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Certified Only
                </button>
                <button
                  onClick={() => setShowVideoOnly(!showVideoOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showVideoOnly ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Play className="h-3.5 w-3.5" />
                  Has Video
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Search within results</label>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by name or brand..."
                className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/20 focus:border-accent-red"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Product Grid ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium text-gray-500 mb-1">No products found</p>
          <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or search query.</p>
          <Button
            variant="outline"
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); setShowCertsOnly(false); setShowVideoOnly(false) }}
            className="rounded-xl"
          >
            Clear all filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <ProductListItem key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Grid Card ─────────────────────────────────────────────
function ProductCard({ product }: { product: ProductItem }) {
  const categoryInfo = product.category_id ? CATEGORY_MAP[product.category_id] : null

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name_en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <ImageIcon className="h-10 w-10 text-gray-200" />
              <span className="text-xs text-gray-300 font-medium">{product.brand}</span>
            </div>
          )}

          {/* Sponsored badge */}
          {product.is_sponsored && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-amber-500 text-white text-[10px] shadow-sm">Sponsored</Badge>
            </div>
          )}

          {/* Video badge */}
          {product.hasVideo && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent-red/90 flex items-center justify-center shadow-md backdrop-blur-sm">
              <Play className="h-3.5 w-3.5 text-white fill-white ml-0.5" />
            </div>
          )}

          {/* Cert badges */}
          {product.certs.length > 0 && (
            <div className="absolute bottom-3 left-3 flex gap-1">
              {product.certs.slice(0, 2).map((c) => (
                <Badge key={c} className="bg-green-600/90 text-white text-[10px] shadow-sm backdrop-blur-sm">
                  <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                  {c}
                </Badge>
              ))}
              {product.certs.length > 2 && (
                <Badge className="bg-green-600/90 text-white text-[10px] shadow-sm backdrop-blur-sm">
                  +{product.certs.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Category tag */}
          {categoryInfo && (
            <div className="absolute bottom-3 right-3">
              <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-[10px] text-gray-600 shadow-sm">
                {categoryInfo.label.split(' ')[0]}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{product.brand}</p>
          <h3 className="mt-1 text-sm font-semibold text-navy line-clamp-2 group-hover:text-accent-red transition-colors leading-snug">
            {product.name_en}
          </h3>

          {product.description_en && (
            <p className="mt-1.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">{product.description_en}</p>
          )}

          <div className="mt-auto pt-3">
            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-navy">
                {product.price_min ? `$${product.price_min.toFixed(2)}` : 'Contact for price'}
              </span>
              {product.price_max && product.price_max !== product.price_min && (
                <span className="text-xs text-gray-400">— ${product.price_max.toFixed(2)}</span>
              )}
            </div>

            {/* MOQ */}
            {product.moq && (
              <p className="text-[10px] text-gray-400 mt-0.5">MOQ: {product.moq} units</p>
            )}

            {/* Rating */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${s <= Math.round(product.rating_avg) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-navy ml-1">{product.rating_avg.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400">({product.review_count.toLocaleString()})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── List Item ─────────────────────────────────────────────
function ProductListItem({ product }: { product: ProductItem }) {
  const categoryInfo = product.category_id ? CATEGORY_MAP[product.category_id] : null

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 p-4">
        {/* Image */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden shrink-0">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name_en} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="h-8 w-8 text-gray-200" />
            </div>
          )}
          {product.hasVideo && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-red/90 flex items-center justify-center">
              <Play className="h-2.5 w-2.5 text-white fill-white ml-0.5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{product.brand}</p>
                {categoryInfo && (
                  <Badge variant="secondary" className="text-[10px]">{categoryInfo.label}</Badge>
                )}
                {product.is_sponsored && (
                  <Badge className="bg-amber-100 text-amber-700 text-[10px]">Sponsored</Badge>
                )}
              </div>
              <h3 className="mt-1 text-base font-semibold text-navy group-hover:text-accent-red transition-colors">
                {product.name_en}
              </h3>
              {product.description_en && (
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">{product.description_en}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-navy">
                {product.price_min ? `$${product.price_min.toFixed(2)}` : 'Contact'}
              </p>
              {product.moq && <p className="text-[10px] text-gray-400">MOQ: {product.moq}</p>}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-navy">{product.rating_avg.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({product.review_count.toLocaleString()} reviews)</span>
            </div>

            {/* Certs */}
            {product.certs.length > 0 && (
              <div className="flex gap-1">
                {product.certs.map(c => (
                  <Badge key={c} className="bg-green-50 text-green-700 text-[10px] border border-green-200">
                    <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />{c}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
