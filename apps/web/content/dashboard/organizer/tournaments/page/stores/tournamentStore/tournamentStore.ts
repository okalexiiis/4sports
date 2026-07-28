import { create } from 'zustand'
import { PORT } from '@/content/shared/consts/PORT'
import { Tournament } from '../../../../../../../../api/src/modules/tournaments/tournament.entity'

interface TournamentState {
  tournament: Tournament | null
  status: 'empty' | 'finished' | 'error' | string

  setTournament: (
    tournament: Tournament | null,
    status: 'empty' | 'finished' | 'error' | string,
  ) => void
  initialize: (id: string) => Promise<void>
}

export const useTournamentStore = create<TournamentState>((set) => ({
  tournament: null,
  status: 'empty',

  setTournament: (tournament, status) => set({ tournament, status }),

  initialize: async (id) => {
    try {
      const request = await fetch(PORT + `/v1/tournaments/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (request.ok) {
        const response = await request.json()
        set({ tournament: response.data, status: 'finished' })
      } else {
        set({ tournament: null, status: 'error' })
      }
    } catch {
      set({ tournament: null, status: 'error' })
    }
  },
}))
