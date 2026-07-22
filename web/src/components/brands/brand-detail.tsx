'use client'

import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star, ShieldCheck, Globe, MapPin, Play, MessageSquare,
  ExternalLink, Mail, Phone, Package, Users, Award
} from 'lucide-react'

const mockBrand = {
  name: 'Hana Cosmetics Co.',
  slug: 'hana-cosmetics',
  category: 'Beauty & Cosmetics',
  type: 'Manufacturer',
  location: 'Seoul, South Korea',
  description: `Hana Cosmetics is a leading Korean skincare manufacturer with over 15 years of experience exporting to global markets. We specialize in innovative formulations using natural Korean ingredients like snail mucin, ginseng, and Jeju volcanic clay. Our state-of-the-art facility holds FDA, ISO 22716, and GMP certifications.`,
  rating: 4.8,
  reviewCount: 124,
  productCount: 45,
  yearFounded: 2011,
  employees: '50-100',
  markets: ['US', 'Japan', 'China', 'EU', 'Southeast Asia'],
  certs: ['FDA Registered', 'ISO 22716', 'GMP', 'Cruelty-Free'],
  verified: true,
  website: 'https://hanacosmetics.co.kr',
  email: 'export@hanacosmetics.co.kr',
  phone: '+82-2-1234-5678',
  govtSupport: true,
}

const mockProducts = [
  { slug: 'snail-mucin-essence', name: 'Snail Mucin 96% Essence', price: '$15.99', rating: 4.8 },
  { slug: 'ginseng-eye-cream', name: 'Ginseng Brightening Eye Cream', price: '$28.00', rating: 4.7 },
  { slug: 'jeju-clay-mask', name: 'Jeju Volcanic Clay Mask', price: '$12.99', rating: 4.5 },
  { slug: 'centella-toner', name: 'Centella Asiatica Calming Toner', price: '$18.50', rating: 4.6 },
]

const mockVideos = [
  { title: 'Hana Cosmetics Factory Tour 2026', channel: 'FactoryTourKR', views: '450K' },
  { title: 'Snail Mucin Essence Honest Review', channel: 'BeautyGuru', views: '1.2M' },
]

export function BrandDetail({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-navy to-navy-light" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-navy">
              {mockBrand.name[0]}
            </div>
            <div className="flex-1 mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-navy">{mockBrand.name}</h1>
                {mockBrand.verified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                <span>{mockBrand.category}</span>
                <span>·</span>
                <span>{mockBrand.type}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {mockBrand.location}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 flex gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-navy">{mockBrand.rating}</span>
              <span className="text-sm text-gray-400">({mockBrand.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="h-4 w-4" />
              {mockBrand.productCount} products
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              {mockBrand.markets.length} markets
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              {mockBrand.employees} employees
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
        {/* Left content */}
        <div className="space-y-8">
          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-navy mb-4">About</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{mockBrand.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {mockBrand.certs.map((c) => (
                <Badge key={c} variant="secondary" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  {c}
                </Badge>
              ))}
            </div>
            {mockBrand.govtSupport && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">KOTRA / Government Export Support Participant</span>
              </div>
            )}
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy">Products</h2>
              <Link href="/products" className="text-sm text-accent-red hover:underline">View All</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {mockProducts.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`}>
                  <div className="group rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                    <div className="aspect-square rounded-lg bg-gray-100 mb-3 flex items-center justify-center text-2xl font-bold text-gray-300">
                      {p.name[0]}
                    </div>
                    <h3 className="text-sm font-medium text-navy group-hover:text-accent-red transition-colors line-clamp-1">{p.name}</h3>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-navy">{p.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-500">{p.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-navy mb-4">Videos</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {mockVideos.map((v, i) => (
                <div key={i} className="group rounded-xl border border-gray-100 overflow-hidden">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-accent-red transition-colors">
                      <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-navy line-clamp-1">{v.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{v.channel} · {v.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="mt-8 lg:mt-0 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-navy mb-4">Contact Information</h3>
            <div className="space-y-3">
              <a href={mockBrand.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent-red">
                <ExternalLink className="h-4 w-4" />
                {mockBrand.website.replace('https://', '')}
              </a>
              <a href={`mailto:${mockBrand.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-accent-red">
                <Mail className="h-4 w-4" />
                {mockBrand.email}
              </a>
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {mockBrand.phone}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-navy mb-3">Target Markets</h3>
              <div className="flex flex-wrap gap-2">
                {mockBrand.markets.map((m) => (
                  <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-navy mb-3">Company Info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Founded</dt>
                  <dd className="font-medium text-navy">{mockBrand.yearFounded}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Employees</dt>
                  <dd className="font-medium text-navy">{mockBrand.employees}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium text-navy">{mockBrand.type}</dd>
                </div>
              </dl>
            </div>

            <Button className="w-full mt-6 bg-accent-red hover:bg-accent-red-dark text-white rounded-xl" size="lg">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact This Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
