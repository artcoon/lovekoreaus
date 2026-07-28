'use client'

export function DirectoryHero({ sellerCount }: { sellerCount: number }) {
  return (
    <section className="relative py-16 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/images/brands/hallyu-goods.jpg')" }}
      />
      <div className="absolute inset-0 bg-navy/85" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center drop-shadow-md">
          Korean Business Directory
        </h1>
        <p className="mt-3 text-center text-white/80 max-w-xl mx-auto drop-shadow-sm">
          Discover {sellerCount} verified Korean manufacturers, brands, and service providers
        </p>
      </div>
    </section>
  )
}
