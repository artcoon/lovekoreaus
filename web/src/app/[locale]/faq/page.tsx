import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { HelpCircle, ShieldCheck, Package, CreditCard, Globe, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ — LoveKorea.us',
  description: 'Frequently asked questions about LoveKorea.us marketplace.',
}

const faqs = [
  {
    icon: HelpCircle,
    question: 'What is LoveKorea.us?',
    answer: 'LoveKorea.us is a B2B marketplace that connects verified Korean manufacturers, brands, and distributors with global buyers. We help Korean businesses reach buyers in the US, Japan, China, EU, and beyond.',
  },
  {
    icon: ShieldCheck,
    question: 'How are sellers verified?',
    answer: 'Every seller application is reviewed by our team. Approved sellers can display verification badges, certifications (FDA, HACCP, ISO, etc.), and export credentials to build buyer trust.',
  },
  {
    icon: Package,
    question: 'What products can I find?',
    answer: 'Our marketplace features Korean products across K-Beauty, K-Food, K-Fashion, K-Pop merchandise, health & wellness, technology, home & living, traditional crafts, and more.',
  },
  {
    icon: Globe,
    question: 'Which markets do you support?',
    answer: 'Sellers can list target markets including the US, Japan, China, EU, Southeast Asia, Middle East, Latin America, and Africa. Buyers from anywhere can browse and contact sellers.',
  },
  {
    icon: CreditCard,
    question: 'Is it free to use?',
    answer: 'Browsing products and contacting sellers is free. Sellers can start with a free plan and upgrade to Pro or Premium for more visibility, products, and features.',
  },
  {
    icon: Mail,
    question: 'How do I contact support?',
    answer: 'For general questions, email hello@lovekorea.us. Sellers can reach sellers@lovekorea.us. We typically respond within 24 business hours.',
  },
]

export default function FAQPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <section className="relative bg-navy py-14 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
            style={{ backgroundImage: "url('/images/landscapes/hanok-village-10.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 to-navy/90" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
            <p className="mt-2 text-white/80">Everything you need to know about LoveKorea.us</p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-red/10 flex items-center justify-center shrink-0">
                    <faq.icon className="h-5 w-5 text-accent-red" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-navy mb-2">{faq.question}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <GlobalFooter />
    </>
  )
}
