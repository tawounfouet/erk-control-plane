import { fetchJSON } from './client'
import type { UserSession } from '@/lib/types/admin.types'
import type { PaginatedResponse } from '@/lib/types/common.types'

export function listUserSessions(
  userId: string,
): Promise<PaginatedResponse<UserSession>> {
  const params = new URLSearchParams({ user: userId })
  return fetchJSON(`/api/auth/sessions/?${params}`)
}

export async function revokeSession(sessionId: string): Promise<void> {
  await fetchJSON(`/api/auth/sessions/${sessionId}/revoke/`, {
    method: 'POST',
  })
}
