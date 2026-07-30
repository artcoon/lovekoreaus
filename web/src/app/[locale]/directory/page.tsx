import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { DirectoryPageClient } from '@/components/directory/directory-page-client'
import { createMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = createMetadata({
  title: 'Company Profiles — Verified Korean Manufacturers & Brands',
  description: 'Browse verified Korean manufacturers, brands, and service providers. Filter by category, target market, and certification.',
  path: '/directory',
})

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
