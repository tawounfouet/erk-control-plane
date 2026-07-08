import { fetchJSON } from './client'
import type { PaginatedResponse } from '@/lib/types/patrimoine.types'
import type { Tenant, TenantDetail, TenantStatistics, TenantDocument, RentalAction } from '@/lib/types/rental.types'

export function listTenants(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<Tenant>>(`/api/rental/tenants/${qs}`)
}

export function getTenant(id: string) {
  return fetchJSON<TenantDetail>(`/api/rental/tenants/${id}/`)
}

export function getActiveTenants() {
  return fetchJSON<Tenant[]>(`/api/rental/tenants/active/`)
}

export function getTenantStatistics() {
  return fetchJSON<TenantStatistics>(`/api/rental/tenants/statistics/`)
}

export function listDocuments(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<TenantDocument>>(`/api/rental/tenant-documents/${qs}`)
}

export function getDocument(id: string) {
  return fetchJSON<TenantDocument>(`/api/rental/tenant-documents/${id}/`)
}

export function getExpiredDocuments() {
  return fetchJSON<TenantDocument[]>(`/api/rental/tenant-documents/expired/`)
}

export function getExpiringSoonDocuments() {
  return fetchJSON<TenantDocument[]>(`/api/rental/tenant-documents/expiring_soon/`)
}

export function listRentalActions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<RentalAction>>(`/api/rental/actions/${qs}`)
}
