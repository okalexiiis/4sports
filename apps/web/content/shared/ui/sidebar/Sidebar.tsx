'use client'

/* COMPONENTS */
import { ThemeToggleButtons } from '@/content/shared/ui/sidebar/components/theme/ThemeToogleButtons'
import Image from 'next/image'

/* HOOKS */
import { useState, useEffect } from 'react'

/* ICONS */
import { LogOut, ChevronsLeft, ChevronsRight, UserRound, ChevronsUpDown } from 'lucide-react'
import { FourSportsIcon } from '@/content/shared/icons/fourSports/FourSportsIcon'

/* NAVIGATION */
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

/* STORES */
import { useSidebarStore } from '@/content/shared/ui/sidebar/stores/SidebarStore'
import { useNotificationsSidebarStore } from '@/content/shared/ui/notificationsSidebar/stores/notificationsSidebarStore'
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

/* TYPES */
import { LinkSidebar } from '@/content/shared/ui/sidebar/types/LinkSidebar'

/* LIBS */
import { AnimatePresence, motion } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export function Sidebar({ links }: { links: LinkSidebar[] }) {
  const router = useRouter()
  const pathname = usePathname()

  const { expanded, toggleSidebar } = useSidebarStore()
  const { toggleNotificationsSidebar } = useNotificationsSidebarStore()

  const [mounted, setMounted] = useState(false)
  const [openTooltip, setOpenTooltip] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)

  const logout = useAuthStore((s) => s.logout)
  const data = useAuthStore((s) => s.data)

  const linkClasses = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(`${path}/`)

    return `${isActive ? 'text-primary bg-surface border border-line' : 'hover:bg-surface/70 border border-transparent text-ink'}`
  }

  useEffect(() => {
    const changeTheme = () => {
      setMounted(true)
    }

    changeTheme()
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')

    const update = () => setIsMobile(media.matches)

    update()

    media.addEventListener('change', update)

    return () => media.removeEventListener('change', update)
  }, [])

  if (!mounted) return null

  return (
    <>
      <aside
        className={`flex flex-col z-60 transition-all bg-background duration-300 justify-between h-dvh border-r border-r-line absolute lg:static ${expanded ? 'w-64 left-0' : 'lg:w-18 w-64 -left-64'}`}
      >
        <div className="flex flex-col w-full h-full p-4">
          <div
            className={`flex items-center mb-16 relative ${expanded ? 'justify-end' : 'lg:justify-center justify-end'}`}
          >
            <div
              className={`transition-all duration-300 pointer-events-none absolute ${expanded ? 'w-24 lg:opacity-100 left-0' : 'left-0 w-24 lg:w-0 lg:opacity-0 lg:-left-64'}`}
            >
              <FourSportsIcon />
            </div>
            <button
              onClick={toggleSidebar}
              className={`p-1 hover:bg-surface hover:border-line border-transparent border rounded transition-all duration-300 cursor-pointer`}
            >
              {expanded ? (
                <ChevronsLeft className="size-4" />
              ) : (
                <ChevronsRight className="size-4" />
              )}
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex flex-col items-center w-full h-full max-h-full gap-2 overflow-x-hidden overflow-y-auto"
          >
            <Tooltip.Provider delayDuration={100}>
              {links.map((link) => (
                <Tooltip.Root
                  key={link.href}
                  open={!expanded ? openTooltip === link.href : false}
                  onOpenChange={(open) => {
                    if (!expanded) {
                      setOpenTooltip(open ? link.href : null)
                    }
                  }}
                >
                  <Tooltip.Trigger asChild>
                    {link.label === 'Notificaciones' ? (
                      <button
                        onClick={toggleNotificationsSidebar}
                        className={`px-[0.70rem] py-2 rounded-xl flex relative group transition-all items-center duration-300 w-full cursor-pointer hover:bg-surface/70 border border-transparent text-ink ${expanded ? 'gap-6' : 'lg:gap-0 gap-6'} `}
                      >
                        <link.icon className="size-4 min-w-4 min-h-4" />

                        <span
                          className={`transition-all duration-300 text-sm text-left ${
                            expanded
                              ? 'w-full opacity-100'
                              : 'lg:w-0 w-fit lg:opacity-0 opacity-100 pointer-events-none'
                          }`}
                        >
                          {link.label}
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className={`px-[0.70rem] py-2 rounded-xl flex relative group transition-all items-center duration-300 w-full ${expanded ? 'gap-6' : 'lg:gap-0 gap-6'} ${linkClasses(
                          link.href,
                        )}`}
                      >
                        <link.icon className="size-4 min-w-4 min-h-4" />

                        <span
                          className={`transition-all duration-300 text-sm ${
                            expanded
                              ? 'w-full opacity-100'
                              : 'lg:w-0 w-fit lg:opacity-0 opacity-100 pointer-events-none'
                          }`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    )}
                  </Tooltip.Trigger>

                  {!expanded && (
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        sideOffset={25}
                        className="px-3 py-1 text-sm font-medium border rounded-full z-70 bg-background text-ink border-line"
                      >
                        {link.label}
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  )}
                </Tooltip.Root>
              ))}
            </Tooltip.Provider>
          </motion.div>
        </div>

        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center w-full gap-4 p-4 overflow-hidden transition-all duration-300 border-t outline-none cursor-pointer hover:bg-surface border-t-line">
              <div
                className={`rounded-full w-10 h-10 min-w-10 min-h-10 flex justify-center items-center bg-surface border relative ${pathname === '/organizer/profile' ? 'border-primary' : 'border-line'}`}
              >
                {data && data.profile?.avatar_url ? (
                  <Image
                    alt="Banner"
                    src={data.profile.avatar_url}
                    quality={70}
                    fill
                    loading="eager"
                    className="object-cover object-center rounded-full"
                  />
                ) : (
                  <UserRound className="size-4" />
                )}
              </div>

              <div className="flex flex-col flex-1 min-w-0 text-left">
                <span className="text-sm font-semibold truncate">
                  {data && data.user.name ? data.user.name : '...'}
                </span>

                <span className="text-xs truncate text-neutral-400">
                  {data && data.user.email ? data.user.email : '...'}
                </span>
              </div>

              <div className="shrink-0">
                <ChevronsUpDown className="size-4 min-w-4 min-h-4" />
              </div>
            </button>
          </DropdownMenu.Trigger>

          <AnimatePresence>
            {open && (
              <DropdownMenu.Portal forceMount>
                <DropdownMenu.Content
                  sideOffset={12}
                  align="end"
                  avoidCollisions
                  side={isMobile ? 'bottom' : 'right'}
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: -12 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="p-2 border shadow-md z-100 min-w-56 rounded-2xl border-line bg-background"
                  >
                    <DropdownMenu.Item
                      onClick={() => router.push('/organizer/profile')}
                      className={`flex items-center gap-3 rounded-xl p-2 text-sm outline-none cursor-pointer mb-2 transition-colors duration-300 border ${pathname === '/organizer/profile' ? 'bg-surface/70 border-line text-primary' : 'hover:bg-surface border-transparent text-body'}`}
                    >
                      <UserRound className="size-4" />
                      Ver perfil
                    </DropdownMenu.Item>

                    <ThemeToggleButtons />

                    <DropdownMenu.Separator className="h-px my-2 bg-line" />

                    <DropdownMenu.Item
                      onClick={logout}
                      className="flex items-center gap-3 p-2 text-sm transition-colors duration-300 outline-none cursor-pointer rounded-xl text-danger hover:bg-red-500/10"
                    >
                      <LogOut className="size-4" />
                      Cerrar sesión
                    </DropdownMenu.Item>
                  </motion.div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            )}
          </AnimatePresence>
        </DropdownMenu.Root>
      </aside>
      <div
        onClick={toggleSidebar}
        className={`absolute w-full top-0 left-0 bg-black/50 h-screen transition-all duration-300 z-50 lg:hidden lg:pointer-events-none ${
          expanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      ></div>
    </>
  )
}
