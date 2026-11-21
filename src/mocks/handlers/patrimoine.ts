import { http, HttpResponse } from 'msw'
import {
  MOCK_BUILDINGS, MOCK_FLOORS, MOCK_UNITS,
  MOCK_BUILDING_STATS,
  MOCK_INVENTORY_ITEMS, MOCK_INVENTORY_ASSIGNMENTS,
  MOCK_EQUIPMENTS, MOCK_INVOICES, MOCK_PATRIMOINE_INTERVENTIONS,
  MOCK_ROOM_ASSETS, MOCK_STATUS_HISTORY, MOCK_UNIT_FEATURES, MOCK_UNIT_TYPES,
} from '@/mocks/fixtures/patrimoine'

const page = <T,>(results: T[]) => ({ count: results.length, next: null, previous: null, results })

export const patrimoineHandlers = [
  http.get('/api/patrimoine/buildings/', () =>
    HttpResponse.json({ count: MOCK_BUILDINGS.length, next: null, previous: null, results: MOCK_BUILDINGS })),

  http.get('/api/patrimoine/buildings/:id/', ({ params }) => {
    const building = MOCK_BUILDINGS.find((b) => b.id === params.id)
    if (!building) return new HttpResponse(null, { status: 404 })
    const floors = MOCK_FLOORS.filter((f) => f.building === building.id)
    return HttpResponse.json({
      ...building,
      floors: floors.map((f) => ({ ...f, chemical_code: f.name, units_count: f.unit_count })),
    })
  }),

  http.get('/api/patrimoine/buildings/:id/statistics/', ({ params }) => {
    if (params.id === 'b-001') return HttpResponse.json(MOCK_BUILDING_STATS)
    return HttpResponse.json({ ...MOCK_BUILDING_STATS, id: params.id })
  }),
  http.post('/api/patrimoine/buildings/', async ({ request }) => HttpResponse.json({ id: 'b-new', ...(await request.json() as object) }, { status: 201 })),
  http.patch('/api/patrimoine/buildings/:id/', async ({ params, request }) => HttpResponse.json({ ...MOCK_BUILDINGS.find((item) => item.id === params.id), ...(await request.json() as object) })),
  http.delete('/api/patrimoine/buildings/:id/', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/patrimoine/floors/', () =>
    HttpResponse.json({ count: MOCK_FLOORS.length, next: null, previous: null, results: MOCK_FLOORS })),

  http.get('/api/patrimoine/floors/by_building/', ({ request }) => {
    const url = new URL(request.url)
    const buildingId = url.searchParams.get('building_id')
    const floors = buildingId ? MOCK_FLOORS.filter((f) => f.building === buildingId) : MOCK_FLOORS
    return HttpResponse.json(floors)
  }),

  http.get('/api/patrimoine/units/', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('current_status')
    const building = url.searchParams.get('building')
    let results = MOCK_UNITS
    if (status) results = results.filter((u) => u.current_status === status)
    if (building) results = results.filter((u) => u.building === building)
    return HttpResponse.json({ count: results.length, next: null, previous: null, results })
  }),

  http.get('/api/patrimoine/units/available/', () => {
    const available = MOCK_UNITS.filter((u) => u.current_status === 'AVAILABLE')
    return HttpResponse.json(available)
  }),
  http.post('/api/patrimoine/units/', async ({ request }) => HttpResponse.json({ id: 'u-new', ...(await request.json() as object) }, { status: 201 })),
  http.patch('/api/patrimoine/units/:id/', async ({ params, request }) => HttpResponse.json({ ...MOCK_UNITS.find((item) => item.id === params.id), ...(await request.json() as object) })),
  http.delete('/api/patrimoine/units/:id/', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/patrimoine/inventory/', () =>
    HttpResponse.json({ count: MOCK_INVENTORY_ITEMS.length, next: null, previous: null, results: MOCK_INVENTORY_ITEMS })),
  http.get('/api/patrimoine/inventory/:id/', ({ params }) => HttpResponse.json(MOCK_INVENTORY_ITEMS.find((item) => item.id === params.id))),
  http.post('/api/patrimoine/inventory/', async ({ request }) => HttpResponse.json({ id: 'i-new', ...(await request.json() as object) }, { status: 201 })),
  http.patch('/api/patrimoine/inventory/:id/', async ({ params, request }) => HttpResponse.json({ ...MOCK_INVENTORY_ITEMS.find((item) => item.id === params.id), ...(await request.json() as object) })),
  http.delete('/api/patrimoine/inventory/:id/', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/patrimoine/inventory-assignments/', () =>
    HttpResponse.json({ count: MOCK_INVENTORY_ASSIGNMENTS.length, next: null, previous: null, results: MOCK_INVENTORY_ASSIGNMENTS })),

  http.get('/api/patrimoine/unit-types/', () => HttpResponse.json(page(MOCK_UNIT_TYPES))),
  http.get('/api/patrimoine/unit-types/composite_types/', () => HttpResponse.json(MOCK_UNIT_TYPES.filter((item) => item.is_composite))),
  http.get('/api/patrimoine/unit-types/rentable_types/', () => HttpResponse.json(MOCK_UNIT_TYPES.filter((item) => item.is_rentable))),
  http.get('/api/patrimoine/unit-types/:id/', ({ params }) => HttpResponse.json(MOCK_UNIT_TYPES.find((item) => item.id === params.id))),
  http.post('/api/patrimoine/unit-types/', async ({ request }) => HttpResponse.json({ id: 'ut-new', ...(await request.json() as object) }, { status: 201 })),
  http.patch('/api/patrimoine/unit-types/:id/', async ({ params, request }) => HttpResponse.json({ ...MOCK_UNIT_TYPES.find((item) => item.id === params.id), ...(await request.json() as object) })),
  http.delete('/api/patrimoine/unit-types/:id/', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/patrimoine/floors/:id/', ({ params }) => {
    const floor = MOCK_FLOORS.find((item) => item.id === params.id)
    if (!floor) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json({ ...floor, chemical_code: floor.name, full_name: `${floor.name} · Résidence`, building_name: 'Résidence Eureka A', units_count: floor.unit_count, units: MOCK_UNITS.filter((item) => item.floor === floor.id), images_details: [] })
  }),
  http.post('/api/patrimoine/floors/', async ({ request }) => HttpResponse.json({ id: 'f-new', ...(await request.json() as object) }, { status: 201 })),
  http.patch('/api/patrimoine/floors/:id/', async ({ params, request }) => HttpResponse.json({ id: params.id, ...(await request.json() as object) })),
  http.delete('/api/patrimoine/floors/:id/', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/patrimoine/unit-features/', () => HttpResponse.json(page(MOCK_UNIT_FEATURES))),
  http.get('/api/patrimoine/unit-features/:id/', ({ params }) => HttpResponse.json(MOCK_UNIT_FEATURES.find((item) => item.id === params.id))),
  http.post('/api/patrimoine/unit-features/', async ({ request }) => HttpResponse.json({ id: 'uf-new', ...(await request.json() as object) }, { status: 201 })),
  http.patch('/api/patrimoine/unit-features/:id/', async ({ params, request }) => HttpResponse.json({ id: params.id, ...(await request.json() as object) })),
  http.delete('/api/patrimoine/unit-features/:id/', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/patrimoine/status-history/', () => HttpResponse.json(page(MOCK_STATUS_HISTORY))),
  http.get('/api/patrimoine/status-history/by_unit/', ({ request }) => { const id = new URL(request.url).searchParams.get('unit_id'); return HttpResponse.json(MOCK_STATUS_HISTORY.filter((item) => item.unit === id)) }),
  http.get('/api/patrimoine/status-history/:id/', ({ params }) => HttpResponse.json(MOCK_STATUS_HISTORY.find((item) => item.id === params.id))),
  http.get('/api/patrimoine/room-assets/', ({ request }) => { const id = new URL(request.url).searchParams.get('managed_unit'); return HttpResponse.json(page(id ? MOCK_ROOM_ASSETS.filter((item) => item.managed_unit === id) : MOCK_ROOM_ASSETS)) }),
  http.get('/api/patrimoine/room-assets/:id/', ({ params }) => HttpResponse.json(MOCK_ROOM_ASSETS.find((item) => item.id === params.id))),

  http.get('/api/patrimoine/units/:id/hierarchy/', ({ params }) => { const unit = MOCK_UNITS.find((item) => item.id === params.id); return HttpResponse.json({ unit, path: `Résidence Eureka A > ${unit?.identifier}`, children: [] }) }),
  http.post('/api/patrimoine/units/:id/change_status/', async ({ params, request }) => { const body = await request.json() as { new_status: string }; return HttpResponse.json({ ...MOCK_UNITS.find((item) => item.id === params.id), current_status: body.new_status }) }),
  http.get('/api/patrimoine/units/rentable/', () => HttpResponse.json(MOCK_UNITS)),
  http.get('/api/patrimoine/units/composite/', () => HttpResponse.json([])),
  http.get('/api/patrimoine/units/:id/', ({ params }) => {
    const unit = MOCK_UNITS.find((u) => u.id === params.id)
    if (!unit) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(unit)
  }),

  http.get('/api/patrimoine/inventory-assignments/needs_maintenance/', () => HttpResponse.json(MOCK_INVENTORY_ASSIGNMENTS.filter((item) => ['POOR', 'OUT_OF_SERVICE'].includes(item.current_condition)))),
  http.get('/api/patrimoine/inventory-assignments/by_unit/', ({ request }) => { const id = new URL(request.url).searchParams.get('unit_id'); return HttpResponse.json(MOCK_INVENTORY_ASSIGNMENTS.filter((item) => item.unit === id)) }),
  http.get('/api/patrimoine/inventory-assignments/:id/', ({ params }) => HttpResponse.json(MOCK_INVENTORY_ASSIGNMENTS.find((item) => item.id === params.id))),

  http.get('/api/patrimoine/equipments/', ({ request }) => { const url = new URL(request.url); const status = url.searchParams.get('status'); const results = status ? MOCK_EQUIPMENTS.filter((item) => item.status === status) : MOCK_EQUIPMENTS; return HttpResponse.json(page(results)) }),
  http.get('/api/patrimoine/equipments/available/', () => HttpResponse.json(page(MOCK_EQUIPMENTS.filter((item) => item.status === 'IN_STOCK')))),
  http.get('/api/patrimoine/equipments/:id/', ({ params }) => HttpResponse.json(MOCK_EQUIPMENTS.find((item) => item.id === params.id))),
  http.post('/api/patrimoine/equipments/', async ({ request }) => HttpResponse.json({ ...MOCK_EQUIPMENTS[1], id: 'eq-new', technical_reference: 'NEW-2026-00001', ...(await request.json() as object) }, { status: 201 })),
  http.patch('/api/patrimoine/equipments/:id/', async ({ params, request }) => HttpResponse.json({ ...MOCK_EQUIPMENTS.find((item) => item.id === params.id), ...(await request.json() as object) })),
  http.delete('/api/patrimoine/equipments/:id/', () => new HttpResponse(null, { status: 204 })),
  http.post('/api/patrimoine/equipments/:id/assign/', ({ params }) => HttpResponse.json({ ...MOCK_EQUIPMENTS.find((item) => item.id === params.id), status: 'ASSIGNED', status_display: 'Assigné', is_assigned: true })),
  http.post('/api/patrimoine/equipments/:id/unassign/', ({ params }) => HttpResponse.json({ ...MOCK_EQUIPMENTS.find((item) => item.id === params.id), status: 'IN_STOCK', status_display: 'En stock', is_assigned: false })),
  http.post('/api/patrimoine/equipments/:id/exit_inspection/', async ({ params, request }) => { const body = await request.json() as { condition: string }; return HttpResponse.json({ ...MOCK_EQUIPMENTS.find((item) => item.id === params.id), condition: body.condition }) }),

  http.get('/api/patrimoine/invoices/', () => HttpResponse.json(page(MOCK_INVOICES))),
  http.get('/api/patrimoine/invoices/:id/', ({ params }) => HttpResponse.json(MOCK_INVOICES.find((item) => item.id === params.id))),
  http.post('/api/patrimoine/invoices/', async ({ request }) => HttpResponse.json({ ...MOCK_INVOICES[0], id: 'inv-new', ...(await request.json() as object), status: 'ACTIVE' }, { status: 201 })),
  http.post('/api/patrimoine/invoices/:id/void/', async ({ params, request }) => { const body = await request.json() as { reason: string }; return HttpResponse.json({ ...MOCK_INVOICES.find((item) => item.id === params.id), status: 'CANCELLED', void_reason: body.reason }) }),

  http.get('/api/patrimoine/interventions/', () => HttpResponse.json(page(MOCK_PATRIMOINE_INTERVENTIONS))),
  http.get('/api/patrimoine/interventions/statistics/', () => HttpResponse.json({ total: 1, by_status: { PENDING: 1, IN_PROGRESS: 0, COMPLETED: 0 }, by_priority: { HIGH: 1 }, by_category: { ELECTRICAL: 1 } })),
  http.get('/api/patrimoine/interventions/pending/', () => HttpResponse.json(MOCK_PATRIMOINE_INTERVENTIONS)),
  http.get('/api/patrimoine/interventions/in_progress/', () => HttpResponse.json([])),
  http.get('/api/patrimoine/interventions/overdue/', () => HttpResponse.json([])),
  http.get('/api/patrimoine/interventions/:id/', ({ params }) => HttpResponse.json(MOCK_PATRIMOINE_INTERVENTIONS.find((item) => item.id === params.id))),
  http.post('/api/patrimoine/interventions/', async ({ request }) => HttpResponse.json({ ...MOCK_PATRIMOINE_INTERVENTIONS[0], id: 'pi-new', ...(await request.json() as object) }, { status: 201 })),
  http.patch('/api/patrimoine/interventions/:id/', async ({ params, request }) => HttpResponse.json({ ...MOCK_PATRIMOINE_INTERVENTIONS.find((item) => item.id === params.id), ...(await request.json() as object) })),
  http.delete('/api/patrimoine/interventions/:id/', () => new HttpResponse(null, { status: 204 })),
  http.post('/api/patrimoine/interventions/:id/start/', ({ params }) => HttpResponse.json({ ...MOCK_PATRIMOINE_INTERVENTIONS.find((item) => item.id === params.id), status: 'IN_PROGRESS' })),
  http.post('/api/patrimoine/interventions/:id/complete/', ({ params }) => HttpResponse.json({ ...MOCK_PATRIMOINE_INTERVENTIONS.find((item) => item.id === params.id), status: 'COMPLETED' })),
  http.post('/api/patrimoine/interventions/:id/cancel/', ({ params }) => HttpResponse.json({ ...MOCK_PATRIMOINE_INTERVENTIONS.find((item) => item.id === params.id), status: 'CANCELLED' })),
]
