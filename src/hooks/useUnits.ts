import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changeUnitStatus,
  getAvailableUnits,
  getIntervention,
  getStatusHistoryByUnit,
  getUnit,
  getUnitHierarchy,
  listInterventions,
  listRoomAssets,
  listUnits,
} from '@/lib/api/patrimoine'
import { queryKeys } from '@/lib/query-client'

export function useUnits(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.units, params],
    queryFn: () => listUnits(params),
  })
}

export function useUnit(id: string) {
  return useQuery({
    queryKey: queryKeys.patrimoine.unit(id),
    queryFn: () => getUnit(id),
    enabled: !!id,
  })
}

export function useAvailableUnits() {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.units, 'available'],
    queryFn: getAvailableUnits,
  })
}

export function useUnitHierarchy(id: string) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.unit(id), 'hierarchy'],
    queryFn: () => getUnitHierarchy(id),
    enabled: !!id,
  })
}

export function useUnitStatusHistory(id: string) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.unit(id), 'status-history'],
    queryFn: () => getStatusHistoryByUnit(id),
    enabled: !!id,
  })
}

export function useUnitRoomAssets(id: string) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.unit(id), 'room-assets'],
    queryFn: () => listRoomAssets({ managed_unit: id }),
    enabled: !!id,
  })
}

export function useChangeUnitStatus(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ status, notes }: { status: string; notes?: string }) =>
      changeUnitStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patrimoine.unit(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.patrimoine.units })
    },
  })
}

export function useInterventions(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.interventions, params],
    queryFn: () => listInterventions(params),
  })
}

export function useIntervention(id: string) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.interventions, id],
    queryFn: () => getIntervention(id),
    enabled: !!id,
  })
}
