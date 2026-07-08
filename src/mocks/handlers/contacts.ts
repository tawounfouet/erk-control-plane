import { http, HttpResponse } from 'msw'
import { MOCK_CONTACTS_CARNET } from '@/mocks/fixtures/contacts'

export const contactsHandlers = [
  http.get('/api/contacts/', () =>
    HttpResponse.json({ count: 0, next: null, previous: null, results: [] })),

  http.get('/api/contacts/carnet/', () =>
    HttpResponse.json(MOCK_CONTACTS_CARNET)),

  http.get('/api/contacts/emergency/', () =>
    HttpResponse.json(MOCK_CONTACTS_CARNET.emergency)),

  http.get('/api/contacts/public/', () =>
    HttpResponse.json([])),
]
