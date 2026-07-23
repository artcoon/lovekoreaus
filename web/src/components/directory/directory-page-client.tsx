'use client'

import { useState, useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import {
  Search, MapPin, Star, ShieldCheck, Globe, SlidersHorizontal,
  ChevronLeft, ChevronRight, X, Building2, Package
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const BRAND_IMAGES: Record<string, string> = {
  'hana-cosmetics': '/images/brands/hana-cosmetics.jpg',
  'kimchi-world': '/images/brands/kimchi-world.jpg',
  'k-style-fashion': '/images/brands/k-style-fashion.jpg',
  'seoul-tech': '/images/brands/seoul-tech.jpg',
  'green-tea-farm': '/images/brands/green-tea-farm.jpg',
  'hallyu-goods': '/images/brands/hallyu-goods.jpg',
  'cosrx': '/images/brands/hana-cosmetics.jpg',
}

interface SellerItem {
  slug: string
  company_name_en?: string
  name_en?: string
  seller_type?: string
  description_en?: string | null
  address?: Record<string, string>
  rating_avg?: number
  review_count?: number
  target_markets?: string[]
  is_verified?: boolean
  certs?: string[]
  logo_url?: string | null
}

const TYPES = ['All', 'brand', 'manufacturer', 'distributor', 'small_business', 'service']
const TYPE_LABELS: Record<string, string> = {
  All: 'All Types', brand: 'Brand', manufacturer: 'Manufacturer',
  distributor: 'Distributor', small_business: 'Small Business', service: 'Service'
}
const MARKETS = ['All', 'US', 'Japan', 'China', 'EU', 'Southeast Asia']
const SORTS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'name', label: 'Name A–Z' },
]
const PER_PAGE = 9

export function DirectoryPageClient({ sellers }: { sellers: SellerItem[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [marketFilter, setMarketFilter] = useState('All')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [page, setPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const mapped = useMemo(() => sellers.map(s => ({
    slug: s.slug,
    name: s.company_name_en || s.name_en || 'Business',
    type: s.seller_type || 'brand',
    location: s.address?.city ? `${s.address.city}, Korea` : 'South Korea',
    rating: s.rating_avg ?? 0,
    reviewCount: s.review_count ?? 0,
    markets: s.target_markets || [],
    verified: s.is_verified ?? false,
    certs: s.certs || [],
    description: s.description_en || '',
    logoUrl: s.logo_url || BRAND_IMAGES[s.slug] || null,
  })), [sellers])

  const filtered = useMemo(() => {
    let result = [...mapped]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    }
    if (typeFilter !== 'All') result = result.filter(s => s.type === typeFilter)
    if (marketFilter !== 'All') result = result.filter(s => s.markets.some(m => m.toLowerCase().includes(marketFilter.toLowerCase())))
    if (verifiedOnly) result = result.filter(s => s.verified)

    switch (sortBy) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      case 'reviews': result.sort((a, b) => b.reviewCount - a.reviewCount); break
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
    }
    return result
  }, [mapped, search, typeFilter, marketFilter, verifiedOnly, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const activeFilterCount = [typeFilter !== 'All', marketFilter !== 'All', verifiedOnly, search.trim()].filter(Boolean).length

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Korean Business Directory</h1>
          <p className="mt-3 text-white/60 max-w-xl mx-auto">
            Discover {sellers.length} verified Korean manufacturers, brands, and service providers
          </p>
          <div className="mt-6 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search businesses by name or keyword..."
              className="w-full rounded-xl bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <Button variant="outline" onClick={() => setShowMobileFilters(!showMobileFilters)} className="rounded-xl text-sm">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
          {/* Sidebar filters */}
          <aside className={`${showMobileFilters ? 'block' : 'hidden'} lg:block mb-6 lg:mb-0`}>
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-navy">Filters</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setTypeFilter('All'); setMarketFilter('All'); setVerifiedOnly(false); setSearch(''); setPage(1) }}
                    className="text-xs text-accent-red hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Business Type */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-navy mb-3">Business Type</h3>
                <div className="space-y-2">
                  {TYPES.map(t => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="type" checked={typeFilter === t} onChange={() => { setTypeFilter(t); setPage(1) }} className="w-4 h-4 text-accent-red border-gray-300 focus:ring-accent-red" />
                      <span className={`text-sm ${typeFilter === t ? 'text-navy font-medium' : 'text-gray-600'} group-hover:text-navy`}>{TYPE_LABELS[t]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Market */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-navy mb-3">Target Market</h3>
                <div className="space-y-2">
                  {MARKETS.map(m => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="market" checked={marketFilter === m} onChange={() => { setMarketFilter(m); setPage(1) }} className="w-4 h-4 text-accent-red border-gray-300 focus:ring-accent-red" />
                      <span className={`text-sm ${marketFilter === m ? 'text-navy font-medium' : 'text-gray-600'} group-hover:text-navy`}>{m === 'All' ? 'All Markets' : m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={verifiedOnly} onChange={e => { setVerifiedOnly(e.target.checked); setPage(1) }} className="w-4 h-4 rounded text-accent-red border-gray-300 focus:ring-accent-red" />
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600 group-hover:text-navy">Verified Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-navy">{filtered.length}</span> businesses
                </p>
                {activeFilterCount > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {typeFilter !== 'All' && (
                      <button onClick={() => { setTypeFilter('All'); setPage(1) }} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy/10 text-navy text-xs font-medium hover:bg-navy/20">
                        {TYPE_LABELS[typeFilter]} <X className="h-3 w-3" />
                      </button>
                    )}
                    {marketFilter !== 'All' && (
                      <button onClick={() => { setMarketFilter('All'); setPage(1) }} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy/10 text-navy text-xs font-medium hover:bg-navy/20">
                        {marketFilter} <X className="h-3 w-3" />
                      </button>
                    )}
                    {verifiedOnly && (
                      <button onClick={() => { setVerifiedOnly(false); setPage(1) }} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy/10 text-navy text-xs font-medium hover:bg-navy/20">
                        Verified <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-red/20 bg-white"
              >
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Grid */}
            {paginated.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-200" />
                <p className="text-lg font-medium text-gray-500 mb-1">No businesses found</p>
                <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or search query.</p>
                <Button variant="outline" onClick={() => { setSearch(''); setTypeFilter('All'); setMarketFilter('All'); setVerifiedOnly(false); setPage(1) }} className="rounded-xl">Clear all filters</Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {paginated.map(seller => (
                  <Link key={seller.slug} href={`/brands/${seller.slug}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-gray-200 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl font-bold text-navy shrink-0 overflow-hidden">
                          {seller.logoUrl ? (
                            <img src={seller.logoUrl} alt={seller.name} className="w-full h-full object-cover" />
                          ) : (
                            seller.name[0]
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-navy">{seller.name}</h3>
                            {seller.verified && <ShieldCheck className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="capitalize">{seller.type.replace('_', ' ')}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{seller.location}
                            </span>
                          </div>
                          {seller.description && (
                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{seller.description}</p>
                          )}
                          <div className="mt-3 flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium text-navy">{seller.rating > 0 ? seller.rating.toFixed(1) : '—'}</span>
                              <span className="text-sm text-gray-400">({seller.reviewCount})</span>
                            </div>
                            {seller.markets.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{seller.markets.join(', ')}</span>
                              </div>
                            )}
                            {seller.certs.length > 0 && (
                              <div className="flex gap-1">
                                {seller.certs.slice(0, 3).map(c => (
                                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-400 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                  Math.max(0, page - 3),
                  Math.min(totalPages, page + 2)
                ).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      p === page ? 'bg-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-400 disabled:opacity-40 hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
