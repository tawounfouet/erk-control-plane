import { useQuery } from '@tanstack/react-query'
import {
  listSuggestions,
  getSuggestion,
  getMySuggestions,
  getSuggestionStatistics,
} from '@/lib/api/suggestions'

export function useSuggestions(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['suggestions', params],
    queryFn: () => listSuggestions(params),
  })
}

export function useSuggestion(id: string) {
  return useQuery({
    queryKey: ['suggestion', id],
    queryFn: () => getSuggestion(id),
    enabled: !!id,
  })
}

export function useMySuggestions(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['suggestions', 'my', params],
    queryFn: () => getMySuggestions(params),
  })
}

export function useSuggestionStatistics() {
  return useQuery({
    queryKey: ['suggestions', 'statistics'],
    queryFn: getSuggestionStatistics,
    staleTime: 2 * 60 * 1000,
  })
}
