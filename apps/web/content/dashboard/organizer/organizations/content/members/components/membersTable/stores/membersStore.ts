import { create } from 'zustand'

interface MembersFilterStore {
  filter: {
    page: number
    perPage: number
  } | null
  setFilter: (data: { page: number; perPage: number }) => void
}

export const useMembersFilter = create<MembersFilterStore>((set) => ({
  filter: {
    page: 0,
    perPage: 10,
  },
  setFilter: (data: { page: number; perPage: number }) => set({ filter: data }),
}))
