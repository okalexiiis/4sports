'use client'

/* COMPONENTS */
import { InternalNavbarOrganization } from '@/content/dashboard/organizer/organizations/content/organization/page/components/internalNavbarOrganization/InternalNavbarOrganization'

/* HOOKS */
import { useEffect } from 'react'

/* STORES */
import { useOrganizationStore } from '@/content/dashboard/organizer/organizations/page/stores/organizationStore/organizationStore'

export function LayoutOrganizationClient({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
}) {
  const initialize = useOrganizationStore((s) => s.initialize)

  useEffect(() => {
    initialize(id)
  }, [initialize, id])

  return (
    <div className="flex flex-col w-full h-full">
      <InternalNavbarOrganization id={id} />

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  )
}
