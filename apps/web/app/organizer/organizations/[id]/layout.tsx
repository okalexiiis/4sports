/* COMPONENTS */
import { LayoutOrganizationClient } from './layout-organization-client'

export default async function OrganizationsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <LayoutOrganizationClient id={id}>{children}</LayoutOrganizationClient>
}
