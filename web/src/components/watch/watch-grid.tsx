'use client'

import { useState } from 'react'
import { Play, Eye, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const categories = ['All', 'Beauty', 'Food', 'Fashion', 'K-Culture', 'Unboxing', 'Factory Tour']

const mockVideos = [
  {
    id: 'v1',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Top 10 Korean Skincare Products You Need to Try in 2026',
    channel: 'BeautyGuru',
    category: 'Beauty',
    views: '1.2M',
    duration: '12:45',
    thumbnail: null,
  },
  {
    id: 'v2',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Korean Instant Noodle Taste Test — 15 Brands Compared',
    channel: 'FoodieExplorer',
    category: 'Food',
    views: '890K',
    duration: '18:30',
    thumbnail: null,
  },
  {
    id: 'v3',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Inside a Korean Cosmetics Factory — How K-Beauty is Made',
    channel: 'FactoryTourKR',
    category: 'Factory Tour',
    views: '650K',
    duration: '22:10',
    thumbnail: null,
  },
  {
    id: 'v4',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Korean Street Fashion Haul 2026 — Dongdaemun Edition',
    channel: 'StyleKorea',
    category: 'Fashion',
    views: '430K',
    duration: '15:20',
    thumbnail: null,
  },
  {
    id: 'v5',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'K-Pop Merch Unboxing — BTS & BLACKPINK Collectibles',
    channel: 'HallyuFan',
    category: 'K-Culture',
    views: '2.1M',
    duration: '8:55',
    thumbnail: null,
  },
  {
    id: 'v6',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Korean Red Ginseng — Health Benefits & Best Brands',
    channel: 'HealthKR',
    category: 'Food',
    views: '340K',
    duration: '14:00',
    thumbnail: null,
  },
  {
    id: 'v7',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Traditional Korean Ceramics — Artisan Workshop Visit',
    channel: 'CraftKorea',
    category: 'K-Culture',
    views: '210K',
    duration: '20:15',
    thumbnail: null,
  },
  {
    id: 'v8',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Best Korean Sunscreens Ranked — Dermatologist Review',
    channel: 'DermDoc',
    category: 'Beauty',
    views: '1.5M',
    duration: '16:40',
    thumbnail: null,
  },
  {
    id: 'v9',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Korean Snack Box Unboxing — 20 Items from Korea',
    channel: 'UnboxJoy',
    category: 'Unboxing',
    views: '780K',
    duration: '11:25',
    thumbnail: null,
  },
]

export function WatchGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered = activeCategory === 'All'
    ? mockVideos
    : mockVideos.filter((v) => v.category === activeCategory)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-navy text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="relative aspect-video bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-accent-red transition-colors">
                  <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-navy line-clamp-2 group-hover:text-accent-red transition-colors">
                {video.title}
              </h3>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span className="font-medium">{video.channel}</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {video.views}
                </span>
              </div>
              <Badge variant="secondary" className="mt-2 text-xs">
                {video.category}
              </Badge>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
