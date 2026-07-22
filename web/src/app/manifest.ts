export default function manifest() {
  return {
    name: 'LoveKorea.Us',
    short_name: 'LoveKorea',
    description: "Korea's Gateway to the U.S., Japan & China — Discover verified Korean products, brands, and businesses.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0B2E59',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
