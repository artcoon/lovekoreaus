'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Play, Eye, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { trackVideoPlay } from '@/lib/analytics'

export function WatchPreview({ videos, title, subtitle }: { videos?: any[]; title?: string; subtitle?: string }) {
  const t = useTranslations()
  const items = videos?.length ? videos.slice(0, 6).map((v: any) => ({
    id: v.id,
    youtubeId: v.youtube_id || v.youtubeId || '',
    title: v.title || '',
    channel: v.channel_name || v.channel || '',
    category: v.category || 'K-Pop',
    views: formatViews(v.view_count ?? v.views ?? 0),
    duration: formatDuration(v.duration ?? 0),
    thumbnail: v.thumbnail_url || v.thumbnail || `https://img.youtube.com/vi/${v.youtube_id || v.youtubeId}/maxresdefault.jpg`,
  })) : [
    { id: 'v-kpop-1', youtubeId: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE', channel: 'officialpsy', category: 'K-Pop', views: '5.3B', duration: '4:12', thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg' },
    { id: 'v-kpop-2', youtubeId: 'IHNzOHi8sJg', title: 'BLACKPINK - DDU-DU DDU-DU', channel: 'BLACKPINK', category: 'K-Pop', views: '2.2B', duration: '3:29', thumbnail: 'https://img.youtube.com/vi/IHNzOHi8sJg/maxresdefault.jpg' },
    { id: 'v-kpop-3', youtubeId: 'gdZLi9oWNZg', title: 'BTS - Dynamite', channel: 'HYBE LABELS', category: 'K-Pop', views: '1.8B', duration: '3:43', thumbnail: 'https://img.youtube.com/vi/gdZLi9oWNZg/maxresdefault.jpg' },
    { id: 'v-kpop-4', youtubeId: 'ioNng3aEcAA', title: 'BLACKPINK - How You Like That', channel: 'BLACKPINK', category: 'K-Pop', views: '1.3B', duration: '3:01', thumbnail: 'https://img.youtube.com/vi/ioNng3aEcAA/maxresdefault.jpg' },
    { id: 'v-kpop-5', youtubeId: 'WMweEpGlu_U', title: 'BTS - Butter', channel: 'HYBE LABELS', category: 'K-Pop', views: '900M', duration: '3:23', thumbnail: 'https://img.youtube.com/vi/WMweEpGlu_U/maxresdefault.jpg' },
    { id: 'v-kpop-6', youtubeId: '11cta61wiQ8', title: 'NewJeans - Hype Boy', channel: 'HYBE LABELS', category: 'K-Pop', views: '250M', duration: '2:59', thumbnail: 'https://img.youtube.com/vi/11cta61wiQ8/maxresdefault.jpg' },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">
            {title || t('watch.sectionTitle')}
          </h2>
          <Link
            href="/watch"
            className="text-sm text-navy hover:text-accent-red font-medium transition-colors"
          >
            {t('common.viewAll')} →
          </Link>
        </div>
        {subtitle ? (
          <p className="text-sm sm:text-base text-gray-500 -mt-4 mb-8 max-w-2xl">
            {subtitle}
          </p>
        ) : null}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackVideoPlay(video.youtubeId, video.title, video.category)}
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
                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <Clock className="h-3 w-3" />
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
                <Badge variant="secondary" className="mt-2 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100">
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
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (v >= 1_000) return `${Math.round(v / 1_000)}K`
  return String(v)
}

function formatDuration(d: number | string): string {
  if (typeof d === 'string') return d
  const m = Math.floor(d / 60)
  const s = d % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
