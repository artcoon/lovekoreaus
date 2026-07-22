import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { SellerOnboardingForm } from '@/components/auth/seller-onboarding-form'

export const metadata: Metadata = {
  title: 'Seller Registration | LoveKorea.Us',
  description: 'Register your business on LoveKorea.Us',
}

export default function SellerOnboardingPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50 py-12">
        <SellerOnboardingForm />
      </main>
      <GlobalFooter />
    </>
  )
}
