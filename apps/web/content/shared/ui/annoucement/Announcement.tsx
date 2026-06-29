'use client'

/* LIBS */
import { motion } from 'framer-motion'
/* HOOKS */
import { useEffect } from 'react'
/* STORES */
import { useAnnouncement } from './stores/announcementStore'

export function Announcement() {
  const { announcement, setAnnouncement } = useAnnouncement()

  useEffect(() => {
    if (announcement.isActivated) {
      const timer = setTimeout(() => {
        setAnnouncement({
          isActivated: false,
          announceType: announcement.announceType,
          message: announcement.message,
        })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [setAnnouncement, announcement.isActivated, announcement.announceType, announcement.message])

  return (
    <motion.div
      className={`
      fixed top-4 right-4 z-100 
      flex items-center justify-center
      w-[calc(100%-2rem)] md:w-95
      p-4 rounded-xl 
      border 
      ${announcement.announceType === 'ok' ? 'bg-success-bg text-success border-success-border' : announcement.announceType === 'warning' ? 'bg-warn-bg text-warn border-warn-border' : announcement.announceType === 'info' ? 'bg-info-bg text-info border-info-border' : 'bg-danger-bg text-danger border-danger-border'}
    `}
      initial={{ opacity: 0, y: -40 }}
      animate={{
        opacity: announcement.isActivated ? 1 : 0,
        y: announcement.isActivated ? 0 : -40,
        transition: {
          duration: 0.45,
          ease: 'easeInOut',
        },
      }}
      exit={{
        opacity: 0,
        y: -40,
        transition: {
          duration: 0.35,
          ease: 'easeInOut',
        },
      }}
    >
      <p className="text-sm font-medium">{announcement.message}</p>
    </motion.div>
  )
}
