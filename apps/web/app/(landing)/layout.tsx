'use client'

/* COMPONENTS */
import { Footer } from '@/content/shared/ui/footer/Footer'
import { Navbar } from '@/content/shared/ui/navbar/Navbar'
import { ThemeToggle } from '@/content/shared/ui/themeToogle/ThemeToogle'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* HOOKS */
import { useEffect } from 'react'

/* LIBS */
import { motion } from 'framer-motion'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const initialize = useAuthStore((s) => s.initialize)
  const status = useAuthStore((s) => s.status)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/organizer/home')
    }
  }, [status, router])

  if (status === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center w-full gap-4 min-h-dvh"
      >
        <p>A ocurrido un error al ingresar, porfavor intenta nuevamente más tarde</p>

        <DinamicButton
          action={() => router.replace('/login')}
          twClassName="w-fit"
          type="filled"
          label="Regresar a Iniciar sesión"
        />
      </motion.div>
    )
  }

  return (
    <main className="flex flex-col min-h-dvh">
      <Navbar />
      {children}
      <Footer />
      <ThemeToggle />
    </main>
  )
}
