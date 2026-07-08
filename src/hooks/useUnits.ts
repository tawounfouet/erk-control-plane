import { useQuery } from '@tanstack/react-query'
import { listUnits, getUnit, getAvailableUnits, listInterventions, getIntervention } from '@/lib/api/patrimoine'
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
