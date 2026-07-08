import { fetchJSONWithoutAuth, fetchJSON, setTokens, clearTokens } from './client'
import type { User, LoginResponse, TokenRefresh } from '@/lib/types/auth.types'

export type { User, LoginResponse, TokenRefresh }

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await fetchJSONWithoutAuth<LoginResponse>('/api/auth/jwt/create/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setTokens(data.access, data.refresh)
  return data
}

export async function refresh(refreshToken: string): Promise<TokenRefresh> {
  const data = await fetchJSONWithoutAuth<TokenRefresh>('/api/auth/jwt/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
  })
  return data
}

export async function verify(accessToken: string): Promise<void> {
  await fetchJSONWithoutAuth('/api/auth/jwt/verify/', {
    method: 'POST',
    body: JSON.stringify({ token: accessToken }),
  })
}

export async function getMe(): Promise<User> {
  return fetchJSON<User>('/api/auth/users/me/')
}

export async function resetPassword(email: string): Promise<void> {
  await fetchJSONWithoutAuth('/api/auth/users/reset_password/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function confirmResetPassword(uid: string, token: string, newPassword: string): Promise<void> {
  await fetchJSONWithoutAuth('/api/auth/users/reset_password_confirm/', {
    method: 'POST',
    body: JSON.stringify({ uid, token, new_password: newPassword }),
  })
}

export function logout(): void {
  clearTokens()
}
