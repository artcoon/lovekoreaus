'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Building2, Globe, Mail, Package, MapPin, FileText,
  ChevronRight, ChevronLeft, Loader2, AlertCircle, CheckCircle2
} from 'lucide-react'
import { submitSellerOnboarding } from '@/lib/auth/actions'

const sellerTypes = [
  { value: 'brand', label: 'Brand Owner', desc: 'You own the brand and want to expand globally' },
  { value: 'manufacturer', label: 'Manufacturer / OEM', desc: 'You manufacture products for other brands' },
  { value: 'distributor', label: 'Distributor / Exporter', desc: 'You distribute Korean products internationally' },
]

const categoryOptions = [
  { id: 'c0000001-0000-4000-8000-000000000001', label: 'Beauty & Cosmetics' },
  { id: 'c0000002-0000-4000-8000-000000000002', label: 'Food & Beverage' },
  { id: 'c0000003-0000-4000-8000-000000000003', label: 'Fashion & Apparel' },
  { id: 'c0000004-0000-4000-8000-000000000004', label: 'K-Culture & Entertainment' },
  { id: 'c0000005-0000-4000-8000-000000000005', label: 'Electronics & Tech' },
  { id: 'c0000006-0000-4000-8000-000000000006', label: 'Health & Wellness' },
  { id: 'c0000007-0000-4000-8000-000000000007', label: 'Home & Living' },
  { id: 'c0000008-0000-4000-8000-000000000008', label: 'Traditional & Artisan' },
]

const marketOptions = ['US', 'Japan', 'China', 'EU', 'Southeast Asia', 'Middle East', 'Latin America', 'Africa']

export function SellerOnboardingForm() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Form state
  const [sellerType, setSellerType] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyNameEn, setCompanyNameEn] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['US'])

  const toggleMarket = (market: string) => {
    setSelectedMarkets((prev) =>
      prev.includes(market) ? prev.filter((m) => m !== market) : [...prev, market]
    )
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.set('companyName', companyName)
    formData.set('companyNameEn', companyNameEn)
    formData.set('sellerType', sellerType)
    formData.set('categoryId', categoryId)
    formData.set('description', description)
    formData.set('contactEmail', contactEmail)
    formData.set('website', website)
    selectedMarkets.forEach((m) => formData.append('markets', m))

    const result = await submitSellerOnboarding(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return !!sellerType
    if (step === 2) return !!companyNameEn && !!contactEmail
    if (step === 3) return selectedMarkets.length > 0
    return true
  }

  const inputClass = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-red/30'

  return (
    <div className="mx-auto max-w-2xl px-4">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-navy">Seller Registration</h1>
          <span className="text-sm text-gray-500">Step {step} of 3</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-accent-red' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {/* Step 1: Business Type */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-navy mb-1">What type of business are you?</h2>
            <p className="text-sm text-gray-500 mb-6">This helps us tailor your seller experience</p>
            <div className="space-y-3">
              {sellerTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSellerType(type.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    sellerType === type.value
                      ? 'border-accent-red bg-red-50/50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy">{type.label}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{type.desc}</p>
                    </div>
                    {sellerType === type.value && (
                      <CheckCircle2 className="h-5 w-5 text-accent-red shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-navy mb-3">Primary Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      categoryId === cat.id
                        ? 'border-accent-red bg-red-50 text-accent-red font-medium'
                        : 'border-gray-100 text-gray-600 hover:border-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Company Details */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-navy mb-1">Company Details</h2>
            <p className="text-sm text-gray-500 mb-6">Tell buyers about your business</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name (Korean)</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input className={`${inputClass} pl-10`} value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="회사명" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Company Name (English) *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input className={`${inputClass} pl-10`} value={companyNameEn} onChange={(e) => setCompanyNameEn(e.target.value)} placeholder="Company Name" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input className={`${inputClass} pl-10`} type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="export@company.com" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input className={`${inputClass} pl-10`} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://www.company.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Business Description</label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-none`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your business, products, and what makes you unique..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Target Markets */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-navy mb-1">Target Markets</h2>
            <p className="text-sm text-gray-500 mb-6">Which markets do you want to reach?</p>
            <div className="grid grid-cols-2 gap-3">
              {marketOptions.map((market) => (
                <button
                  key={market}
                  onClick={() => toggleMarket(market)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selectedMarkets.includes(market)
                      ? 'border-accent-red bg-red-50/50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <MapPin className={`h-4 w-4 ${selectedMarkets.includes(market) ? 'text-accent-red' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">{market}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <h3 className="text-sm font-semibold text-navy mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" /> What happens next?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>1. Our team reviews your application (1-2 business days)</li>
                <li>2. Once approved, you can add products and set up your storefront</li>
                <li>3. Start receiving inquiries from global buyers</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1.5">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-navy hover:bg-navy-light text-white gap-1.5"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !canProceed()}
              className="bg-accent-red hover:bg-accent-red-dark text-white gap-1.5"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
