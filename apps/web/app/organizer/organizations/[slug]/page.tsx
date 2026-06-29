/* COMPONENTS */
import { OrganizerOrganizationContent } from "@/content/dashboard/organizer/organizations/content/organization/page/OrganizerOrganizationContent";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <OrganizerOrganizationContent slug={slug} />;
}
