'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { resetPassword } from '@/lib/auth/actions'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    const result = await resetPassword(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess('Password reset link sent. Please check your email.')
    }
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-500">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        {success && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy-light text-white rounded-xl" size="lg">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  )
}
