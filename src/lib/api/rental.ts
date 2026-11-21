import { fetchJSON } from './client'
import type { PaginatedResponse } from '@/lib/types/patrimoine.types'
import type {
  AcceptanceBatch, AcceptanceSignPayload, InspectionSession, InspectionWritePayload,
  MeterReading, MeterReadingWritePayload, Occupation, RentalAction, Tenant, TenantDetail,
  TenantDocument, TenantDocumentWritePayload, TenantStatistics, TenantWritePayload,
} from '@/lib/types/rental.types'

const query = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : ''
const json = (method: string, body?: unknown): RequestInit => ({ method, ...(body !== undefined && { body: JSON.stringify(body) }) })

export const listTenants = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<Tenant>>(`/api/rental/tenants/${query(params)}`)
export const getTenant = (id: string) => fetchJSON<TenantDetail>(`/api/rental/tenants/${id}/`)
export const getActiveTenants = () => fetchJSON<Tenant[]>(`/api/rental/tenants/active/`)
export const getInactiveTenants = () => fetchJSON<Tenant[]>(`/api/rental/tenants/inactive/`)
export const getMyTenantProfile = () => fetchJSON<TenantDetail>(`/api/rental/tenants/my_profile/`)
export const getTenantStatistics = () => fetchJSON<TenantStatistics>(`/api/rental/tenants/statistics/`)
export const listOccupations = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<Occupation>>(`/api/rental/occupations/${query(params)}`)
export const getOccupation = (id: string) => fetchJSON<Occupation>(`/api/rental/occupations/${id}/`)
export const createTenant = (payload: TenantWritePayload) => fetchJSON<TenantDetail>('/api/rental/tenants/', json('POST', payload))
export const updateTenant = (id: string, payload: Partial<TenantWritePayload>) => fetchJSON<TenantDetail>(`/api/rental/tenants/${id}/`, json('PATCH', payload))
export const deleteTenant = (id: string) => fetchJSON<void>(`/api/rental/tenants/${id}/`, { method: 'DELETE' })
export const assignTenantUnit = (id: string, unitId: string, moveInDate?: string) => fetchJSON<TenantDetail>(`/api/rental/tenants/${id}/assign_unit/`, json('POST', { unit_id: unitId, ...(moveInDate && { move_in_date: moveInDate }) }))
export const releaseTenantUnit = (id: string, moveOutDate?: string) => fetchJSON<TenantDetail>(`/api/rental/tenants/${id}/release_unit/`, json('POST', { ...(moveOutDate && { move_out_date: moveOutDate }) }))
export function uploadTenantDocument(id: string, payload: { document_type: string; file: File; title: string; expires_at?: string; notes?: string }) {
  const body = new FormData()
  Object.entries(payload).forEach(([key, value]) => value !== undefined && body.append(key, value))
  return fetchJSON<TenantDocument>(`/api/rental/tenants/${id}/upload_document/`, { method: 'POST', body })
}

export const listDocuments = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<TenantDocument>>(`/api/rental/tenant-documents/${query(params)}`)
export const getDocument = (id: string) => fetchJSON<TenantDocument>(`/api/rental/tenant-documents/${id}/`)
export const createDocument = (payload: TenantDocumentWritePayload) => fetchJSON<TenantDocument>('/api/rental/tenant-documents/', json('POST', payload))
export const updateDocument = (id: string, payload: TenantDocumentWritePayload) => fetchJSON<TenantDocument>(`/api/rental/tenant-documents/${id}/`, json('PATCH', payload))
export const deleteDocument = (id: string) => fetchJSON<void>(`/api/rental/tenant-documents/${id}/`, { method: 'DELETE' })
export const verifyDocument = (id: string) => fetchJSON<TenantDocument>(`/api/rental/tenant-documents/${id}/verify/`, { method: 'POST' })
export const getExpiredDocuments = () => fetchJSON<TenantDocument[]>(`/api/rental/tenant-documents/expired/`)
export const getExpiringSoonDocuments = () => fetchJSON<TenantDocument[]>(`/api/rental/tenant-documents/expiring_soon/`)

export const listRentalActions = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<RentalAction>>(`/api/rental/actions/${query(params)}`)
export const getRentalAction = (id: string) => fetchJSON<RentalAction>(`/api/rental/actions/${id}/`)
export const listMeterReadings = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<MeterReading>>(`/api/rental/meter-readings/${query(params)}`)
export const getMeterReading = (id: string) => fetchJSON<MeterReading>(`/api/rental/meter-readings/${id}/`)
export const createMeterReading = (payload: MeterReadingWritePayload) => fetchJSON<MeterReading>('/api/rental/meter-readings/', json('POST', payload))
export const listInspections = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<InspectionSession>>(`/api/rental/inspections/${query(params)}`)
export const getInspection = (id: string) => fetchJSON<InspectionSession>(`/api/rental/inspections/${id}/`)
export const createInspection = (payload: InspectionWritePayload) => fetchJSON<InspectionSession>('/api/rental/inspections/', json('POST', payload))
export const closeInspection = (id: string) => fetchJSON<InspectionSession>(`/api/rental/inspections/${id}/close/`, { method: 'POST' })
export const listAcceptanceBatches = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<AcceptanceBatch>>(`/api/rental/acceptances/${query(params)}`)
export const getAcceptanceBatch = (id: string) => fetchJSON<AcceptanceBatch>(`/api/rental/acceptances/${id}/`)
export const createAcceptanceBatch = (occupation: string, batchType: 'INITIAL' | 'INCREMENTAL') => fetchJSON<AcceptanceBatch>('/api/rental/acceptances/', json('POST', { occupation, batch_type: batchType }))
export const signAcceptanceBatch = (id: string, payload: AcceptanceSignPayload) => fetchJSON<AcceptanceBatch>(`/api/rental/acceptances/${id}/sign/`, json('POST', payload))
