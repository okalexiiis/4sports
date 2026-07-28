'use client'

/* COMPONENTS */
import Link from 'next/link'
import Image from 'next/image'

/* ICONS */
import { Image as Photo } from 'lucide-react'

/* NAVIGATION */
import { usePathname } from 'next/navigation'

/* STORES */
import { useTournamentStore } from '@/content/dashboard/organizer/tournaments/page/stores/tournamentStore/tournamentStore'

type LinkType = {
  label: string
  href: string
}

export function InternalNavbarTournament({ id }: { id: string }) {
  const pathname = usePathname()

  const tournament = useTournamentStore((s) => s.tournament)
  const status = useTournamentStore((s) => s.status)

  const tournamentLinks: LinkType[] = [
    {
      label: 'Gestionar',
      href: `/organizer/tournaments/${id}`,
    },
    {
      label: 'Solicitudes',
      href: `/organizer/tournaments/${id}/registrations`,
    },
    {
      label: 'Partidos',
      href: `/organizer/tournaments/${id}/matches`,
    },
    {
      label: 'Posiciones',
      href: `/organizer/tournaments/${id}/positions`,
    },
    {
      label: 'Equipos',
      href: `/organizer/tournaments/${id}/teams`,
    },
  ]

  if (status === 'empty' || status === 'error') {
    return (
      <div className="flex items-end justify-between px-10 pt-6 border-b border-line">
        <div className="flex items-center gap-4 pb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl border-line min-h-12 min-w-12 bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient">
            <Photo className="text-transparent size-6 min-h-6 min-w-6" />
          </div>

          <div className="bg-linear-to-r from-surface via-surface-hover to-surface bg-skeleton-gradient rounded-xl">
            <p className="text-lg font-bold text-left text-transparent">Nombre del torneo</p>
            <p className="text-sm font-semibold text-transparent">Modo de juego</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end justify-between px-10 pt-6 border-b border-line">
      <div className="flex items-center gap-4 pb-6">
        {tournament?.banner_url ? (
          <div className="relative w-12 h-12 min-w-12 min-h-12">
            <Image
              alt="Organización"
              src={tournament.banner_url}
              quality={70}
              fill
              loading="eager"
              className="object-cover object-center border rounded-xl border-line"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-12 h-12 rounded-xl border-line min-h-12 min-w-12 bg-surface">
            <Photo className="size-6 min-h-6 min-w-6" />
          </div>
        )}

        <div>
          <p className="text-lg font-bold text-left text-ink">{tournament?.name ?? '...'}</p>
          <p className="text-sm font-semibold text-primary">{tournament?.format?.name ?? '...'}</p>
        </div>
      </div>

      <nav className="flex justify-end gap-2 h-fit">
        {tournamentLinks.map((link) => {
          const active = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-t-xl border text-sm transition-all duration-300 border-b-0 border-line ${active ? 'border-line border-b-0 text-primary' : 'border-transparent border-b-0 hover:bg-surface/70 text-ink'}`}
            >
              {link.label}

              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-px translate-y-full bg-background" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
