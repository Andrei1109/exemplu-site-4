import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Instrument_Serif, Inter_Tight } from 'next/font/google'
import { invitation } from '@/lib/invitation/config'
import './globals.css'

const serif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-instrument',
  display: 'swap',
})

const sans = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const { partnerOne, partnerTwo } = invitation.couple

export const metadata: Metadata = {
  title: `${partnerOne} & ${partnerTwo} — ${invitation.filmTitle}`,
  description: `Invitație la nunta lui ${partnerOne} și ${partnerTwo}, 12 iunie 2027. ${invitation.tagline}.`,
  generator: 'v0.app',
  robots: { index: false, follow: false },
  openGraph: {
    title: `${partnerOne} & ${partnerTwo} — ${invitation.filmTitle}`,
    description: invitation.tagline,
    images: invitation.hero.poster ? [invitation.hero.poster.src] : undefined,
    locale: 'ro_RO',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: invitation.theme.colors.ink,
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${serif.variable} ${sans.variable} bg-background`}>
      <body className="film-grain antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
