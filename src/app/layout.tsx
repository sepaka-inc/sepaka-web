import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'
import './globals.css'

// ── Bodoni Moda — display typeface ───────────────────────
// axes: ['opsz'] enables optical sizing — critical for Bodoni
// at large sizes it uses thinner hairlines, at small sizes thicker
// This is what makes it look intentional rather than clunky
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
  display: 'swap',
  axes: ['opsz'],
})

// ── Inter — functional typeface ──────────────────────────
// weight 300 for body copy — gives that luxury lightness
// weight 400 for UI elements
// weight 500 for labels and buttons
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

// ── Metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'SEPAKA — Worn in. Never out.',
    template: '%s — SEPAKA',
  },
  description:
    'Premium unisex leather jackets. Full-grain lamb and camel leather, ' +
    'crafted in Calgary. Built to last decades.',
  keywords: [
    'leather jacket',
    'luxury leather jacket',
    'unisex leather jacket',
    'Calgary leather',
    'SEPAKA',
    'full-grain lamb leather',
    'camel leather jacket',
  ],
  authors: [{ name: 'SEPAKA', url: 'https://sepaka.ca' }],
  creator: 'SEPAKA',
  openGraph: {
    title: 'SEPAKA — Worn in. Never out.',
    description: 'Premium unisex leather jackets built to last decades.',
    url: 'https://sepaka.ca',
    siteName: 'SEPAKA',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEPAKA — Worn in. Never out.',
    description: 'Premium unisex leather jackets built to last decades.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  metadataBase: new URL('https://sepaka.ca'),
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

// ── Root layout ───────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white text-void font-sans antialiased selection:bg-leather selection:text-white">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Analytics />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
