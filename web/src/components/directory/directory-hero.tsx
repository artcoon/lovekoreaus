'use client'

import { Search } from 'lucide-react'

export function DirectoryHero() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/images/brands/seoul-tech.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-navy/70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center drop-shadow-md">
          Korean Business Directory
        </h1>
        <p className="mt-3 text-center text-white/80 max-w-xl mx-auto drop-shadow-sm">
          Discover verified Korean manufacturers, brands, and service providers
        </p>
        <div className="mt-8 max-w-lg mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search businesses by name, category, or keyword..."
            className="w-full rounded-xl bg-white/95 backdrop-blur-sm py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-red"
          />
        </div>
      </div>
    </section>
  )
}
