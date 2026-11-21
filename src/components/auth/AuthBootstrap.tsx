import { useEffect } from 'react'
import { getRefreshToken, restoreAccessToken } from '@/lib/api/client'
import { getMe, logout } from '@/lib/api/auth'
import { useAuthStore } from '@/stores/auth-store'

export function AuthBootstrap() {
  const { setUser, setAnonymous } = useAuthStore()

  useEffect(() => {
    let active = true

    async function restoreSession() {
      if (!getRefreshToken()) {
        if (active) setAnonymous()
        return
      }

      try {
        const access = await restoreAccessToken()
        if (!access) throw new Error('Refresh expiré')
        const user = await getMe()
        if (!user.is_staff) throw new Error('Accès Control Plane refusé')
        if (active) setUser(user)
      } catch {
        await logout().catch(() => undefined)
        if (active) setAnonymous()
      }
    }

    void restoreSession()
    return () => {
      active = false
    }
  }, [setAnonymous, setUser])

  return null
}
