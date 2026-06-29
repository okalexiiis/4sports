'use client'

/* ICONS */
import { Moon, Sun } from 'lucide-react'
/* HOOKS */
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const changeTheme = () => {
      setMounted(true)
    }

    changeTheme()
  }, [])

  if (!mounted) return null

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="fixed z-10 p-2 border rounded-full cursor-pointer border-line left-6 bottom-6 bg-surface text-body"
    >
      {resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
