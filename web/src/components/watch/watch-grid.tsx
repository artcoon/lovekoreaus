'use client'

import { useState } from 'react'
import { Eye, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { YouTubeEmbed } from '@/components/shared/youtube-embed'
import { trackVideoPlay } from '@/lib/analytics'

const categories = [
  { value: 'All', label: 'All' },
  { value: 'K-Beauty', label: 'K-Beauty' },
  { value: 'K-Food', label: 'K-Food' },
  { value: 'K-Fashion', label: 'K-Fashion' },
  { value: 'K-Pop', label: 'K-Pop' },
  { value: 'K-Health', label: 'K-Health' },
  { value: 'K-Culture', label: 'K-Culture' },
]

interface Video {
  id: string
  youtube_id?: string
  youtubeId?: string
  title: string
  channel: string
  category: string
  views: string
  duration: string
  thumbnail?: string | null
}

export function WatchGrid({ videos }: { videos?: Video[] }) {
  const allVideos = videos ?? []
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered = activeCategory === 'All'
    ? allVideos
    : allVideos.filter((v) => v.category === activeCategory)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.value
                ? 'bg-navy text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg">No videos in this category yet</p>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => {
          const ytId = video.youtube_id || video.youtubeId || ''
          return (
            <div
              key={video.id}
              onClick={() => trackVideoPlay(ytId, video.title, video.category)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="relative aspect-video bg-gray-200 overflow-hidden">
                <YouTubeEmbed youtubeId={ytId} title={video.title} className="rounded-none" />
                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded font-mono pointer-events-none">
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
