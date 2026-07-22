'use client'

import { Link } from '@/i18n/navigation'
import {
  Package, MessageSquare, Eye, TrendingUp, Star, Users,
  Plus, Settings, BarChart3, FileText, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Total Products', value: '12', icon: Package, change: '+2 this month' },
  { label: 'New Leads', value: '8', icon: MessageSquare, change: '3 unread' },
  { label: 'Profile Views', value: '1,240', icon: Eye, change: '+18% vs last month' },
  { label: 'Avg. Rating', value: '4.8', icon: Star, change: '124 reviews' },
]

const recentLeads = [
  { name: 'John Smith', company: 'US Foods Inc.', product: 'Red Ginseng Extract', type: 'Quote', status: 'new', date: '2h ago' },
  { name: 'Tanaka Yuki', company: 'Tokyo Beauty Store', product: 'Snail Mucin Essence', type: 'Inquiry', status: 'read', date: '1d ago' },
  { name: 'Emily Chen', company: 'Shanghai Import Co.', product: 'Multiple Products', type: 'Partnership', status: 'replied', date: '3d ago' },
]

const recentProducts = [
  { name: 'Snail Mucin 96% Essence', status: 'active', views: 890, leads: 5 },
  { name: 'Ginseng Eye Cream', status: 'active', views: 456, leads: 2 },
  { name: 'Jeju Clay Mask', status: 'draft', views: 0, leads: 0 },
]

export function DashboardContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Seller Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Hana Cosmetics Co.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Button className="bg-accent-red hover:bg-accent-red-dark text-white rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{s.label}</span>
              <s.icon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-navy">{s.value}</div>
            <p className="mt-1 text-xs text-gray-400">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy">Recent Leads</h2>
            <a href="#" className="text-sm text-accent-red hover:underline flex items-center gap-1">
              View All <ChevronRight className="h-3 w-3" />
            </a>
          </div>
          <div className="space-y-4">
            {recentLeads.map((lead, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center text-sm font-bold text-navy">
                  {lead.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-navy">{lead.name}</span>
                    <Badge
                      variant={lead.status === 'new' ? 'default' : 'secondary'}
                      className={`text-[10px] ${lead.status === 'new' ? 'bg-accent-red text-white' : ''}`}
                    >
                      {lead.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {lead.company} · {lead.product} · {lead.type}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{lead.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy">Your Products</h2>
            <a href="#" className="text-sm text-accent-red hover:underline flex items-center gap-1">
              Manage <ChevronRight className="h-3 w-3" />
            </a>
          </div>
          <div className="space-y-4">
            {recentProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-300">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{p.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.views}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{p.leads} leads</span>
                  </div>
                </div>
                <Badge variant={p.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-navy mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            { icon: Package, label: 'Add Product', desc: 'List a new product' },
            { icon: FileText, label: 'Edit Profile', desc: 'Update business info' },
            { icon: BarChart3, label: 'View Analytics', desc: 'Check performance' },
            { icon: TrendingUp, label: 'Upgrade Plan', desc: 'Get more features' },
          ].map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-accent-red/30 transition-colors text-center"
            >
              <action.icon className="h-6 w-6 text-navy" />
              <span className="text-sm font-medium text-navy">{action.label}</span>
              <span className="text-xs text-gray-400">{action.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
