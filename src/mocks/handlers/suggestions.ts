import { http, HttpResponse } from 'msw'
import { MOCK_SUGGESTION_DETAIL, MOCK_SUGGESTIONS, MOCK_SUGGESTION_STATS } from '@/mocks/fixtures/suggestions'

const page = <T,>(results: T[]) => ({ count: results.length, next: null, previous: null, results })
const response = MOCK_SUGGESTION_DETAIL.responses[0]
const comment = MOCK_SUGGESTION_DETAIL.comments[0]
const attachment = { id: 'sa-001', title: 'Plan fontaine', description: '', file: '/media/plan.pdf', file_url: '/media/plan.pdf', file_type: 'document', created_at: '2026-06-16T10:00:00Z' }
const envelope = <T,>(data: T, message = 'Opération réussie') => ({ success: true, message, data })

export const suggestionsHandlers = [
  http.get('/api/suggestions/suggestions/', ({ request }) => { const status = new URL(request.url).searchParams.get('status'); return HttpResponse.json(page(status ? MOCK_SUGGESTIONS.filter((item) => item.status === status) : MOCK_SUGGESTIONS)) }),
  http.post('/api/suggestions/suggestions/', () => HttpResponse.json(envelope({ ...MOCK_SUGGESTION_DETAIL, id: 's-new' }), { status: 201 })),
  http.get('/api/suggestions/suggestions/my_suggestions/', () => HttpResponse.json(page(MOCK_SUGGESTIONS.slice(0, 1)))),
  http.get('/api/suggestions/suggestions/pending/', () => HttpResponse.json(MOCK_SUGGESTIONS.filter((item) => item.status === 'submitted'))),
  http.get('/api/suggestions/suggestions/under_review/', () => HttpResponse.json(MOCK_SUGGESTIONS.filter((item) => item.status === 'under_review'))),
  http.get('/api/suggestions/suggestions/implemented/', () => HttpResponse.json(MOCK_SUGGESTIONS.filter((item) => item.status === 'implemented'))),
  http.get('/api/suggestions/suggestions/statistics/', () => HttpResponse.json(MOCK_SUGGESTION_STATS)),
  http.get('/api/suggestions/suggestions/:id/', () => HttpResponse.json(MOCK_SUGGESTION_DETAIL)),
  http.patch('/api/suggestions/suggestions/:id/', async ({ request }) => HttpResponse.json({ ...MOCK_SUGGESTION_DETAIL, ...(await request.json() as object) })),
  http.delete('/api/suggestions/suggestions/:id/', () => new HttpResponse(null, { status: 204 })),
  http.post('/api/suggestions/suggestions/:id/change_status/', async ({ request }) => HttpResponse.json(envelope({ ...MOCK_SUGGESTION_DETAIL, status: (await request.json() as { status: string }).status }))),
  http.post('/api/suggestions/suggestions/:id/assign/', () => HttpResponse.json(envelope({ ...MOCK_SUGGESTION_DETAIL, assigned_to: 'u-staff', assigned_to_name: 'Agent Eureka' }))),
  http.post('/api/suggestions/suggestions/:id/add_response/', () => HttpResponse.json(envelope({ ...response, id: 'sr-new' }))),
  http.post('/api/suggestions/suggestions/:id/add_comment/', () => HttpResponse.json(envelope({ ...comment, id: 'sc-new' }))),

  http.get('/api/suggestions/responses/', () => HttpResponse.json(page([response]))),
  http.post('/api/suggestions/responses/', async ({ request }) => HttpResponse.json({ ...response, id: 'sr-new', ...(await request.json() as object) }, { status: 201 })),
  http.get('/api/suggestions/responses/:id/', () => HttpResponse.json(response)),
  http.patch('/api/suggestions/responses/:id/', async ({ request }) => HttpResponse.json({ ...response, ...(await request.json() as object) })),
  http.delete('/api/suggestions/responses/:id/', () => new HttpResponse(null, { status: 204 })),
  http.post('/api/suggestions/responses/:id/resend_email/', () => HttpResponse.json({ success: true, message: 'Email renvoyé avec succès' })),
  http.get('/api/suggestions/comments/', () => HttpResponse.json(page([comment]))),
  http.post('/api/suggestions/comments/', async ({ request }) => HttpResponse.json({ ...comment, id: 'sc-new', ...(await request.json() as object) }, { status: 201 })),
  http.get('/api/suggestions/comments/:id/', () => HttpResponse.json(comment)),
  http.patch('/api/suggestions/comments/:id/', async ({ request }) => HttpResponse.json({ ...comment, ...(await request.json() as object) })),
  http.delete('/api/suggestions/comments/:id/', () => new HttpResponse(null, { status: 204 })),
  http.get('/api/suggestions/attachments/', () => HttpResponse.json(page([attachment]))),
  http.post('/api/suggestions/attachments/', () => HttpResponse.json({ ...attachment, id: 'sa-new' }, { status: 201 })),
  http.get('/api/suggestions/attachments/:id/', () => HttpResponse.json(attachment)),
  http.patch('/api/suggestions/attachments/:id/', async ({ request }) => HttpResponse.json({ ...attachment, ...(await request.json() as object) })),
  http.delete('/api/suggestions/attachments/:id/', () => new HttpResponse(null, { status: 204 })),
]
