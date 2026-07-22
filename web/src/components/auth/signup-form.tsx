'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User, Eye, EyeOff, Building } from 'lucide-react'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy">Create Account</h1>
          <p className="mt-2 text-sm text-gray-500">Join LoveKorea.Us for free</p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          <button
            onClick={() => setRole('buyer')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              role === 'buyer' ? 'bg-white text-navy shadow-sm' : 'text-gray-500'
            }`}
          >
            <User className="h-4 w-4" />
            Buyer
          </button>
          <button
            onClick={() => setRole('seller')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              role === 'seller' ? 'bg-white text-navy shadow-sm' : 'text-gray-500'
            }`}
          >
            <Building className="h-4 w-4" />
            Seller
          </button>
        </div>

        {/* Social */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FEE500"><rect width="24" height="24" rx="4"/><path d="M12 6.5c-3.87 0-7 2.5-7 5.6 0 2 1.3 3.76 3.26 4.76l-.83 3.04c-.05.2.17.36.34.25l3.6-2.4c.2.02.42.03.63.03 3.87 0 7-2.5 7-5.6S15.87 6.5 12 6.5z" fill="#3C1E1E"/></svg>
            Continue with Kakao
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-xs text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Full name"
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              placeholder="Email address"
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 8 characters)"
              className="pl-10 pr-10 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {role === 'seller' && (
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Company name"
                className="pl-10 rounded-xl"
              />
            </div>
          )}

          <div className="flex items-start gap-2">
            <input type="checkbox" className="w-4 h-4 mt-0.5 rounded text-accent-red border-gray-300" />
            <span className="text-xs text-gray-500">
              I agree to the{' '}
              <a href="#" className="text-accent-red hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-accent-red hover:underline">Privacy Policy</a>
            </span>
          </div>

          <Button className="w-full bg-accent-red hover:bg-accent-red-dark text-white rounded-xl" size="lg">
            {role === 'seller' ? 'Register as Seller' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-accent-red font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
