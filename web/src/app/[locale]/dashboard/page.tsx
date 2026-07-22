import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

export const metadata: Metadata = {
  title: 'Seller Dashboard',
  description: 'Manage your products, leads, and business profile on LoveKorea.Us.',
}

export default function DashboardPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <DashboardContent />
      </main>
    </>
  )
}
