import { create } from 'zustand'

interface Announcement {
  announcement: {
    isActivated: boolean | null
    announceType: 'ok' | 'error' | 'warning' | 'info' | null
    message: string | null
  }

  setAnnouncement: (announcement: {
    isActivated: boolean | null
    announceType: 'ok' | 'error' | 'warning' | 'info' | null
    message: string | null
  }) => void
}

export const useAnnouncement = create<Announcement>((set) => ({
  announcement: {
    isActivated: null,
    announceType: null,
    message: null,
  },

  setAnnouncement: (announcement) => set({ announcement }),
}))
