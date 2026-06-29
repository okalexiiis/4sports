/* COMPONENTS */
import { OrganizerTournamentsContent } from "@/content/dashboard/organizer/tournaments/content/tournament/page/OrganizerTournamentContent";

export default async function OrganizerTournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <OrganizerTournamentsContent slug={slug} />;
}
