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
import { usePathname, useRouter } from 'next/navigation'

/* STORES */
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isInLoginRegister = pathname === '/login' || pathname === '/register'

  const { initialize, status } = useAuthStore()

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
  } else {
    return (
      <motion.div
        className="flex overflow-hidden min-h-dvh"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        exit={{ opacity: 0 }}
      >
        {isInLoginRegister && (
          <Link
            className="absolute z-50 p-2 border rounded-full left-6 top-6 text-body border-line bg-surface"
            href={'/'}
          >
            <House className="size-4" />
          </Link>
        )}

        <div
          className={`max-h-dvh h-dvh w-full overflow-x-hidden flex ${pathname === '/organizer-plans' ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
        >
          <div
            className={`h-full md:block hidden transition-all duration-1000 ${pathname === '/organizer-plans' ? 'w-0' : 'w-full'}`}
          >
            <Image
              src={balls1}
              alt="Cancha de fútbol"
              quality={70}
              preload
              className={`object-cover object-left h-full transition-all duration-1000 ${pathname === '/organizer-plans' ? 'w-0' : 'w-full'}`}
            />
          </div>

          <div
            className={`h-full w-full flex md:px-10 px-6 transition-all duration-1000 ${isInLoginRegister ? 'lg:w-1/3 lg:max-w-1/3 lg:min-w-1/3 md:w-1/2 md:max-w-1/2 md:min-w-1/2 items-center' : pathname === '/onboarding' ? 'md:max-w-3/4 md:min-w-3/4 md:w-3/4 lg:w-1/2 lg:max-w-1/2 lg:min-w-1/2 py-10 md:py-0 md:items-center' : 'py-10 md:py-0 md:items-center md:max-w-full md:min-w-full md:w-full'}`}
          >
            <div className={`w-full ${pathname === '/onboarding' && 'min-h-0 h-full md:h-fit'}`}>
              {children}
            </div>
          </div>
        </div>

        <ThemeToggle />
      </motion.div>
    )
  }
}
