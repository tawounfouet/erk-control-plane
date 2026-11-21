import { http, HttpResponse } from 'msw'
import { MOCK_ACCEPTANCES, MOCK_INSPECTIONS, MOCK_METER_READINGS, MOCK_OCCUPATIONS, MOCK_RENTAL_ACTIONS, MOCK_TENANTS, MOCK_TENANT_DOCUMENTS } from '@/mocks/fixtures/rental'

const page = <T,>(results: T[]) => ({ count: results.length, next: null, previous: null, results })
const tenant = (id: string) => MOCK_TENANTS.find((item) => item.id === id)

export const rentalHandlers = [
  http.get('/api/rental/tenants/', ({ request }) => {
    const search = new URL(request.url).searchParams.get('search')?.toLowerCase()
    const results = search ? MOCK_TENANTS.filter((item) => `${item.user.first_name} ${item.user.last_name} ${item.user.email}`.toLowerCase().includes(search)) : MOCK_TENANTS
    return HttpResponse.json(page(results))
  }),
  http.post('/api/rental/tenants/', async ({ request }) => HttpResponse.json({ ...MOCK_TENANTS[0], id: 't-new', ...(await request.json() as object) }, { status: 201 })),
  http.get('/api/rental/tenants/active/', () => HttpResponse.json(MOCK_TENANTS.filter((item) => item.is_currently_renting))),
  http.get('/api/rental/tenants/inactive/', () => HttpResponse.json(MOCK_TENANTS.filter((item) => !item.is_currently_renting))),
  http.get('/api/rental/tenants/my_profile/', () => HttpResponse.json({ ...MOCK_TENANTS[0], tenant_documents: MOCK_TENANT_DOCUMENTS.filter((item) => item.tenant === 't-001') })),
  http.get('/api/rental/tenants/statistics/', () => HttpResponse.json({ total_tenants: 3, active_tenants: 3, inactive_tenants: 0, tenants_with_complete_docs: 1, tenants_with_pending_docs: 2, tenants_with_expired_docs: 0, total_documents: 4, verified_documents: 3, pending_documents: 1, expired_documents: 0 })),
  http.get('/api/rental/tenants/:id/', ({ params }) => {
    const result = tenant(String(params.id))
    return result ? HttpResponse.json({ ...result, tenant_documents: MOCK_TENANT_DOCUMENTS.filter((item) => item.tenant === result.id), rental_unit_info: result.current_unit_identifier, has_complete_documentation: result.documents_count === result.verified_documents_count }) : new HttpResponse(null, { status: 404 })
  }),
  http.patch('/api/rental/tenants/:id/', async ({ params, request }) => HttpResponse.json({ ...tenant(String(params.id)), ...(await request.json() as object) })),
  http.delete('/api/rental/tenants/:id/', () => new HttpResponse(null, { status: 204 })),
  http.post('/api/rental/tenants/:id/assign_unit/', async ({ params, request }) => HttpResponse.json({ ...tenant(String(params.id)), current_unit: (await request.json() as { unit_id: string }).unit_id, is_currently_renting: true })),
  http.post('/api/rental/tenants/:id/release_unit/', ({ params }) => HttpResponse.json({ ...tenant(String(params.id)), current_unit: null, current_unit_identifier: null, is_currently_renting: false })),
  http.post('/api/rental/tenants/:id/upload_document/', ({ params }) => HttpResponse.json({ ...MOCK_TENANT_DOCUMENTS[0], id: 'd-new', tenant: params.id, is_verified: false }, { status: 201 })),
  http.get('/api/rental/occupations/', () => HttpResponse.json(page(MOCK_OCCUPATIONS))),
  http.get('/api/rental/occupations/:id/', () => HttpResponse.json(MOCK_OCCUPATIONS[0])),

  http.get('/api/rental/tenant-documents/', ({ request }) => { const id = new URL(request.url).searchParams.get('tenant'); return HttpResponse.json(page(id ? MOCK_TENANT_DOCUMENTS.filter((item) => item.tenant === id) : MOCK_TENANT_DOCUMENTS)) }),
  http.post('/api/rental/tenant-documents/', async ({ request }) => HttpResponse.json({ ...MOCK_TENANT_DOCUMENTS[0], id: 'd-new', ...(await request.json() as object) }, { status: 201 })),
  http.get('/api/rental/tenant-documents/expired/', () => HttpResponse.json(MOCK_TENANT_DOCUMENTS.filter((item) => item.status === 'expired'))),
  http.get('/api/rental/tenant-documents/expiring_soon/', () => HttpResponse.json([])),
  http.get('/api/rental/tenant-documents/:id/', ({ params }) => HttpResponse.json(MOCK_TENANT_DOCUMENTS.find((item) => item.id === params.id) ?? MOCK_TENANT_DOCUMENTS[0])),
  http.patch('/api/rental/tenant-documents/:id/', async ({ request }) => HttpResponse.json({ ...MOCK_TENANT_DOCUMENTS[0], ...(await request.json() as object) })),
  http.delete('/api/rental/tenant-documents/:id/', () => new HttpResponse(null, { status: 204 })),
  http.post('/api/rental/tenant-documents/:id/verify/', ({ params }) => HttpResponse.json({ ...MOCK_TENANT_DOCUMENTS.find((item) => item.id === params.id), is_verified: true, verified_at: '2026-10-01T10:00:00Z' })),

  http.get('/api/rental/actions/', () => HttpResponse.json(page(MOCK_RENTAL_ACTIONS))),
  http.get('/api/rental/actions/:id/', () => HttpResponse.json(MOCK_RENTAL_ACTIONS[0])),
  http.get('/api/rental/meter-readings/', () => HttpResponse.json(page(MOCK_METER_READINGS))),
  http.post('/api/rental/meter-readings/', async ({ request }) => HttpResponse.json({ ...MOCK_METER_READINGS[0], id: 'meter-new', ...(await request.json() as object) }, { status: 201 })),
  http.get('/api/rental/meter-readings/:id/', () => HttpResponse.json(MOCK_METER_READINGS[0])),
  http.get('/api/rental/inspections/', () => HttpResponse.json(page(MOCK_INSPECTIONS))),
  http.post('/api/rental/inspections/', async ({ request }) => HttpResponse.json({ ...MOCK_INSPECTIONS[0], id: 'inspection-new', ...(await request.json() as object) }, { status: 201 })),
  http.get('/api/rental/inspections/:id/', () => HttpResponse.json(MOCK_INSPECTIONS[0])),
  http.post('/api/rental/inspections/:id/close/', () => HttpResponse.json({ ...MOCK_INSPECTIONS[0], closed_at: '2026-10-01T10:00:00Z' })),
  http.get('/api/rental/acceptances/', () => HttpResponse.json(page(MOCK_ACCEPTANCES))),
  http.post('/api/rental/acceptances/', async ({ request }) => HttpResponse.json({ ...MOCK_ACCEPTANCES[0], id: 'acceptance-new', ...(await request.json() as object) }, { status: 201 })),
  http.get('/api/rental/acceptances/:id/', () => HttpResponse.json(MOCK_ACCEPTANCES[0])),
  http.post('/api/rental/acceptances/:id/sign/', async ({ request }) => { const payload = await request.json() as { resident: string; signature_svg: string }; return HttpResponse.json({ ...MOCK_ACCEPTANCES[0], is_fully_accepted: true, signatures: [{ id: 'signature-new', resident: payload.resident, signed_by_name: 'Jean Dupont', signed_at: '2026-10-01T10:00:00Z', signature_svg: payload.signature_svg }] }) }),
]
