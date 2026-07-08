import { useQuery } from '@tanstack/react-query'
import { listInventoryItems, getInventoryItem, listAssignments, getAssignment, getAssignmentsByUnit } from '@/lib/api/patrimoine'
import { queryKeys } from '@/lib/query-client'

export function useInventoryItems(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.inventory, params],
    queryFn: () => listInventoryItems(params),
  })
}

export function useInventoryItem(id: string) {
  return useQuery({
    queryKey: queryKeys.patrimoine.inventoryItem(id),
    queryFn: () => getInventoryItem(id),
    enabled: !!id,
  })
}

export function useAssignments(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.assignments, params],
    queryFn: () => listAssignments(params),
  })
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: queryKeys.patrimoine.assignment(id),
    queryFn: () => getAssignment(id),
    enabled: !!id,
  })
}

export function useAssignmentsByUnit(unitId: string) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.assignments, 'by_unit', unitId],
    queryFn: () => getAssignmentsByUnit(unitId),
    enabled: !!unitId,
  })
}
