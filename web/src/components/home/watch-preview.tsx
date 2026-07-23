'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Play, Eye, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function WatchPreview({ videos }: { videos?: any[] }) {
  const t = useTranslations()
  const items = videos?.length ? videos.slice(0, 3).map((v: any) => ({
    id: v.id,
    youtubeId: v.youtube_id || v.youtubeId || '',
    title: v.title || '',
    channel: v.channel_name || v.channel || '',
    category: v.category || 'K-Beauty',
    views: formatViews(v.view_count ?? v.views ?? 0),
    duration: formatDuration(v.duration ?? 0),
    thumbnail: v.thumbnail_url || v.thumbnail || `https://img.youtube.com/vi/${v.youtube_id || v.youtubeId}/maxresdefault.jpg`,
  })) : [
    { id: 'v1', youtubeId: 'NVHHeGmTfPk', title: 'KOREAN SKINCARE HALL OF FAME 2025', channel: 'Liah Yoo', category: 'Beauty', views: '1.2M', duration: '12:45', thumbnail: 'https://img.youtube.com/vi/NVHHeGmTfPk/maxresdefault.jpg' },
    { id: 'v5', youtubeId: 'p6pgPi27yxw', title: 'BLACKPINK World Tour Merch Unboxing', channel: 'HallyuFan', category: 'K-Pop', views: '2.1M', duration: '8:55', thumbnail: 'https://img.youtube.com/vi/p6pgPi27yxw/maxresdefault.jpg' },
    { id: 'v7', youtubeId: '-lp2Kt6RJkQ', title: 'I Bought the CRAZIEST Tech from South Korea', channel: 'MrWhoseTheBoss', category: 'Tech', views: '5M', duration: '20:15', thumbnail: 'https://img.youtube.com/vi/-lp2Kt6RJkQ/maxresdefault.jpg' },
  ]

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">
            {t('watch.sectionTitle')}
          </h2>
          <Link
            href="/watch"
            className="text-sm text-navy hover:text-accent-red font-medium transition-colors"
          >
            {t('common.viewAll')} →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="relative aspect-video bg-gray-200 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          ))}
        </div>
      </div>
    </section>
  )
}

function formatViews(v: number | string): string {
  if (typeof v === 'string') return v
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return String(v)
}

function formatDuration(d: number | string): string {
  if (typeof d === 'string') return d
  const m = Math.floor(d / 60)
  const s = d % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
