import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types/auth.types'
import { setOnRefreshFailed } from '@/lib/api/client'
import { logout as revokeSession } from '@/lib/api/auth'
import { queryClient } from '@/lib/query-client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setAnonymous: () => void
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
      setAnonymous: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
      logout: () => {
        void revokeSession()
        queryClient.clear()
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
