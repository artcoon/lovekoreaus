'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Package, Building2, Star, ExternalLink, Loader2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/badge'

interface SearchResult {
  products: Array<{
    id: string; name: string; name_en: string; slug: string
    price_min: number; price_max: number; rating_avg: number; review_count: number
  }>
  sellers: Array<{
    id: string; company_name: string; company_name_en: string; slug: string
    seller_type: string; is_verified: boolean; rating_avg: number; review_count: number
  }>
}

export function SearchResults() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tab, setTab] = useState<'all' | 'products' | 'sellers'>('all')

  const doSearch = useCallback(async (query: string) => {
    if (query.length < 2) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${tab}`)
      setResults(await res.json())
    } catch { setResults(null) }
    finally { setIsLoading(false) }
  }, [tab])

  useEffect(() => { if (q) doSearch(q) }, [q, doSearch])

  const totalProducts = results?.products?.length ?? 0
  const totalSellers = results?.sellers?.length ?? 0

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-6 w-6 text-navy" />
        <h1 className="text-2xl font-bold text-navy">
          Search results for &quot;{q}&quot;
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
        {(['all', 'products', 'sellers'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'
            }`}
          >
            {t === 'all' ? `All (${totalProducts + totalSellers})` : t === 'products' ? `Products (${totalProducts})` : `Sellers (${totalSellers})`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : !results || (totalProducts === 0 && totalSellers === 0) ? (
        <div className="text-center py-20">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg text-gray-500">No results found for &quot;{q}&quot;</p>
          <p className="text-sm text-gray-400 mt-2">Try different keywords or browse our categories</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Products */}
          {(tab === 'all' || tab === 'products') && results.products.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" /> Products ({results.products.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-navy group-hover:text-accent-red transition-colors">
                          {p.name_en || p.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          ${p.price_min} - ${p.price_max}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-accent-red shrink-0" />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600">{p.rating_avg} ({p.review_count})</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sellers */}
          {(tab === 'all' || tab === 'sellers') && results.sellers.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" /> Sellers ({results.sellers.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.sellers.map((s) => (
                  <Link
                    key={s.id}
                    href={`/brands/${s.slug}`}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-navy group-hover:text-accent-red transition-colors">
                          {s.company_name_en || s.company_name}
                          {s.is_verified && <span className="ml-1 text-blue-500">✓</span>}
                        </h3>
                        <Badge variant="outline" className="text-xs mt-1 capitalize">{s.seller_type}</Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-accent-red shrink-0" />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600">{s.rating_avg} ({s.review_count})</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
