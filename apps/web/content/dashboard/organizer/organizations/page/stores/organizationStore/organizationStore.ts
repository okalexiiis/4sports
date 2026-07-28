import { create } from 'zustand'
import { PORT } from '@/content/shared/consts/PORT'
import { OrgWithRole } from '../../../../../../../../api/src/modules/organizations/organization.entity'

interface OrganizationState {
  organization: OrgWithRole | null
  status: 'empty' | 'finished' | 'error'

  setOrganization: (
    organization: OrgWithRole | null,
    status: 'empty' | 'finished' | 'error',
  ) => void
  initialize: (id: string) => Promise<void>
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  organization: null,
  status: 'empty',

  setOrganization: (organization, status) => set({ organization, status }),

  initialize: async (id) => {
    try {
      const request = await fetch(PORT + `/v1/organizations/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (request.ok) {
        const response = await request.json()
        set({ organization: response.data, status: 'finished' })
      } else {
        set({ organization: null, status: 'error' })
      }
    } catch {
      set({ organization: null, status: 'error' })
    }
  },
}))
