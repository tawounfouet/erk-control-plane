import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listSuggestions,
  getSuggestion,
  getMySuggestions,
  getSuggestionStatistics,
  addSuggestionComment,
  addSuggestionResponse,
  assignSuggestion,
  changeSuggestionStatus,
  createSuggestionAttachment,
  createSuggestion,
} from '@/lib/api/suggestions'
import type { SuggestionStatus } from '@/lib/types/suggestions.types'

export function useSuggestions(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['suggestions', params],
    queryFn: () => listSuggestions(params),
  })
}

export function useSuggestionMutations(id: string) {
  const client = useQueryClient()
  const refresh = () => { client.invalidateQueries({ queryKey: ['suggestion', id] }); client.invalidateQueries({ queryKey: ['suggestions'] }) }
  return {
    changeStatus: useMutation({ mutationFn: (status: SuggestionStatus) => changeSuggestionStatus(id, status), onSuccess: refresh }),
    assign: useMutation({ mutationFn: (userId: string) => assignSuggestion(id, userId), onSuccess: refresh }),
    respond: useMutation({ mutationFn: ({ text, official }: { text: string; official: boolean }) => addSuggestionResponse(id, text, official), onSuccess: refresh }),
    comment: useMutation({ mutationFn: ({ text, internal }: { text: string; internal: boolean }) => addSuggestionComment(id, text, internal), onSuccess: refresh }),
    attach: useMutation({ mutationFn: ({ title, file, fileType }: { title: string; file: File; fileType: string }) => createSuggestionAttachment({ suggestion: id, title, file, file_type: fileType }), onSuccess: refresh }),
  }
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

export function useCreateSuggestion() {
  const client = useQueryClient()
  return useMutation({ mutationFn: createSuggestion, onSuccess: () => client.invalidateQueries({ queryKey: ['suggestions'] }) })
}
