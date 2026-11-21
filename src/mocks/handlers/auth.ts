import { http, HttpResponse } from 'msw'
import { MOCK_USER, MOCK_TOKENS } from '@/mocks/fixtures/auth'

export const authHandlers = [
  http.post('/api/auth/jwt/create/', () =>
    HttpResponse.json(MOCK_TOKENS)),

  http.post('/api/auth/jwt/refresh/', () =>
    HttpResponse.json({ access: MOCK_TOKENS.access, refresh: MOCK_TOKENS.refresh })),

  http.post('/api/auth/logout/', () =>
    new HttpResponse(null, { status: 204 })),

  http.post('/api/auth/users/activation/', () =>
    new HttpResponse(null, { status: 204 })),

  http.post('/api/auth/users/resend_activation/', () =>
    new HttpResponse(null, { status: 204 })),

  http.post('/api/auth/users/reset_password/', () =>
    new HttpResponse(null, { status: 204 })),

  http.post('/api/auth/users/reset_password_confirm/', () =>
    new HttpResponse(null, { status: 204 })),

  http.post('/api/auth/jwt/verify/', () =>
    HttpResponse.json({})),

  http.get('/api/auth/users/me/', () =>
    HttpResponse.json(MOCK_USER)),
]
