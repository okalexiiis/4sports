import { create } from 'zustand'
import { PORT } from '../../consts/PORT'
import { MeData } from '../../../../../api/src/modules/auth/auth.entity'

interface AuthState {
  data: MeData | null
  status: 'empty' | 'authenticated' | 'unauthenticated' | 'error'

  setUser: (
    user: MeData | null,
    status: 'empty' | 'authenticated' | 'unauthenticated' | 'error',
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
      const res = await fetch(`${PORT}/v1/me`, {
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()

        set({
          data,
          status: 'authenticated',
        })

        console.log('Sesión iniciada')
      } else {
        set({
          data: null,
          status: 'unauthenticated',
        })

        console.log('Sesión no iniciada')
      }
    } catch {
      set({
        data: null,
        status: 'error',
      })

      console.log('Error al iniciar sesión')
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

        console.log('Sesión cerrada')
      } else {
        set({
          data: null,
          status: 'error',
        })

        console.log('Error al cerrar sesión')
      }
    } catch {
      set({
        data: null,
        status: 'error',
      })

      console.log('Error al cerrar sesión')
    }
  },
}))
