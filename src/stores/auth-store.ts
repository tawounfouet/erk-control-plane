import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types/auth.types'
import { clearTokens, setOnRefreshFailed } from '@/lib/api/client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => {
        clearTokens()
        set({ user: null, isAuthenticated: false, isLoading: false })
      },
    }),
    {
      name: 'eurekanet-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

setOnRefreshFailed(() => {
  useAuthStore.getState().logout()
})
