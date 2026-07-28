/* COMPONENTS */
import { LayoutTournamentClient } from './layout-tournament-client'

export default async function TournamentsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <LayoutTournamentClient id={id}>{children}</LayoutTournamentClient>
}
