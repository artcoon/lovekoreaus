import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'

export const metadata: Metadata = {
  title: 'Terms of Service — LoveKorea.us',
  description: 'Terms and conditions for using LoveKorea.us marketplace.',
}

export default function TermsPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <section className="bg-navy py-14">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
            <p className="mt-2 text-white/60">Last updated: July 2026</p>
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using LoveKorea.us (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">2. Platform Description</h2>
              <p>LoveKorea.us is a B2B marketplace connecting Korean manufacturers, brands, and distributors with global buyers. We provide listing, discovery, and communication services but do not directly participate in transactions between sellers and buyers.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">3. User Accounts</h2>
              <p>Users must provide accurate information when creating accounts. Seller accounts are subject to verification. You are responsible for maintaining the security of your account credentials.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">4. Seller Obligations</h2>
              <p>Sellers must provide accurate product information, maintain valid certifications where claimed, respond to buyer inquiries in a timely manner, and comply with all applicable export and trade regulations.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">5. Buyer Obligations</h2>
              <p>Buyers must use the Platform for legitimate business purposes and not misuse seller contact information. Inquiries must be genuine and made in good faith.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">6. Intellectual Property</h2>
              <p>All content on the Platform, including design, text, and graphics, is the property of LoveKorea.us or its content providers and is protected by copyright laws. Seller-uploaded content remains the property of the respective sellers.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">7. Limitation of Liability</h2>
              <p>LoveKorea.us is not responsible for transactions between buyers and sellers. We do not guarantee the quality, safety, or legality of listed products. Use the Platform at your own discretion.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">8. Contact</h2>
              <p>For questions about these Terms, contact us at <a href="mailto:legal@lovekorea.us" className="text-accent-red hover:underline">legal@lovekorea.us</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <GlobalFooter />
    </>
  )
}
