import { useQuery } from '@tanstack/react-query'
import { listBuildings, getBuilding, getBuildingStats } from '@/lib/api/patrimoine'
import { queryKeys } from '@/lib/query-client'

export function useBuildings(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.buildings, params],
    queryFn: () => listBuildings(params),
  })
}

export function useBuilding(id: string) {
  return useQuery({
    queryKey: queryKeys.patrimoine.building(id),
    queryFn: () => getBuilding(id),
    enabled: !!id,
  })
}

export function useBuildingStats(id: string) {
  return useQuery({
    queryKey: [...queryKeys.patrimoine.building(id), 'stats'],
    queryFn: () => getBuildingStats(id),
    enabled: !!id,
  })
}
