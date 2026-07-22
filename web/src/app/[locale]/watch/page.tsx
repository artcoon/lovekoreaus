import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { WatchHero } from '@/components/watch/watch-hero'
import { WatchGrid } from '@/components/watch/watch-grid'

export const metadata: Metadata = {
  title: 'Watch — Korean Product Video Reviews',
  description: 'Watch curated video reviews of Korean products. Discover beauty, food, fashion, and culture through YouTube creators.',
}

export default async function WatchPage() {
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
