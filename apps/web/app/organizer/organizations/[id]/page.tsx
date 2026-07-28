/* COMPONENTS */
import { OrganizerOrganizationContent } from '@/content/dashboard/organizer/organizations/content/organization/page/OrganizerOrganizationContent'

export default async function OrganizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <OrganizerOrganizationContent id={id} />
}
