import { ApiError } from './errors'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

let accessToken: string | null = null
let refreshToken: string | null = localStorage.getItem('refresh_token')
let refreshPromise: Promise<string | null> | null = null

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

export function getRefreshToken() {
  return refreshToken
}

export function setOnRefreshFailed(cb: () => void) {
  onRefreshFailed = cb
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T
  const body = await response.text()
  if (!body) return undefined as T
  if (response.headers.get('content-type')?.includes('json')) {
    return JSON.parse(body) as T
  }
  return body as T
}

async function performTokenRefresh(): Promise<string | null> {
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
    if (data.refresh) {
      refreshToken = data.refresh
      localStorage.setItem('refresh_token', data.refresh)
    }
    return data.access
  } catch {
    return null
  }
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = performTokenRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export function restoreAccessToken(): Promise<string | null> {
  return refreshAccessToken()
}

export async function fetchJSON<T>(
  url: string,
  opts?: RequestInit & { timeout?: number; skipAuthRefresh?: boolean },
): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && opts?.body instanceof FormData
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
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

    if (res.status === 401 && refreshToken && !opts?.skipAuthRefresh) {
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

    return parseResponse<T>(res)
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
  return parseResponse<T>(res)
}

export function getBaseUrl(): string {
  return BASE_URL
}
