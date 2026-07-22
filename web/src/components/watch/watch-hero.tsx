'use client'

import { Play } from 'lucide-react'

export function WatchHero() {
  return (
    <section className="bg-navy py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-red/10 border border-accent-red/30 px-4 py-1.5 text-sm text-accent-red font-medium mb-4">
          <Play className="h-3 w-3 fill-accent-red" />
          Video Discovery
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Watch & Discover Korea</h1>
        <p className="mt-3 text-white/60 max-w-xl mx-auto">
          Curated video reviews from YouTube creators. See Korean products in action before you buy.
        </p>
      </div>
    </section>
  )
}
