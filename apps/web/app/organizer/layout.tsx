'use client'

/* COMPONENTS */
import { Sidebar } from '@/content/shared/ui/sidebar/Sidebar'
import { NotificationsSidebar } from '@/content/shared/ui/notificationsSidebar/NotificationsSidebar'
import { Modal } from '@/content/shared/ui/modal/Modal'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'
import { LoaderPage } from '@/content/shared/ui/loaderPage/LoaderPage'
import { OnboardingContent } from '@/content/auth/onboarding/OnboardingContent'

/* DATA */
import { organizerSidebarLinks } from '@/content/shared/ui/sidebar/data/organizerSidebarLinks'

/* HOOKS */
import { useEffect } from 'react'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* LIBS */
import { motion } from 'framer-motion'

/* STORES */
import { useSidebarStore } from '@/content/shared/ui/sidebar/stores/SidebarStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const expanded = useSidebarStore((s) => s.expanded)
  const initialize = useAuthStore((s) => s.initialize)
  const status = useAuthStore((s) => s.status)
  const data = useAuthStore((s) => s.data)

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status === 'empty' || status === 'unauthenticated') {
    return <LoaderPage />
  }

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

  if (!data) {
    return <LoaderPage />
  }

  if (data.onboarding_pending || status === 'onboarding') {
    return <OnboardingContent />
  }

  return (
    <motion.div
      className="relative flex overflow-x-hidden overflow-y-hidden min-h-dvh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <Sidebar links={organizerSidebarLinks} />
      <Modal />
      <div
        className={`flex flex-col h-dvh w-full transition-all duration-300 ${
          expanded ? 'lg:left-64 lg:w-[calc(100%-16rem)]' : 'lg:left-16 lg:w-[calc(100%-4rem)] z-40'
        }`}
      >
        {children}
      </div>
      <NotificationsSidebar />
    </motion.div>
  )
}
