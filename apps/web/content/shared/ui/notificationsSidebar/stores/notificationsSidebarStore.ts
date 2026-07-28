import { create } from 'zustand'

type UIState = {
  expanded: boolean
  toggleNotificationsSidebar: () => void
  setNotificationsSidebar: (value: boolean) => void

  trigger: {
    total: number
  } | null
  setTrigger: (data: { total: number }) => void
}

export const useNotificationsSidebarStore = create<UIState>((set) => ({
  expanded: false,
  toggleNotificationsSidebar: () => set((state) => ({ expanded: !state.expanded })),
  setNotificationsSidebar: (value) => set({ expanded: value }),

  trigger: {
    total: 0,
  },
  setTrigger: (data: { total: number }) => set({ trigger: data }),
}))
