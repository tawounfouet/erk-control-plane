import { ApiError } from './errors'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

let accessToken: string | null = null
let refreshToken: string | null = localStorage.getItem('refresh_token')

let onRefreshFailed: (() => void) | null = null

export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshToken = refresh
  localStorage.setItem('refresh_token', refresh)
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('refresh_token')
}

export function getAccessToken() {
  return accessToken
}

export function setOnRefreshFailed(cb: () => void) {
  onRefreshFailed = cb
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshToken) return null
  try {
    const res = await fetch(`${BASE_URL}/api/auth/jwt/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })
    if (!res.ok) return null
    const data = await res.json()
    accessToken = data.access
    return data.access
  } catch {
    return null
  }
}

export async function fetchJSON<T>(
  url: string,
  opts?: RequestInit & { timeout?: number },
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string>),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const fullUrl = BASE_URL ? `${BASE_URL}${url}` : url

  const controller = new AbortController()
  const timeoutId = opts?.timeout
    ? setTimeout(() => controller.abort(), opts.timeout)
    : undefined

  try {
    let res = await fetch(fullUrl, {
      ...opts,
      headers,
      signal: opts?.signal ?? controller.signal,
    })

    if (res.status === 401 && refreshToken) {
      const newAccess = await refreshAccessToken()
      if (newAccess) {
        headers['Authorization'] = `Bearer ${newAccess}`
        res = await fetch(fullUrl, { ...opts, headers })
      } else {
        clearTokens()
        onRefreshFailed?.()
        throw new ApiError(401, 'Session expired')
      }
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new ApiError(res.status, body)
    }

    return res.json() as Promise<T>
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(0, 'Request timed out')
    }
    throw new ApiError(0, String(err))
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function fetchJSONWithoutAuth<T>(
  url: string,
  opts?: RequestInit,
): Promise<T> {
  const fullUrl = BASE_URL ? `${BASE_URL}${url}` : url
  const res = await fetch(fullUrl, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts?.headers as Record<string, string>),
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<T>
}

export function getBaseUrl(): string {
  return BASE_URL
}
