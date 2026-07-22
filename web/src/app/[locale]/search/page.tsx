import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { SearchResults } from '@/components/search/search-results'

export const metadata: Metadata = {
  title: 'Search | LoveKorea.Us',
  description: 'Search Korean products and sellers.',
}

export default function SearchPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <SearchResults />
      </main>
      <GlobalFooter />
    </>
  )
}
