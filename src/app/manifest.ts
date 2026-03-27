import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OGRewards',
    short_name: 'OGRewards',
    description: 'Scan receipts. Get real cash back.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#00d084',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
