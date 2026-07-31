'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Eye, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { YouTubeEmbed } from '@/components/shared/youtube-embed'
import { trackVideoPlay } from '@/lib/analytics'

export function WatchPreview({ videos, title, subtitle }: { videos?: any[]; title?: string; subtitle?: string }) {
  const t = useTranslations()
  const items = videos?.length ? videos.slice(0, 10).map((v: any) => ({
    id: v.id,
    youtubeId: v.youtube_id || v.youtubeId || '',
    title: v.title || '',
    channel: v.channel_name || v.channel || '',
    category: v.category || 'K-Pop',
    views: formatViews(v.view_count ?? v.views ?? 0),
    duration: formatDuration(v.duration ?? 0),
  })) : [
    { id: 'v-kpop-1', youtubeId: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE', channel: 'officialpsy', category: 'K-Pop', views: '5.3B', duration: '4:12' },
    { id: 'v-kpop-2', youtubeId: 'IHNzOHi8sJs', title: 'BLACKPINK - DDU-DU DDU-DU', channel: 'BLACKPINK', category: 'K-Pop', views: '2.2B', duration: '3:29' },
    { id: 'v-kpop-3', youtubeId: 'gdZLi9oWNZg', title: 'BTS - Dynamite', channel: 'HYBE LABELS', category: 'K-Pop', views: '1.8B', duration: '3:43' },
    { id: 'v-kpop-4', youtubeId: 'ioNng23DkIM', title: 'BLACKPINK - How You Like That', channel: 'BLACKPINK', category: 'K-Pop', views: '1.3B', duration: '3:01' },
    { id: 'v-kpop-5', youtubeId: 'WMweEpGlu_U', title: 'BTS - Butter', channel: 'HYBE LABELS', category: 'K-Pop', views: '900M', duration: '3:23' },
    { id: 'v-kpop-6', youtubeId: '11cta61wi0g', title: 'NewJeans - Hype Boy', channel: 'HYBE LABELS', category: 'K-Pop', views: '250M', duration: '2:59' },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">
            {title || t('watch.sectionTitle')}
          </h2>
          <Link
            href="/k-contents"
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
            <div
              key={video.id}
              onClick={() => trackVideoPlay(video.youtubeId, video.title, video.category)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="relative aspect-video bg-gray-200 overflow-hidden">
                <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} className="rounded-none" />
                <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-0.5 rounded font-mono flex items-center gap-1 pointer-events-none">
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
            </div>
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
