import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

export function RoleGuard() {
  const { user } = useAuthStore()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!user.is_staff) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
