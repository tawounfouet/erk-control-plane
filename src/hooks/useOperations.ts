import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOperation, listOperations, getOperation, getMyOperations, getAssignedToMe, getPendingOperations, getOverdueOperations, getOperationStats, listCategories, listOperationTypes, getCommentsByOperation, getHistoryByOperation } from '@/lib/api/operations'
import { queryKeys } from '@/lib/query-client'
import type { OperationWritePayload } from '@/lib/types/operations.types'

export function useOperations(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.operations.all, params],
    queryFn: () => listOperations(params),
  })
}

export function useOperation(id: string) {
  return useQuery({
    queryKey: queryKeys.operations.detail(id),
    queryFn: () => getOperation(id),
    enabled: !!id,
  })
}

export function useMyOperations() {
  return useQuery({
    queryKey: [...queryKeys.operations.all, 'my'],
    queryFn: getMyOperations,
  })
}

export function useAssignedToMe() {
  return useQuery({
    queryKey: [...queryKeys.operations.all, 'assigned'],
    queryFn: getAssignedToMe,
  })
}

export function usePendingOperations() {
  return useQuery({
    queryKey: [...queryKeys.operations.all, 'pending'],
    queryFn: getPendingOperations,
  })
}

export function useOverdueOperations() {
  return useQuery({
    queryKey: [...queryKeys.operations.all, 'overdue'],
    queryFn: getOverdueOperations,
  })
}

export function useOperationStats() {
  return useQuery({
    queryKey: [...queryKeys.operations.all, 'stats'],
    queryFn: getOperationStats,
  })
}

export function useOperationCategories() {
  return useQuery({
    queryKey: [...queryKeys.operations.all, 'categories'],
    queryFn: listCategories,
  })
}

export function useOperationTypes() {
  return useQuery({ queryKey: [...queryKeys.operations.all, 'types'], queryFn: () => listOperationTypes() })
}

export function useCreateOperation() {
  const client = useQueryClient()
  return useMutation({ mutationFn: (payload: OperationWritePayload) => createOperation(payload), onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.operations.all }) })
}

export function useOperationComments(operationId: string) {
  return useQuery({
    queryKey: [...queryKeys.operations.detail(operationId), 'comments'],
    queryFn: () => getCommentsByOperation(operationId),
    enabled: !!operationId,
  })
}

export function useOperationHistory(operationId: string) {
  return useQuery({
    queryKey: [...queryKeys.operations.detail(operationId), 'history'],
    queryFn: () => getHistoryByOperation(operationId),
    enabled: !!operationId,
  })
}
