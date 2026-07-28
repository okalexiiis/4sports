'use client'

/* COMPONENTS */
import { InternalNavbarTournament } from '@/content/dashboard/organizer/tournaments/content/tournament/page/components/internalNavbarTournament/InternalNavbarTournament'

/* HOOKS */
import { useEffect } from 'react'

/* STORES */
import { useTournamentStore } from '@/content/dashboard/organizer/tournaments/page/stores/tournamentStore/tournamentStore'

export function LayoutTournamentClient({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
}) {
  const initialize = useTournamentStore((s) => s.initialize)

  useEffect(() => {
    initialize(id)
  }, [initialize, id])

  return (
    <div className="flex flex-col w-full h-full">
      <InternalNavbarTournament id={id} />

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  )
}
