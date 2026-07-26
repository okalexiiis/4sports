import { create } from 'zustand'
import { PORT } from '../../consts/PORT'
import { MeData } from '../../../../../api/src/modules/auth/auth.entity'

interface AuthState {
  data: MeData | null
  status: 'empty' | 'authenticated' | 'unauthenticated' | 'error' | 'onboarding'

  setUser: (
    user: MeData | null,
    status: 'empty' | 'authenticated' | 'unauthenticated' | 'error' | 'onboarding',
  ) => void
  initialize: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  data: null,
  status: 'empty',

  setUser: (data, status) => set({ data, status }),

  initialize: async () => {
    // Evitar volver a pedir /me
    if (get().status !== 'empty') return

    try {
      const request = await fetch(`${PORT}/v1/me`, {
        credentials: 'include',
      })

      if (request.ok) {
        const response = await request.json()

        if (!response.data.onboarding_pending) {
          set({
            data: response.data,
            status: 'authenticated',
          })

          console.log('Sesión iniciada')
          console.log(response.data)
        } else {
          set({
            data: response.data,
            status: 'onboarding',
          })

          console.log('Sesión iniciada, falta onboarding')
          console.log(response.data)
        }
      } else {
        set({
          data: null,
          status: 'unauthenticated',
        })
      }
    } catch {
      set({
        data: null,
        status: 'error',
      })
    }
  },

  logout: async () => {
    try {
      const res = await fetch(`${PORT}/auth/sign-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (res.ok) {
        set({
          data: null,
          status: 'unauthenticated',
        })
      } else {
        set({
          data: null,
          status: 'error',
        })
      }
    } catch {
      set({
        data: null,
        status: 'error',
      })
    }
  },
}))
