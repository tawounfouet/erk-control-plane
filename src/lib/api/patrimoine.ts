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
} from '@/lib/types/patrimoine.types'

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

export function listInventoryItems(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<InventoryItem>>(`/api/patrimoine/inventory/${qs}`)
}

export function getInventoryItem(id: string) {
  return fetchJSON<InventoryItem>(`/api/patrimoine/inventory/${id}/`)
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

export function listInterventions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<Intervention>>(`/api/patrimoine/interventions/${qs}`)
}

export function getIntervention(id: string) {
  return fetchJSON<Intervention>(`/api/patrimoine/interventions/${id}/`)
}
