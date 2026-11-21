import { fetchJSON } from './client'
import type { PaginatedResponse } from '@/lib/types/common.types'
import type { HistoryLog, Operation, OperationAttachment, OperationCategory, OperationComment, OperationDetail, OperationNotification, OperationStats, OperationStatus, OperationType, OperationWritePayload } from '@/lib/types/operations.types'

const root = '/api/operations'
const query = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : ''
const json = (method: string, body?: unknown): RequestInit => ({ method, ...(body !== undefined && { body: JSON.stringify(body) }) })
const crud = <T, P = Partial<T>>(path: string) => ({
  list: (params?: Record<string, string>) => fetchJSON<PaginatedResponse<T>>(`${root}/${path}/${query(params)}`),
  get: (id: string) => fetchJSON<T>(`${root}/${path}/${id}/`),
  create: (payload: P) => fetchJSON<T>(`${root}/${path}/`, json('POST', payload)),
  update: (id: string, payload: Partial<P>) => fetchJSON<T>(`${root}/${path}/${id}/`, json('PATCH', payload)),
  remove: (id: string) => fetchJSON<void>(`${root}/${path}/${id}/`, { method: 'DELETE' }),
})

const categories = crud<OperationCategory>('categories')
export const listAllCategories = categories.list
export const getCategory = categories.get
export const createCategory = categories.create
export const updateCategory = categories.update
export const deleteCategory = categories.remove
export const listCategories = () => fetchJSON<OperationCategory[]>(`${root}/categories/active/`)
export const getCategoryOperationTypes = (id: string) => fetchJSON<OperationType[]>(`${root}/categories/${id}/operation_types/`)

const types = crud<OperationType>('types')
export const listOperationTypes = types.list
export const getOperationType = types.get
export const createOperationType = types.create
export const updateOperationType = types.update
export const deleteOperationType = types.remove
export const getOperationTypesByCategory = (category: string) => fetchJSON<OperationType[]>(`${root}/types/by_category/?category=${encodeURIComponent(category)}`)
export const getOperationTypesRequiringApproval = () => fetchJSON<OperationType[]>(`${root}/types/requiring_approval/`)

const operations = crud<Operation, OperationWritePayload>('operations')
export const listOperations = operations.list
export const getOperation = (id: string) => fetchJSON<OperationDetail>(`${root}/operations/${id}/`)
export const createOperation = operations.create
export const updateOperation = operations.update
export const deleteOperation = operations.remove
export const getMyOperations = () => fetchJSON<Operation[]>(`${root}/operations/my_operations/`)
export const getMyRequests = () => fetchJSON<Operation[]>(`${root}/operations/my_requests/`)
export const getAssignedToMe = () => fetchJSON<Operation[]>(`${root}/operations/assigned_to_me/`)
export const getPendingOperations = () => fetchJSON<Operation[]>(`${root}/operations/pending/`)
export const getInProgressOperations = () => fetchJSON<Operation[]>(`${root}/operations/in_progress/`)
export const getOverdueOperations = () => fetchJSON<Operation[]>(`${root}/operations/overdue/`)
export const getHighPriorityOperations = () => fetchJSON<Operation[]>(`${root}/operations/high_priority/`)
export const assignOperation = (id: string, assignedToId: string, supervisorId?: string) => fetchJSON<OperationDetail>(`${root}/operations/${id}/assign/`, json('POST', { assigned_to_id: assignedToId, ...(supervisorId && { supervisor_id: supervisorId }) }))
export const startOperation = (id: string) => fetchJSON<OperationDetail>(`${root}/operations/${id}/start/`, { method: 'POST' })
export const completeOperation = (id: string, completionNotes?: string, actualDurationHours?: string) => fetchJSON<OperationDetail>(`${root}/operations/${id}/complete/`, json('POST', { completion_notes: completionNotes ?? '', ...(actualDurationHours && { actual_duration_hours: actualDurationHours }) }))
export const cancelOperation = (id: string, reason: string) => fetchJSON<OperationDetail>(`${root}/operations/${id}/cancel/`, json('POST', { reason }))
export const changeOperationStatus = (id: string, newStatus: OperationStatus, notes?: string) => fetchJSON<OperationDetail>(`${root}/operations/${id}/change_status/`, json('POST', { new_status: newStatus, notes: notes ?? '' }))
export const getOperationStats = () => fetchJSON<OperationStats>(`${root}/operations/statistics/`)
export const getOperationsByUnit = (unitId: string) => fetchJSON<Operation[]>(`${root}/operations/by_unit/?unit_id=${encodeURIComponent(unitId)}`)
export const getOperationsByBuilding = (buildingId: string) => fetchJSON<Operation[]>(`${root}/operations/by_building/?building_id=${encodeURIComponent(buildingId)}`)
export const getOperationsByResidence = (residenceId: string) => fetchJSON<Operation[]>(`${root}/operations/by_residence/?residence_id=${encodeURIComponent(residenceId)}`)

const comments = crud<OperationComment, Pick<OperationComment, 'operation' | 'content'> & Partial<Pick<OperationComment, 'is_internal' | 'parent_comment'>>>('comments')
export const listOperationComments = comments.list
export const getOperationComment = comments.get
export const createOperationComment = comments.create
export const updateOperationComment = comments.update
export const deleteOperationComment = comments.remove
export const getCommentsByOperation = (id: string) => fetchJSON<OperationComment[]>(`${root}/comments/by_operation/?operation_id=${encodeURIComponent(id)}`)
export const getCommentReplies = (id: string) => fetchJSON<OperationComment[]>(`${root}/comments/${id}/replies/`)

const notifications = crud<OperationNotification>('notifications')
export const listOperationNotifications = notifications.list
export const getOperationNotification = notifications.get
export const createOperationNotification = notifications.create
export const updateOperationNotification = notifications.update
export const deleteOperationNotification = notifications.remove
export const getUnreadOperationNotifications = () => fetchJSON<OperationNotification[]>(`${root}/notifications/unread/`)
export const markOperationNotificationRead = (id: string) => fetchJSON<OperationNotification>(`${root}/notifications/${id}/mark_as_read/`, { method: 'POST' })
export const markAllOperationNotificationsRead = () => fetchJSON<{ message: string }>(`${root}/notifications/mark_all_as_read/`, { method: 'POST' })

const attachments = crud<OperationAttachment>('attachments')
export const listOperationAttachments = attachments.list
export const getOperationAttachment = attachments.get
export const createOperationAttachment = attachments.create
export const updateOperationAttachment = attachments.update
export const deleteOperationAttachment = attachments.remove
export const getAttachmentsByOperation = (id: string) => fetchJSON<OperationAttachment[]>(`${root}/attachments/by_operation/?operation_id=${encodeURIComponent(id)}`)
export const getAttachmentsByType = (type: string, operationId?: string) => fetchJSON<OperationAttachment[]>(`${root}/attachments/by_type/?${new URLSearchParams({ type, ...(operationId && { operation_id: operationId }) })}`)
export const getOperationImages = (id: string) => fetchJSON<OperationAttachment[]>(`${root}/attachments/images/?operation=${encodeURIComponent(id)}`)
export const getOperationEvidencePhotos = (id: string) => fetchJSON<OperationAttachment[]>(`${root}/attachments/evidence_photos/?operation=${encodeURIComponent(id)}`)
export const getOperationUserUploads = (id: string) => fetchJSON<OperationAttachment[]>(`${root}/attachments/user_uploads/?operation=${encodeURIComponent(id)}`)
export const getOperationManagerUploads = (id: string) => fetchJSON<OperationAttachment[]>(`${root}/attachments/manager_uploads/?operation=${encodeURIComponent(id)}`)
export const getOperationDocuments = (id?: string) => fetchJSON<OperationAttachment[]>(`${root}/attachments/documents/${id ? `?operation_id=${encodeURIComponent(id)}` : ''}`)
export function uploadOperationAttachment(operation: string, file: File, payload: Record<string, string> = {}) { const body = new FormData(); body.append('operation', operation); body.append('file', file); Object.entries(payload).forEach(([key, value]) => body.append(key, value)); return fetchJSON<OperationAttachment>(`${root}/attachments/upload/`, { method: 'POST', body }) }
export function bulkUploadOperationAttachments(operation: string, files: File[], attachmentType = 'photo_evidence') { const body = new FormData(); body.append('operation', operation); body.append('attachment_type', attachmentType); files.forEach((file) => body.append('photos', file)); return fetchJSON<{ message: string; attachments: OperationAttachment[] }>(`${root}/attachments/bulk-upload/`, { method: 'POST', body }) }

export const listOperationHistory = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<HistoryLog>>(`${root}/history/${query(params)}`)
export const getOperationHistoryItem = (id: string) => fetchJSON<HistoryLog>(`${root}/history/${id}/`)
export const getHistoryByOperation = (id: string) => fetchJSON<HistoryLog[]>(`${root}/history/by_operation/?operation_id=${encodeURIComponent(id)}`)
export const getMyOperationActions = () => fetchJSON<HistoryLog[]>(`${root}/history/my_actions/`)
