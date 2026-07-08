import { http, HttpResponse } from 'msw'
import { MOCK_OPERATIONS, MOCK_OPERATION_DETAIL, MOCK_OPERATION_STATS } from '@/mocks/fixtures/operations'

export const operationsHandlers = [
  http.get('/api/operations/operations/', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    let results = MOCK_OPERATIONS
    if (status) results = results.filter((o) => o.status === status)
    return HttpResponse.json({ count: results.length, next: null, previous: null, results })
  }),

  http.get('/api/operations/operations/:id/', ({ params }) => {
    if (params.id === 'o-001') return HttpResponse.json(MOCK_OPERATION_DETAIL)
    const op = MOCK_OPERATIONS.find((o) => o.id === params.id)
    if (!op) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(op)
  }),

  http.get('/api/operations/operations/my_operations/', () =>
    HttpResponse.json(MOCK_OPERATIONS)),

  http.get('/api/operations/operations/assigned_to_me/', () =>
    HttpResponse.json(MOCK_OPERATIONS.filter((o) => o.assigned_to_name))),

  http.get('/api/operations/operations/pending/', () =>
    HttpResponse.json(MOCK_OPERATIONS.filter((o) => o.status === 'PENDING_VALIDATION'))),

  http.get('/api/operations/operations/in_progress/', () =>
    HttpResponse.json(MOCK_OPERATIONS.filter((o) => o.status === 'IN_PROGRESS'))),

  http.get('/api/operations/operations/overdue/', () =>
    HttpResponse.json(MOCK_OPERATIONS.filter((o) => o.priority === 'URGENT'))),

  http.get('/api/operations/operations/statistics/', () =>
    HttpResponse.json(MOCK_OPERATION_STATS)),
]
