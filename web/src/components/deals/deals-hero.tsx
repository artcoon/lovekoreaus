'use client'

import { Zap } from 'lucide-react'

export function DealsHero() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: "url('/images/landscapes/hanok-village-4.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-accent-red/70 to-accent-red-dark/70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm text-white font-medium mb-4 backdrop-blur-sm">
          <Zap className="h-3 w-3 fill-white" />
          Sale
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">Sale</h1>
        <p className="mt-3 text-white/90 max-w-xl mx-auto drop-shadow-sm">
          Exclusive discounts on Korean products. Limited-time flash sales and sponsored offers.
        </p>
      </div>
    </section>
  )
}
