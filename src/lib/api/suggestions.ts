import { fetchJSON } from './client'
import type { PaginatedResponse } from '@/lib/types/common.types'
import type {
  SuggestionListItem,
  SuggestionDetail,
  SuggestionCreatePayload,
  SuggestionStatistics,
} from '@/lib/types/suggestions.types'

const BASE = '/api/suggestions/suggestions'

export function listSuggestions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<SuggestionListItem>>(`${BASE}/${qs}`)
}

export function getSuggestion(id: string) {
  return fetchJSON<SuggestionDetail>(`${BASE}/${id}/`)
}

export function createSuggestion(data: SuggestionCreatePayload) {
  return fetchJSON<SuggestionDetail>(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getMySuggestions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<SuggestionListItem>>(`${BASE}/my_suggestions/${qs}`)
}

export function getPendingSuggestions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<SuggestionListItem>>(`${BASE}/pending/${qs}`)
}

export function getUnderReviewSuggestions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<SuggestionListItem>>(`${BASE}/under_review/${qs}`)
}

export function getImplementedSuggestions(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<SuggestionListItem>>(`${BASE}/implemented/${qs}`)
}

export function getSuggestionStatistics() {
  return fetchJSON<SuggestionStatistics>(`${BASE}/statistics/`)
}
