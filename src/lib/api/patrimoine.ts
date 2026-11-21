import { fetchJSON } from './client'
import type {
  PaginatedResponse,
  Building,
  BuildingDetail,
  BuildingStats,
  Floor,
  FloorDetail,
  Unit,
  UnitDetail,
  InventoryItem,
  InventoryAssignment,
  Intervention,
  InterventionDetail,
  InterventionStatistics,
  UnitType,
  UnitFeature,
  UnitStatusHistory,
  UnitHierarchy,
  RoomAsset,
  Equipment,
  EquipmentCreateInput,
  EquipmentUpdateInput,
  EquipmentAssignInput,
  EquipmentCondition,
  Invoice,
  InvoiceCreateInput,
} from '@/lib/types/patrimoine.types'

type Params = Record<string, string>

function query(params?: Params) {
  return params ? `?${new URLSearchParams(params).toString()}` : ''
}

function write<T>(url: string, method: 'POST' | 'PATCH' | 'PUT' | 'DELETE', data?: unknown) {
  return fetchJSON<T>(url, {
    method,
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  })
}

export function listUnitTypes(params?: Params) {
  return fetchJSON<PaginatedResponse<UnitType>>(`/api/patrimoine/unit-types/${query(params)}`)
}

export function getUnitType(id: string) {
  return fetchJSON<UnitType>(`/api/patrimoine/unit-types/${id}/`)
}

export function createUnitType(data: Partial<UnitType>) {
  return write<UnitType>('/api/patrimoine/unit-types/', 'POST', data)
}

export function updateUnitType(id: string, data: Partial<UnitType>) {
  return write<UnitType>(`/api/patrimoine/unit-types/${id}/`, 'PATCH', data)
}

export function deleteUnitType(id: string) {
  return write<void>(`/api/patrimoine/unit-types/${id}/`, 'DELETE')
}

export function listCompositeUnitTypes() {
  return fetchJSON<UnitType[]>('/api/patrimoine/unit-types/composite_types/')
}

export function listRentableUnitTypes() {
  return fetchJSON<UnitType[]>('/api/patrimoine/unit-types/rentable_types/')
}

export function listBuildings(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<Building>>(`/api/patrimoine/buildings/${qs}`)
}

export function getBuilding(id: string) {
  return fetchJSON<BuildingDetail>(`/api/patrimoine/buildings/${id}/`)
}

export function getBuildingStats(id: string) {
  return fetchJSON<BuildingStats>(`/api/patrimoine/buildings/${id}/statistics/`)
}

export function createBuilding(data: Partial<Building>) {
  return write<Building>('/api/patrimoine/buildings/', 'POST', data)
}

export function updateBuilding(id: string, data: Partial<Building>) {
  return write<Building>(`/api/patrimoine/buildings/${id}/`, 'PATCH', data)
}

export function deleteBuilding(id: string) {
  return write<void>(`/api/patrimoine/buildings/${id}/`, 'DELETE')
}

export function listFloors(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<Floor>>(`/api/patrimoine/floors/${qs}`)
}

export function getFloor(id: string) {
  return fetchJSON<FloorDetail>(`/api/patrimoine/floors/${id}/`)
}

export function getFloorsByBuilding(buildingId: string) {
  return fetchJSON<Floor[]>(`/api/patrimoine/floors/by_building/?building_id=${buildingId}`)
}

export function createFloor(data: Partial<Floor>) {
  return write<Floor>('/api/patrimoine/floors/', 'POST', data)
}

export function updateFloor(id: string, data: Partial<Floor>) {
  return write<Floor>(`/api/patrimoine/floors/${id}/`, 'PATCH', data)
}

export function deleteFloor(id: string) {
  return write<void>(`/api/patrimoine/floors/${id}/`, 'DELETE')
}

export function listUnits(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<Unit>>(`/api/patrimoine/units/${qs}`)
}

export function getUnit(id: string) {
  return fetchJSON<UnitDetail>(`/api/patrimoine/units/${id}/`)
}

export function getAvailableUnits() {
  return fetchJSON<Unit[]>(`/api/patrimoine/units/available/`)
}

export function createUnit(data: Partial<UnitDetail>) {
  return write<Unit>('/api/patrimoine/units/', 'POST', data)
}

export function updateUnit(id: string, data: Partial<UnitDetail>) {
  return write<UnitDetail>(`/api/patrimoine/units/${id}/`, 'PATCH', data)
}

export function deleteUnit(id: string) {
  return write<void>(`/api/patrimoine/units/${id}/`, 'DELETE')
}

export function getRentableUnits() {
  return fetchJSON<Unit[]>('/api/patrimoine/units/rentable/')
}

export function getCompositeUnits() {
  return fetchJSON<Unit[]>('/api/patrimoine/units/composite/')
}

export function changeUnitStatus(id: string, newStatus: string, notes = '') {
  return write<UnitDetail>(`/api/patrimoine/units/${id}/change_status/`, 'POST', {
    new_status: newStatus,
    notes,
  })
}

export function getUnitHierarchy(id: string) {
  return fetchJSON<UnitHierarchy>(`/api/patrimoine/units/${id}/hierarchy/`)
}

export function listUnitFeatures(params?: Params) {
  return fetchJSON<PaginatedResponse<UnitFeature>>(`/api/patrimoine/unit-features/${query(params)}`)
}

export function getUnitFeature(id: string) {
  return fetchJSON<UnitFeature>(`/api/patrimoine/unit-features/${id}/`)
}

export function createUnitFeature(data: Partial<UnitFeature>) {
  return write<UnitFeature>('/api/patrimoine/unit-features/', 'POST', data)
}

export function updateUnitFeature(id: string, data: Partial<UnitFeature>) {
  return write<UnitFeature>(`/api/patrimoine/unit-features/${id}/`, 'PATCH', data)
}

export function deleteUnitFeature(id: string) {
  return write<void>(`/api/patrimoine/unit-features/${id}/`, 'DELETE')
}

export function listInventoryItems(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<InventoryItem>>(`/api/patrimoine/inventory/${qs}`)
}

export function getInventoryItem(id: string) {
  return fetchJSON<InventoryItem>(`/api/patrimoine/inventory/${id}/`)
}

export function createInventoryItem(data: Partial<InventoryItem>) {
  return write<InventoryItem>('/api/patrimoine/inventory/', 'POST', data)
}

export function updateInventoryItem(id: string, data: Partial<InventoryItem>) {
  return write<InventoryItem>(`/api/patrimoine/inventory/${id}/`, 'PATCH', data)
}

export function deleteInventoryItem(id: string) {
  return write<void>(`/api/patrimoine/inventory/${id}/`, 'DELETE')
}

export function listStatusHistory(params?: Params) {
  return fetchJSON<PaginatedResponse<UnitStatusHistory>>(`/api/patrimoine/status-history/${query(params)}`)
}

export function getStatusHistory(id: string) {
  return fetchJSON<UnitStatusHistory>(`/api/patrimoine/status-history/${id}/`)
}

export function getStatusHistoryByUnit(unitId: string) {
  return fetchJSON<UnitStatusHistory[]>(`/api/patrimoine/status-history/by_unit/?unit_id=${unitId}`)
}

export function listAssignments(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<InventoryAssignment>>(`/api/patrimoine/inventory-assignments/${qs}`)
}

export function getAssignment(id: string) {
  return fetchJSON<InventoryAssignment>(`/api/patrimoine/inventory-assignments/${id}/`)
}

export function getAssignmentsByUnit(unitId: string) {
  return fetchJSON<InventoryAssignment[]>(`/api/patrimoine/inventory-assignments/by_unit/?unit_id=${unitId}`)
}

export function listAssignmentsNeedingMaintenance() {
  return fetchJSON<InventoryAssignment[]>('/api/patrimoine/inventory-assignments/needs_maintenance/')
}

export function listInterventions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<Intervention>>(`/api/patrimoine/interventions/${qs}`)
}

export function getIntervention(id: string) {
  return fetchJSON<InterventionDetail>(`/api/patrimoine/interventions/${id}/`)
}

export function createIntervention(data: Partial<InterventionDetail>) {
  return write<InterventionDetail>('/api/patrimoine/interventions/', 'POST', data)
}

export function updateIntervention(id: string, data: Partial<InterventionDetail>) {
  return write<InterventionDetail>(`/api/patrimoine/interventions/${id}/`, 'PATCH', data)
}

export function deleteIntervention(id: string) {
  return write<void>(`/api/patrimoine/interventions/${id}/`, 'DELETE')
}

export function listPendingInterventions() {
  return fetchJSON<Intervention[]>('/api/patrimoine/interventions/pending/')
}

export function listInProgressInterventions() {
  return fetchJSON<Intervention[]>('/api/patrimoine/interventions/in_progress/')
}

export function listOverdueInterventions() {
  return fetchJSON<Intervention[]>('/api/patrimoine/interventions/overdue/')
}

export function startIntervention(id: string) {
  return write<InterventionDetail>(`/api/patrimoine/interventions/${id}/start/`, 'POST')
}

export function completeIntervention(id: string, resolution = '') {
  return write<InterventionDetail>(`/api/patrimoine/interventions/${id}/complete/`, 'POST', { resolution })
}

export function cancelIntervention(id: string, reason = '') {
  return write<InterventionDetail>(`/api/patrimoine/interventions/${id}/cancel/`, 'POST', { reason })
}

export function getInterventionStatistics() {
  return fetchJSON<InterventionStatistics>('/api/patrimoine/interventions/statistics/')
}

export function listRoomAssets(params?: Params) {
  return fetchJSON<PaginatedResponse<RoomAsset>>(`/api/patrimoine/room-assets/${query(params)}`)
}

export function getRoomAsset(id: string) {
  return fetchJSON<RoomAsset>(`/api/patrimoine/room-assets/${id}/`)
}

export function listInvoices(params?: Params) {
  return fetchJSON<PaginatedResponse<Invoice>>(`/api/patrimoine/invoices/${query(params)}`)
}

export function getInvoice(id: string) {
  return fetchJSON<Invoice>(`/api/patrimoine/invoices/${id}/`)
}

export function createInvoice(data: InvoiceCreateInput) {
  return write<Invoice>('/api/patrimoine/invoices/', 'POST', data)
}

export function voidInvoice(id: string, reason: string, replacementInvoice?: string | null) {
  return write<Invoice>(`/api/patrimoine/invoices/${id}/void/`, 'POST', {
    reason,
    replacement_invoice: replacementInvoice ?? null,
  })
}

export function listEquipments(params?: Params) {
  return fetchJSON<PaginatedResponse<Equipment>>(`/api/patrimoine/equipments/${query(params)}`)
}

export function getEquipment(id: string) {
  return fetchJSON<Equipment>(`/api/patrimoine/equipments/${id}/`)
}

export function listAvailableEquipments(params?: Params) {
  return fetchJSON<PaginatedResponse<Equipment>>(`/api/patrimoine/equipments/available/${query(params)}`)
}

export function createEquipment(data: EquipmentCreateInput) {
  return write<Equipment>('/api/patrimoine/equipments/', 'POST', data)
}

export function updateEquipment(id: string, data: EquipmentUpdateInput) {
  return write<Equipment>(`/api/patrimoine/equipments/${id}/`, 'PATCH', data)
}

export function deleteEquipment(id: string) {
  return write<void>(`/api/patrimoine/equipments/${id}/`, 'DELETE')
}

export function assignEquipment(id: string, data: EquipmentAssignInput) {
  return write<Equipment>(`/api/patrimoine/equipments/${id}/assign/`, 'POST', data)
}

export function unassignEquipment(id: string, condition?: EquipmentCondition, notes = '') {
  return write<Equipment>(`/api/patrimoine/equipments/${id}/unassign/`, 'POST', { condition, notes })
}

export function inspectEquipmentExit(id: string, condition: EquipmentCondition, notes = '') {
  return write<Equipment>(`/api/patrimoine/equipments/${id}/exit_inspection/`, 'POST', { condition, notes })
}
