import { fetchJSON } from './client'
import type { PaginatedResponse } from '@/lib/types/patrimoine.types'
import type { Operation, OperationDetail, OperationCategory, OperationType, OperationComment, HistoryLog, OperationStats } from '@/lib/types/operations.types'

export function listOperations(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<Operation>>(`/api/operations/operations/${qs}`)
}

export function getOperation(id: string) {
  return fetchJSON<OperationDetail>(`/api/operations/operations/${id}/`)
}

export function getMyOperations() {
  return fetchJSON<Operation[]>(`/api/operations/operations/my_operations/`)
}

export function getAssignedToMe() {
  return fetchJSON<Operation[]>(`/api/operations/operations/assigned_to_me/`)
}

export function getPendingOperations() {
  return fetchJSON<Operation[]>(`/api/operations/operations/pending/`)
}

export function getInProgressOperations() {
  return fetchJSON<Operation[]>(`/api/operations/operations/in_progress/`)
}

export function getOverdueOperations() {
  return fetchJSON<Operation[]>(`/api/operations/operations/overdue/`)
}

export function getOperationsByUnit(unitId: string) {
  return fetchJSON<Operation[]>(`/api/operations/operations/by_unit/?unit_id=${unitId}`)
}

export function getOperationStats() {
  return fetchJSON<OperationStats>(`/api/operations/operations/statistics/`)
}

export function listCategories() {
  return fetchJSON<OperationCategory[]>(`/api/operations/categories/active/`)
}

export function listOperationTypes(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<OperationType[]>(`/api/operations/types/${qs}`)
}

export function getCommentsByOperation(operationId: string) {
  return fetchJSON<OperationComment[]>(`/api/operations/comments/by_operation/?operation_id=${operationId}`)
}

export function getHistoryByOperation(operationId: string) {
  return fetchJSON<HistoryLog[]>(`/api/operations/history/by_operation/?operation_id=${operationId}`)
}
