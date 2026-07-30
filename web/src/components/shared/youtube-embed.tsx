'use client'

import { useState } from 'react'
import { Play, X } from 'lucide-react'

interface YouTubeEmbedProps {
  youtubeId: string
  title?: string
  className?: string
  autoplay?: boolean
}

export function YouTubeEmbed({ youtubeId, title = 'YouTube video', className = '', autoplay = false }: YouTubeEmbedProps) {
  const [active, setActive] = useState(autoplay)

  if (!youtubeId) return null

  return (
    <div className={`relative w-full bg-gray-900 rounded-2xl overflow-hidden ${className}`}>
      {active ? (
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
          <button
            onClick={() => setActive(false)}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            aria-label="Close video"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setActive(true)}
          className="group relative w-full aspect-video flex items-center justify-center overflow-hidden"
          aria-label={`Play ${title}`}
        >
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="relative z-10 w-16 h-16 rounded-full bg-accent-red flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-7 w-7 text-white fill-white ml-1" />
          </div>
        </button>
      )}
    </div>
  )
}
