/* COMPONENTS */

import { Footer } from '@/content/shared/ui/footer/Footer'
import { Navbar } from '@/content/shared/ui/navbar/Navbar'
import { ThemeToggle } from '@/content/shared/ui/themeToogle/ThemeToogle'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-dvh">
      <Navbar />
      {children}
      <Footer />
      <ThemeToggle />
    </main>
  )
}
