'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, Package, Building2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  products: Array<{
    id: string
    name: string
    name_en: string
    slug: string
    price_min: number
    price_max: number
    rating_avg: number
  }>
  sellers: Array<{
    id: string
    company_name: string
    company_name_en: string
    slug: string
    seller_type: string
    is_verified: boolean
    rating_avg: number
  }>
}

export function SearchBar({ variant = 'header' }: { variant?: 'header' | 'hero' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const debounceRef = useRef<NodeJS.Timeout>(null)

  const totalResults = results
    ? results.products.length + results.sellers.length
    : 0

  const allItems = results
    ? [
        ...results.products.map((p) => ({ type: 'product' as const, ...p })),
        ...results.sellers.map((s) => ({ type: 'seller' as const, ...s })),
      ]
    : []

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null)
      setIsOpen(false)
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data: SearchResult = await res.json()
      setResults(data)
      setIsOpen(true)
      setSelectedIndex(-1)
    } catch {
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(value), 300)
  }

  const navigateTo = (path: string) => {
    setIsOpen(false)
    setQuery('')
    router.push(path)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && allItems[selectedIndex]) {
        const item = allItems[selectedIndex]
        if (item.type === 'product') {
          navigateTo(`/products/${item.slug}`)
        } else {
          navigateTo(`/brands/${item.slug}`)
        }
      } else if (query.length >= 2) {
        navigateTo(`/search?q=${encodeURIComponent(query)}`)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isHero = variant === 'hero'

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isHero ? 'text-gray-400 left-4 h-5 w-5' : 'text-white/50'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results && totalResults > 0) setIsOpen(true) }}
          placeholder="Search products, brands, sellers..."
          className={
            isHero
              ? 'w-full rounded-xl bg-white py-4 pl-12 pr-10 text-base text-gray-900 placeholder:text-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-red'
              : 'w-full rounded-full bg-white/10 border border-white/20 py-2 pl-10 pr-10 text-sm text-white placeholder:text-white/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-accent-red/50 transition-colors'
          }
        />
        {isLoading && (
          <Loader2 className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin ${isHero ? 'text-gray-400' : 'text-white/50'}`} />
        )}
        {!isLoading && query && (
          <button
            onClick={() => { setQuery(''); setResults(null); setIsOpen(false) }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${isHero ? 'text-gray-400 hover:text-gray-600' : 'text-white/50 hover:text-white'}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[60] max-h-[400px] overflow-y-auto">
          {totalResults === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {results.products.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="h-3 w-3" />
                    Products ({results.products.length})
                  </div>
                  {results.products.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => navigateTo(`/products/${p.slug}`)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        selectedIndex === i ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name_en || p.name}</p>
                        <p className="text-xs text-gray-500">
                          ${p.price_min} - ${p.price_max} · ★ {p.rating_avg}
                        </p>
                      </div>
                      <Package className="h-4 w-4 text-gray-300 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              {results.sellers.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" />
                    Sellers ({results.sellers.length})
                  </div>
                  {results.sellers.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => navigateTo(`/brands/${s.slug}`)}
                      className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        selectedIndex === results.products.length + i ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {s.company_name_en || s.company_name}
                          {s.is_verified && <span className="ml-1 text-blue-500">✓</span>}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {s.seller_type} · ★ {s.rating_avg}
                        </p>
                      </div>
                      <Building2 className="h-4 w-4 text-gray-300 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigateTo(`/search?q=${encodeURIComponent(query)}`)}
                className="w-full px-4 py-3 text-sm text-accent-red font-medium hover:bg-gray-50 border-t border-gray-100 text-center"
              >
                View all results for &quot;{query}&quot;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
