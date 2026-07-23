import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — LoveKorea.us',
  description: 'Privacy policy for LoveKorea.us marketplace.',
}

export default function PrivacyPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <section className="bg-navy py-14">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-2 text-white/60">Last updated: July 2026</p>
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly (name, email, company details), usage data (pages visited, searches), and technical data (IP address, browser type, device information).</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">2. How We Use Your Information</h2>
              <p>We use collected information to operate and improve the Platform, facilitate connections between buyers and sellers, send service-related communications, and analyze usage patterns to enhance user experience.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">3. Information Sharing</h2>
              <p>We share your information only with: sellers you choose to contact, service providers who assist in operating the Platform, and authorities when required by law. We do not sell personal data to third parties.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures including encryption, secure authentication, and regular security audits to protect your data. However, no method of transmission is 100% secure.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">5. Cookies</h2>
              <p>We use cookies and similar technologies to maintain sessions, remember preferences, and analyze usage. You can control cookie settings through your browser preferences.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">6. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time. Contact us to exercise these rights.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-navy mb-3">7. Contact</h2>
              <p>For privacy-related inquiries, contact us at <a href="mailto:privacy@lovekorea.us" className="text-accent-red hover:underline">privacy@lovekorea.us</a>.</p>
            </section>
          </div>
        </div>
      </main>
      <GlobalFooter />
    </>
  )
}
