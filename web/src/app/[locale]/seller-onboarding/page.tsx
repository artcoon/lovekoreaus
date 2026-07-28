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
      <main className="relative flex-1 bg-gray-50 py-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/landscapes/hanok-village-9.jpg')" }}
        />
        <div className="relative z-10">
          <SellerOnboardingForm />
        </div>
      </main>
      <GlobalFooter />
    </>
  )
}
