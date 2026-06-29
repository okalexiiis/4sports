'use client'

/* HOOKS */
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
/* ICONS */
import { FourSports } from '@/content/shared/icons/fourSports/FourSports'

export function FourSportsIcon({
  wantSpecific,
}: {
  wantSpecific?: { color1: string; color2: string }
}) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const changeTheme = () => {
      setMounted(true)
    }

    changeTheme()
  }, [])

  if (!mounted) return null

  return (
    <FourSports
      primaryColor={
        wantSpecific ? wantSpecific.color1 : resolvedTheme === 'dark' ? '#d4f233' : '#5a8a00'
      }
      secondaryColor={
        wantSpecific ? wantSpecific.color2 : resolvedTheme === 'dark' ? '#ff4b1f' : '#c93a12'
      }
    />
  )
}
