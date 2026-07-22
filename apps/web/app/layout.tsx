/* COMPONENTS */
import { Announcement } from '@/content/shared/ui/annoucement/Announcement'
import { Providers } from './providers'

/* METADATA */
import type { Metadata } from 'next'

/* FONTS */
import { Bebas_Neue, DM_Sans, Inter } from 'next/font/google'

/* STYLES */
import './globals.css'

/* UTILS */
import { cn } from '../lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  subsets: ['latin'],
  weight: ['400'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: '4Sports',
  description: 'Gestión de torneos deportivos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={cn(
        'h-full',
        'antialiased',
        bebasNeue.variable,
        dmSans.variable,
        'font-sans',
        inter.variable,
      )}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Announcement />
          {children}
        </Providers>
      </body>
    </html>
  )
}
