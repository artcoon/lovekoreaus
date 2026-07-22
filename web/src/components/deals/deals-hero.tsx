'use client'

import { Zap } from 'lucide-react'

export function DealsHero() {
  return (
    <section className="bg-gradient-to-r from-accent-red to-accent-red-dark py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white font-medium mb-4">
          <Zap className="h-3 w-3 fill-white" />
          Hot Deals
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Deals & Promotions</h1>
        <p className="mt-3 text-white/80 max-w-xl mx-auto">
          Exclusive discounts on Korean products. Limited-time flash sales and sponsored offers.
        </p>
      </div>
    </section>
  )
}
