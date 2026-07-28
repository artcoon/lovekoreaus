'use client'

import { Play } from 'lucide-react'

export function WatchHero() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/images/products/tteokbokki-kit.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/60 to-navy/70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-red/10 border border-accent-red/30 px-4 py-1.5 text-sm text-accent-red font-medium mb-4 backdrop-blur-sm">
          <Play className="h-3 w-3 fill-accent-red" />
          Video Discovery
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">Watch & Discover Korea</h1>
        <p className="mt-3 text-white/80 max-w-xl mx-auto drop-shadow-sm">
          Curated video reviews from YouTube creators. See Korean products in action before you buy.
        </p>
      </div>
    </section>
  )
}
