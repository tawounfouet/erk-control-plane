import { fetchJSON } from './client'
import type { PaginatedResponse } from '@/lib/types/common.types'
import type { SuggestionAttachment, SuggestionComment, SuggestionCreatePayload, SuggestionDetail, SuggestionListItem, SuggestionMutationResponse, SuggestionResponse, SuggestionStatistics, SuggestionStatus } from '@/lib/types/suggestions.types'

const root = '/api/suggestions'
const query = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : ''
const json = (method: string, body?: unknown): RequestInit => ({ method, ...(body !== undefined && { body: JSON.stringify(body) }) })
const crud = <T, P = Partial<T>>(path: string) => ({
  list: (params?: Record<string, string>) => fetchJSON<PaginatedResponse<T>>(`${root}/${path}/${query(params)}`),
  get: (id: string) => fetchJSON<T>(`${root}/${path}/${id}/`),
  create: (payload: P) => fetchJSON<T>(`${root}/${path}/`, json('POST', payload)),
  update: (id: string, payload: Partial<P>) => fetchJSON<T>(`${root}/${path}/${id}/`, json('PATCH', payload)),
  remove: (id: string) => fetchJSON<void>(`${root}/${path}/${id}/`, { method: 'DELETE' }),
})

const suggestions = crud<SuggestionListItem, SuggestionCreatePayload>('suggestions')
export const listSuggestions = suggestions.list
export const getSuggestion = (id: string) => fetchJSON<SuggestionDetail>(`${root}/suggestions/${id}/`)
export async function createSuggestion(data: SuggestionCreatePayload) { return (await fetchJSON<SuggestionMutationResponse<SuggestionDetail>>(`${root}/suggestions/`, json('POST', data))).data }
export const updateSuggestion = (id: string, data: Partial<SuggestionCreatePayload>) => fetchJSON<SuggestionDetail>(`${root}/suggestions/${id}/`, json('PATCH', data))
export const deleteSuggestion = suggestions.remove
export const getMySuggestions = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<SuggestionListItem>>(`${root}/suggestions/my_suggestions/${query(params)}`)
export const getPendingSuggestions = () => fetchJSON<SuggestionListItem[]>(`${root}/suggestions/pending/`)
export const getUnderReviewSuggestions = () => fetchJSON<SuggestionListItem[]>(`${root}/suggestions/under_review/`)
export const getImplementedSuggestions = () => fetchJSON<SuggestionListItem[]>(`${root}/suggestions/implemented/`)
export async function changeSuggestionStatus(id: string, status: SuggestionStatus) { return (await fetchJSON<SuggestionMutationResponse<SuggestionDetail>>(`${root}/suggestions/${id}/change_status/`, json('POST', { status }))).data }
export async function assignSuggestion(id: string, assignedTo: string) { return (await fetchJSON<SuggestionMutationResponse<SuggestionDetail>>(`${root}/suggestions/${id}/assign/`, json('POST', { assigned_to: assignedTo }))).data }
export async function addSuggestionResponse(id: string, responseText: string, isOfficial = true) { return (await fetchJSON<SuggestionMutationResponse<SuggestionResponse>>(`${root}/suggestions/${id}/add_response/`, json('POST', { response_text: responseText, is_official: isOfficial }))).data }
export async function addSuggestionComment(id: string, comment: string, isInternal = true) { return (await fetchJSON<SuggestionMutationResponse<SuggestionComment>>(`${root}/suggestions/${id}/add_comment/`, json('POST', { comment, is_internal: isInternal }))).data }
export const getSuggestionStatistics = () => fetchJSON<SuggestionStatistics>(`${root}/suggestions/statistics/`)

const responses = crud<SuggestionResponse>('responses')
export const listSuggestionResponses = responses.list
export const getSuggestionResponse = responses.get
export const createSuggestionResponse = responses.create
export const updateSuggestionResponse = responses.update
export const deleteSuggestionResponse = responses.remove
export const resendSuggestionResponseEmail = (id: string) => fetchJSON<{ success: boolean; message: string }>(`${root}/responses/${id}/resend_email/`, { method: 'POST' })

const comments = crud<SuggestionComment>('comments')
export const listSuggestionComments = comments.list
export const getSuggestionComment = comments.get
export const createSuggestionComment = comments.create
export const updateSuggestionComment = comments.update
export const deleteSuggestionComment = comments.remove

export const listSuggestionAttachments = (params?: Record<string, string>) => fetchJSON<PaginatedResponse<SuggestionAttachment>>(`${root}/attachments/${query(params)}`)
export const getSuggestionAttachment = (id: string) => fetchJSON<SuggestionAttachment>(`${root}/attachments/${id}/`)
export function createSuggestionAttachment(payload: { suggestion: string; title: string; file: File; description?: string; file_type?: string }) { const body = new FormData(); Object.entries(payload).forEach(([key, value]) => body.append(key, value)); return fetchJSON<SuggestionAttachment>(`${root}/attachments/`, { method: 'POST', body }) }
export const updateSuggestionAttachment = (id: string, payload: Partial<SuggestionAttachment>) => fetchJSON<SuggestionAttachment>(`${root}/attachments/${id}/`, json('PATCH', payload))
export const deleteSuggestionAttachment = (id: string) => fetchJSON<void>(`${root}/attachments/${id}/`, { method: 'DELETE' })
