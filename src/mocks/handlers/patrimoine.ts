import { http, HttpResponse } from 'msw'
import {
  MOCK_BUILDINGS, MOCK_FLOORS, MOCK_UNITS,
  MOCK_BUILDING_STATS,
  MOCK_INVENTORY_ITEMS, MOCK_INVENTORY_ASSIGNMENTS,
} from '@/mocks/fixtures/patrimoine'

export const patrimoineHandlers = [
  http.get('/api/patrimoine/buildings/', () =>
    HttpResponse.json({ count: MOCK_BUILDINGS.length, next: null, previous: null, results: MOCK_BUILDINGS })),

  http.get('/api/patrimoine/buildings/:id/', ({ params }) => {
    const building = MOCK_BUILDINGS.find((b) => b.id === params.id)
    if (!building) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(building)
  }),

  http.get('/api/patrimoine/buildings/:id/stats/', ({ params }) => {
    if (params.id === 'b-001') return HttpResponse.json(MOCK_BUILDING_STATS)
    return HttpResponse.json({ ...MOCK_BUILDING_STATS, id: params.id })
  }),

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

  http.get('/api/patrimoine/units/:id/', ({ params }) => {
    const unit = MOCK_UNITS.find((u) => u.id === params.id)
    if (!unit) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(unit)
  }),

  http.get('/api/patrimoine/units/available/', () => {
    const available = MOCK_UNITS.filter((u) => u.current_status === 'AVAILABLE')
    return HttpResponse.json(available)
  }),

  http.get('/api/patrimoine/inventory/', () =>
    HttpResponse.json({ count: MOCK_INVENTORY_ITEMS.length, next: null, previous: null, results: MOCK_INVENTORY_ITEMS })),

  http.get('/api/patrimoine/inventory-assignments/', () =>
    HttpResponse.json({ count: MOCK_INVENTORY_ASSIGNMENTS.length, next: null, previous: null, results: MOCK_INVENTORY_ASSIGNMENTS })),
]
