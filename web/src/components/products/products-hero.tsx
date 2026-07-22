'use client'

import { Search } from 'lucide-react'

export function ProductsHero() {
  return (
    <section className="bg-navy py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Korean Products</h1>
        <p className="mt-3 text-white/60 max-w-xl mx-auto">
          Discover verified products from Korean manufacturers and brands
        </p>
        <div className="mt-6 max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-xl bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
          />
        </div>
      </div>
    </section>
  )
}
