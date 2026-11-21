import { describe, it, expect, beforeEach } from 'vitest'
import { delay, http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import {
  activate,
  confirmResetPassword,
  getMe,
  login,
  resetPassword,
  resendActivation,
} from '@/lib/api/auth'
import {
  fetchJSON,
  setTokens,
  clearTokens,
  getRefreshToken,
  setOnRefreshFailed,
} from '@/lib/api/client'

beforeEach(() => {
  clearTokens()
})

describe('login', () => {
  it('returns tokens on valid credentials', async () => {
    const data = await login('admin@eureka-residences.com', 'password')
    expect(data.access).toBeTruthy()
    expect(data.refresh).toBeTruthy()
  })

  it('throws on invalid credentials', async () => {
    server.use(
      http.post('/api/auth/jwt/create/', () =>
        HttpResponse.json({ detail: 'No active account found' }, { status: 401 })),
    )
    await expect(login('wrong@email.com', 'wrong')).rejects.toThrow()
  })
})

describe('getMe', () => {
  it('returns the current user', async () => {
    setTokens('test-access', 'test-refresh')
    const user = await getMe()
    expect(user.email).toBe('admin@eureka-residences.com')
    expect(user.is_staff).toBe(true)
  })
})

describe('public account lifecycle', () => {
  it('accepts empty 204 responses without parsing JSON', async () => {
    await expect(resetPassword('person@example.com')).resolves.toBeUndefined()
    await expect(activate('uid', 'token')).resolves.toBeUndefined()
    await expect(resendActivation('person@example.com')).resolves.toBeUndefined()
    await expect(
      confirmResetPassword('uid', 'token', 'NewPassword123!'),
    ).resolves.toBeUndefined()
  })
})

describe('fetchJSON token refresh', () => {
  it('retries on 401 and succeeds after refresh', async () => {
    let callCount = 0
    server.use(
      http.get('/api/test-endpoint/', () => {
        callCount++
        if (callCount === 1) return new HttpResponse(null, { status: 401 })
        return HttpResponse.json({ success: true })
      }),
      http.post('/api/auth/jwt/refresh/', () =>
        HttpResponse.json({ access: 'new-access-token' })),
    )

    setTokens('expired-token', 'valid-refresh')
    const result = await fetchJSON<{ success: boolean }>('/api/test-endpoint/')
    expect(result.success).toBe(true)
    expect(callCount).toBe(2)
  })

  it('calls onRefreshFailed when refresh fails', async () => {
    let refreshFailedCalled = false
    setOnRefreshFailed(() => { refreshFailedCalled = true })

    server.use(
      http.get('/api/test-endpoint-2/', () => new HttpResponse(null, { status: 401 })),
      http.post('/api/auth/jwt/refresh/', () =>
        HttpResponse.json({ detail: 'Token expired' }, { status: 401 })),
    )

    setTokens('expired-token', 'expired-refresh')
    await expect(fetchJSON('/api/test-endpoint-2/')).rejects.toThrow('Session expired')
    expect(refreshFailedCalled).toBe(true)
  })

  it('shares one rotating refresh across concurrent 401 responses', async () => {
    let refreshCount = 0
    server.use(
      http.get('/api/concurrent-endpoint/', ({ request }) => {
        if (request.headers.get('Authorization') === 'Bearer expired-token') {
          return new HttpResponse(null, { status: 401 })
        }
        return HttpResponse.json({ success: true })
      }),
      http.post('/api/auth/jwt/refresh/', async () => {
        refreshCount++
        await delay(20)
        return HttpResponse.json({
          access: 'rotated-access',
          refresh: 'rotated-refresh',
        })
      }),
    )

    setTokens('expired-token', 'initial-refresh')
    const responses = await Promise.all([
      fetchJSON<{ success: boolean }>('/api/concurrent-endpoint/'),
      fetchJSON<{ success: boolean }>('/api/concurrent-endpoint/'),
    ])

    expect(responses.every((response) => response.success)).toBe(true)
    expect(refreshCount).toBe(1)
    expect(getRefreshToken()).toBe('rotated-refresh')
  })
})
