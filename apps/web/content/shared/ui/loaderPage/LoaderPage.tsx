'use client'

/* ICONS */
import { Loader } from 'lucide-react'

/* LIBS */
import { motion } from 'framer-motion'

export function LoaderPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center w-full min-h-dvh"
    >
      <Loader className="size-12 animate-spin text-primary" />
    </motion.div>
  )
}
