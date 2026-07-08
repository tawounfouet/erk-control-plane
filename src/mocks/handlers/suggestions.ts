import { http, HttpResponse } from 'msw'
import { MOCK_SUGGESTIONS, MOCK_SUGGESTION_DETAIL, MOCK_SUGGESTION_STATS } from '@/mocks/fixtures/suggestions'

export const suggestionsHandlers = [
  http.get('/api/suggestions/suggestions/', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    let results = MOCK_SUGGESTIONS
    if (status) results = results.filter((s) => s.status === status)
    return HttpResponse.json({ count: results.length, next: null, previous: null, results })
  }),

  http.get('/api/suggestions/suggestions/:id/', ({ params }) => {
    if (params.id === 's-001') return HttpResponse.json(MOCK_SUGGESTION_DETAIL)
    const s = MOCK_SUGGESTIONS.find((s) => s.id === params.id)
    if (!s) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(s)
  }),

  http.get('/api/suggestions/suggestions/my_suggestions/', () =>
    HttpResponse.json({ count: 0, next: null, previous: null, results: [] })),

  http.get('/api/suggestions/suggestions/pending/', () =>
    HttpResponse.json({ count: 0, next: null, previous: null, results: [] })),

  http.get('/api/suggestions/suggestions/statistics/', () =>
    HttpResponse.json(MOCK_SUGGESTION_STATS)),
]
