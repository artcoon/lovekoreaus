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
      <main className="relative flex-1 bg-gray-50 flex items-center justify-center py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('/images/landscapes/hanok-village-5.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-navy/70" />
        <div className="relative z-10 w-full flex justify-center">
          <LoginForm />
        </div>
      </main>
      <GlobalFooter />
    </>
  )
}
