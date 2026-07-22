import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your LoveKorea.Us account. Join as a buyer or seller.',
}

export default function SignupPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16">
        <SignupForm />
      </main>
      <GlobalFooter />
    </>
  )
}
