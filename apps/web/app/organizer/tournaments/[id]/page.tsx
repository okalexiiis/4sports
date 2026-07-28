/* COMPONENTS */
import { OrganizerTournamentsContent } from '@/content/dashboard/organizer/tournaments/content/tournament/page/OrganizerTournamentContent'

export default async function OrganizerTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <OrganizerTournamentsContent id={id} />
}
