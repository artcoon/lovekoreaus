'use client'

import { useState } from 'react'
import { Play, Eye, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const categories = ['All', 'Beauty', 'Food', 'Fashion', 'K-Pop', 'Health', 'Tech']

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

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg">No videos in this category yet</p>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((video) => {
          const ytId = video.youtube_id || video.youtubeId || ''
          const thumb = video.thumbnail || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
          return (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${ytId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="relative aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={thumb}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="w-14 h-14 rounded-full bg-accent-red flex items-center justify-center shadow-lg">
                    <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded font-mono">
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
          )
        })}
      </div>
    </div>
  )
}
