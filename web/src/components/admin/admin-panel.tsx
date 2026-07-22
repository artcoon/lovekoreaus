'use client'

import { useState } from 'react'
import {
  Users, Package, ShieldCheck, MessageSquare, BarChart3,
  Eye, CheckCircle, XCircle, Clock, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const adminStats = [
  { label: 'Total Sellers', value: '284', icon: Users },
  { label: 'Active Products', value: '1,456', icon: Package },
  { label: 'Pending Approvals', value: '12', icon: Clock },
  { label: 'Total Leads', value: '3,890', icon: MessageSquare },
]

const pendingSellers = [
  { name: 'Seoul Snacks Co.', type: 'Manufacturer', category: 'Food & Health', date: '2026-07-20', docs: 3 },
  { name: 'K-Beauty Lab', type: 'Brand', category: 'Beauty', date: '2026-07-19', docs: 5 },
  { name: 'Hanbok Studio', type: 'Small Business', category: 'Fashion', date: '2026-07-18', docs: 2 },
]

const flaggedContent = [
  { type: 'Review', item: 'Suspicious review on Snail Mucin Essence', reason: 'Spam detected', date: '2026-07-21' },
  { type: 'Product', item: 'Unapproved health claims on Red Ginseng listing', reason: 'Policy violation', date: '2026-07-20' },
]

type Tab = 'overview' | 'sellers' | 'content' | 'analytics'

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sellers', label: 'Seller Approvals', icon: ShieldCheck },
    { id: 'content', label: 'Content Review', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {adminStats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{s.label}</span>
                  <s.icon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-2 text-2xl font-bold text-navy">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-navy mb-4">Pending Seller Approvals</h2>
              <div className="space-y-3">
                {pendingSellers.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-navy">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.type} · {s.category} · {s.docs} docs</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white rounded-lg h-8">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 rounded-lg h-8">
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-navy mb-4">Flagged Content</h2>
              <div className="space-y-3">
                {flaggedContent.map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-navy">{f.item}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <Badge variant="outline" className="text-[10px] mr-2">{f.type}</Badge>
                          {f.reason} · {f.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'sellers' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-navy mb-4">All Pending Sellers</h2>
          <p className="text-sm text-gray-500">Full seller management will be connected to Supabase.</p>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-navy mb-4">Content Moderation</h2>
          <p className="text-sm text-gray-500">Content review queue will be connected to Supabase.</p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-navy mb-4">Platform Analytics</h2>
          <p className="text-sm text-gray-500">Analytics dashboard will be connected to Supabase and Vercel Analytics.</p>
        </div>
      )}
    </div>
  )
}
