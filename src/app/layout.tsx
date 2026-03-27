import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'OGRewards',
  description: 'Scan receipts. Get real cash back.',
  applicationName: 'OGRewards',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OGRewards',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#00d084',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
