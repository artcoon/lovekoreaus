import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your LoveKorea.Us account.',
}

export default function LoginPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-16">
        <LoginForm />
      </main>
      <GlobalFooter />
    </>
  )
}
