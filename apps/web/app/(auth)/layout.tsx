'use client'

/* COMPONENTS */
import { ThemeToggle } from '@/content/shared/ui/themeToogle/ThemeToogle'
import Link from 'next/link'
import Image from 'next/image'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* ICONS */
import { House } from 'lucide-react'

/* HOOKS */
import { useEffect } from 'react'

/* IMAGES */
import balls1 from '@/content/auth/images/balls1.jpg'

/* LIBS */
import { motion } from 'framer-motion'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
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
    <motion.div
      className="flex overflow-hidden min-h-dvh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      exit={{ opacity: 0 }}
    >
      <Link
        className="absolute z-50 p-2 border rounded-full left-6 top-6 text-body border-line bg-surface"
        href={'/'}
      >
        <House className="size-4" />
      </Link>

      <div className="flex w-full overflow-x-hidden overflow-y-auto max-h-dvh h-dvh">
        <div className="hidden w-full h-full transition-all duration-1000 md:block">
          <Image
            src={balls1}
            alt="Cancha de fútbol"
            quality={70}
            preload
            className="object-cover object-left w-full h-full transition-all duration-1000"
          />
        </div>

        <div className="flex items-center w-full h-full px-6 transition-all duration-1000 md:px-10 lg:w-1/3 lg:max-w-1/3 lg:min-w-1/3 md:w-1/2 md:max-w-1/2 md:min-w-1/2">
          <div className="w-full">{children}</div>
        </div>
      </div>

      <ThemeToggle />
    </motion.div>
  )
}
