import { http, HttpResponse } from 'msw'
import { MOCK_DASHBOARD_STATS, MOCK_REVENUE, MOCK_GLOBAL_SEARCH } from '@/mocks/fixtures/manager'

export const managerHandlers = [
  http.get('/api/manager/dashboard/stats/', () =>
    HttpResponse.json(MOCK_DASHBOARD_STATS)),

  http.get('/api/manager/dashboard/revenue/', () =>
    HttpResponse.json(MOCK_REVENUE)),

  http.get('/api/manager/search/', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''
    if (q.length < 2) return HttpResponse.json({ query: q, count: 0, results: [] })
    return HttpResponse.json({ ...MOCK_GLOBAL_SEARCH, query: q })
  }),

  http.get('/api/manager/notifications/', () =>
    HttpResponse.json([])),
]
