import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { DirectoryPageClient } from '@/components/directory/directory-page-client'

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
      <main className="flex-1 bg-gray-50">
        <DirectoryPageClient sellers={sellers as any} />
      </main>
      <GlobalFooter />
    </>
  )
}
