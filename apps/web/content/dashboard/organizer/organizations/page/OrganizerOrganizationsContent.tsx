'use client'

/* COMPONENTS */
import { SectionContainer } from '@/content/shared/ui/sectionContainer/SectionContainer'
import { OrganizationCard } from './components/organizationCard/OrganizationCard'
import { DinamicButton } from '@/content/shared/form/dinamicButton/DinamicButton'

/* ICONS */
import { Plus } from 'lucide-react'

/* NAVIGATION */
import { useRouter } from 'next/navigation'

/* STORES */
import { useAuthStore } from '@/content/shared/stores/autenticationStore/autenticationStore'

export function OrganizerOrganizationsContent() {
  const router = useRouter()

  const data = useAuthStore((s) => s.data)
  const organizationIdActiveContext =
    data?.active_context?.organization_id ?? 'Sin organización activa'

  const organizations =
    data?.organizations?.map((o) => {
      if (o.id === organizationIdActiveContext) {
        return {
          id: o.id,
          name: o.name,
          role: o.role,
          active: true,
        }
      }

      return {
        id: o.id,
        name: o.name,
        role: o.role,
        active: false,
      }
    }) ?? []

  return (
    <SectionContainer>
      <div className="relative flex flex-col">
        <div className="sticky top-0 z-30 p-6 bg-background">
          <div className="flex items-center justify-between mb-2">
            <p className="text-5xl font-bebas text-ink">
              Mis <span className="text-primary">Organizaciones</span>
            </p>

            <DinamicButton
              action={() => router.push('/organizer/organizations/add')}
              twClassName="w-fit py-1 text-sm"
              type={'filled'}
              label="Nueva organización"
              icon={<Plus className="size-4 min-h-4 min-w-4" />}
            />
          </div>

          <p className="text-xl font-extralight">
            Selecciona una organización para gestionar sus torneos
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          {organizations.map((o, i) => (
            <OrganizationCard key={i} name={o.name} isSelected={o.active} role={o.role} />
          )) ?? <p>No se encontrarón organizaciones</p>}
        </div>
      </div>
    </SectionContainer>
  )
}
