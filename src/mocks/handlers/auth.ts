import { http, HttpResponse } from 'msw'
import { MOCK_USER, MOCK_TOKENS } from '@/mocks/fixtures/auth'

export const authHandlers = [
  http.post('/api/auth/jwt/create/', () =>
    HttpResponse.json(MOCK_TOKENS)),

  http.post('/api/auth/jwt/refresh/', () =>
    HttpResponse.json({ access: MOCK_TOKENS.access })),

  http.post('/api/auth/jwt/verify/', () =>
    HttpResponse.json({})),

  http.get('/api/auth/users/me/', () =>
    HttpResponse.json(MOCK_USER)),
]
