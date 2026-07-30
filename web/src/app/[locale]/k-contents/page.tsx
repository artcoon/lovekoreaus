import type { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { WatchHero } from '@/components/watch/watch-hero'
import { WatchGrid } from '@/components/watch/watch-grid'
import { createMetadata } from '@/lib/seo/metadata'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = createMetadata({
  title: 'K-Contents — Korean Product Video Reviews & Entertainment',
  description: 'Watch curated video reviews of Korean products. Discover beauty, food, fashion, K-pop, and culture through YouTube creators.',
  path: '/k-contents',
})

export default async function KContentsPage() {
  unstable_noStore()
  const { getVideos } = await import('@/lib/queries')
  const videos = await getVideos()

  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <WatchHero />
        <WatchGrid videos={videos as any} />
      </main>
      <GlobalFooter />
    </>
  )
}
