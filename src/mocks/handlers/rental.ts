import { http, HttpResponse } from 'msw'
import { MOCK_TENANTS, MOCK_TENANT_DOCUMENTS } from '@/mocks/fixtures/rental'

export const rentalHandlers = [
  http.get('/api/rental/tenants/', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')
    let results = MOCK_TENANTS
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(
        (t) =>
          t.user.first_name.toLowerCase().includes(q) ||
          t.user.last_name.toLowerCase().includes(q) ||
          t.user.email.toLowerCase().includes(q),
      )
    }
    return HttpResponse.json({ count: results.length, next: null, previous: null, results })
  }),

  http.get('/api/rental/tenants/active/', () => {
    const active = MOCK_TENANTS.filter((t) => t.is_currently_renting)
    return HttpResponse.json(active)
  }),

  http.get('/api/rental/tenants/:id/', ({ params }) => {
    const tenant = MOCK_TENANTS.find((t) => t.id === params.id)
    if (!tenant) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(tenant)
  }),

  http.get('/api/rental/tenant-documents/', ({ request }) => {
    const url = new URL(request.url)
    const tenantId = url.searchParams.get('tenant')
    let results = MOCK_TENANT_DOCUMENTS
    if (tenantId) results = results.filter((d) => d.tenant === tenantId)
    return HttpResponse.json({ count: results.length, next: null, previous: null, results })
  }),

  http.get('/api/rental/tenant-documents/expired/', () => {
    const expired = MOCK_TENANT_DOCUMENTS.filter((d) => d.status === 'expired')
    return HttpResponse.json({ count: expired.length, next: null, previous: null, results: expired })
  }),

  http.get('/api/rental/tenant-documents/expiring_soon/', () =>
    HttpResponse.json({ count: 0, next: null, previous: null, results: [] })),
]
