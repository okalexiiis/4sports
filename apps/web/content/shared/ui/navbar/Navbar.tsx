'use client'

/* COMPONENTS */
import Link from 'next/link'
/* NAVIGATION */
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
/* HOOKS */
import { useEffect, useState } from 'react'
/* ICONS */
import { FourSportsIcon } from '@/content/shared/icons/fourSports/FourSportsIcon'
/* DATA */
import { navbarLinks } from '@/content/shared/ui/navbar/data/navbarLinks'

export function Navbar() {
  const pathname = usePathname()

  const { resolvedTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const linkClasses = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`)

    if (pathname === '/') {
      return `${isActive && !scrolled ? 'text-[#0d0f0c] bg-[#d4f233]' : isActive && scrolled ? 'text-primary-text bg-primary' : !isActive && !scrolled ? 'text-white hover:bg-lucide' : 'text-body hover:bg-lucide'}`
    }

    return `${isActive ? 'text-primary-text bg-primary' : 'text-body hover:bg-lucide'}`
  }

  const buttonClassesLogin = () => {
    if (pathname === '/') {
      return `${scrolled ? 'border-primary text-primary' : 'border-[#d4f233] text-[#d4f233]'}`
    }

    return 'border-primary text-primary'
  }

  const buttonClassesRegister = () => {
    if (pathname === '/') {
      return `${scrolled ? 'border-primary bg-primary text-primary-text' : 'border-[#d4f233] text-[#0d0f0c] bg-[#d4f233]'}`
    }

    return 'border-primary bg-primary text-primary-text'
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const changeTheme = () => {
      setMounted(true)
    }

    changeTheme()
  }, [])

  if (!mounted) return null

  return (
    <header
      className={`fixed top-0 left-0 z-90 transition-all duration-300 px-8 flex justify-between items-center w-full ${scrolled ? 'bg-surface h-16' : 'bg-transparent h-24'}`}
    >
      <div className={`pointer-events-none w-24`}>
        <FourSportsIcon
          wantSpecific={
            !scrolled && pathname === '/' && resolvedTheme === 'light'
              ? { color1: '#d4f233', color2: '#ff4b1f' }
              : undefined
          }
        />
      </div>

      <nav className="flex gap-4">
        {navbarLinks.map((link, index) => (
          <Link
            href={link.href}
            key={index}
            className={`text-sm font-semibold transition-all duration-300 px-3 py-1 rounded-full ${linkClasses(link.href)}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex gap-4">
        <Link
          href={'/login'}
          className={`w-full h-fit py-2 px-4 text-sm rounded-xl font-semibold border-2 backdrop-blur-lg bg-transparent ${buttonClassesLogin()}`}
        >
          Ingresar
        </Link>
        <Link
          href={'/register'}
          className={`w-full h-fit py-2 px-4 text-sm rounded-xl font-semibold border-2 ${buttonClassesRegister()}`}
        >
          Registrarse
        </Link>
      </div>
    </header>
  )
}
