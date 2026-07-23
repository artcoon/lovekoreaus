import type { Metadata } from 'next'
import { GlobalHeader } from '@/components/layout/global-header'
import { GlobalFooter } from '@/components/layout/global-footer'
import { Shield, Globe, Users, TrendingUp, Award, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — LoveKorea.us',
  description: 'LoveKorea.us connects global buyers with verified Korean brands and manufacturers.',
}

export default function AboutPage() {
  return (
    <>
      <GlobalHeader />
      <main className="flex-1 bg-gray-50">
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">About LoveKorea.us</h1>
            <p className="mt-4 text-white/60 max-w-2xl mx-auto">
              Your trusted gateway to Korean products, brands, and culture.
              We connect global buyers with verified Korean businesses.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-16 space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              LoveKorea.us is the premier B2B marketplace for Korean products, connecting manufacturers, brands,
              and distributors with buyers worldwide. We believe that Korean innovation in beauty, food, fashion,
              technology, and culture deserves a global stage, and we provide the platform to make it happen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-6">What We Do</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: 'Verified Sellers', desc: 'Every business on our platform goes through a verification process to ensure authenticity and reliability.' },
                { icon: Globe, title: 'Global Reach', desc: 'We help Korean brands reach buyers in the US, Japan, China, EU, and Southeast Asia.' },
                { icon: Users, title: 'Direct Connection', desc: 'Buyers can directly contact sellers, request quotes, and build lasting business relationships.' },
                { icon: TrendingUp, title: 'Market Insights', desc: 'Video reviews, buyer ratings, and market data help inform better purchasing decisions.' },
                { icon: Award, title: 'Quality Assurance', desc: 'FDA, HACCP, ISO, and other certification badges help buyers identify quality products.' },
                { icon: Heart, title: 'Korean Culture', desc: 'From K-Beauty to K-Food to K-Pop, we celebrate and promote Korean culture globally.' },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <item.icon className="h-8 w-8 text-accent-red mb-3" />
                  <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-2">Have questions or need assistance? Reach out to us:</p>
            <ul className="text-gray-600 space-y-1">
              <li>Email: <a href="mailto:hello@lovekorea.us" className="text-accent-red hover:underline">hello@lovekorea.us</a></li>
              <li>Website: <a href="https://lovekorea.us" className="text-accent-red hover:underline">lovekorea.us</a></li>
            </ul>
          </section>
        </div>
      </main>
      <GlobalFooter />
    </>
  )
}
