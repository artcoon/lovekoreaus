import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { AdminPanel } from '@/components/admin/admin-panel'

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'LoveKorea.Us administration panel.',
}

export default function AdminPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <AdminPanel />
      </main>
    </>
  )
}
