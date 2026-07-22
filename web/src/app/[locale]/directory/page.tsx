import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { DirectoryHero } from '@/components/directory/directory-hero'
import { DirectoryFilters } from '@/components/directory/directory-filters'
import { DirectoryGrid } from '@/components/directory/directory-grid'

export const metadata: Metadata = {
  title: 'Directory — Korean Business Directory',
  description: 'Browse verified Korean businesses, manufacturers, and brands. Filter by category, market, and certification.',
}

export default async function DirectoryPage() {
  const { getSellers } = await import('@/lib/queries')
  const sellers = await getSellers()

  return (
    <>
      <GlobalHeader />
      <main className="flex-1">
        <DirectoryHero />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            <DirectoryFilters />
            <DirectoryGrid sellers={sellers as any} />
          </div>
        </div>
      </main>
      <GlobalFooter />
    </>
  )
}
