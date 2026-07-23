'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { signIn, signInWithGoogle, signInWithKakao } from '@/lib/auth/actions'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const authError = searchParams.get('error')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    const result = await signInWithGoogle()
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function handleKakao() {
    setLoading(true)
    const result = await signInWithKakao()
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to your LoveKorea.Us account</p>
        </div>

        {(error || authError) && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error || 'Authentication failed. Please try again.'}</span>
          </div>
        )}

        {/* Social Login */}
        <div className="space-y-3">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button
            onClick={handleKakao}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.7 1.86 5.07 4.66 6.42-.15.54-.96 3.48-1 3.63 0 .07.03.14.09.18.04.02.08.03.12.03.06 0 .12-.03.17-.07.71-.52 2.6-1.87 3.68-2.64.74.1 1.51.15 2.28.15 5.52 0 10-3.36 10-7.5S17.52 3 12 3z" fill="#3C1E1E"/></svg>
            Continue with Kakao
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-xs text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Email Login */}
        <form action={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input name="email" type="email" placeholder="Email address" required className="pl-10 rounded-xl" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              minLength={6}
              className="pl-10 pr-10 rounded-xl"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy-light text-white rounded-xl" size="lg">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-accent-red font-medium hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
