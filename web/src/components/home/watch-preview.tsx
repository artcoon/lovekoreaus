import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Card } from '@/components/ui/card'
import { Play } from 'lucide-react'

const mockVideos = [
  {
    id: '1',
    title: 'Top 10 Korean Skincare Products 2026',
    channel: 'K-Beauty Guru',
    views: '1.2M',
    thumbnail: null,
    duration: '12:34',
  },
  {
    id: '2',
    title: 'Korean Street Food Tour in Seoul',
    channel: 'FoodieTrip',
    views: '890K',
    thumbnail: null,
    duration: '18:22',
  },
  {
    id: '3',
    title: 'Innisfree Factory Tour — How It\'s Made',
    channel: 'Brand Stories',
    views: '450K',
    thumbnail: null,
    duration: '8:15',
  },
  {
    id: '4',
    title: 'Korean Fashion Haul — Best Brands',
    channel: 'StyleKorea',
    views: '670K',
    thumbnail: null,
    duration: '15:47',
  },
]

export function WatchPreview({ videos }: { videos?: any[] }) {
  const t = useTranslations()
  const items = videos?.length ? videos.map((v: any) => ({
    id: v.id,
    title: v.title_en || v.title || 'Video',
    channel: v.channel_name || v.channel || '',
    views: v.view_count || v.views || '0',
    thumbnail: v.thumbnail_url || v.thumbnail || null,
    duration: v.duration || '',
  })) : mockVideos

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">
            {t('watchSection.title')}
          </h2>
          <Link
            href="/watch"
            className="text-sm text-navy hover:text-accent-red font-medium transition-colors"
          >
            {t('watchSection.viewAll')} →
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          {t('watchSection.subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((video) => (
            <Link key={video.id} href={`/watch/${video.id}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all border-border/40">
                <div className="relative aspect-video bg-navy/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-red/90 text-white group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-navy transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{video.channel}</span>
                    <span className="text-xs text-muted-foreground">{video.views} views</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
