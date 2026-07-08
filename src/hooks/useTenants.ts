import { useQuery } from '@tanstack/react-query'
import { listTenants, getTenant, getActiveTenants, getTenantStatistics, listDocuments, getExpiredDocuments, listRentalActions } from '@/lib/api/rental'
import { queryKeys } from '@/lib/query-client'

export function useTenants(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.rental.tenants, params],
    queryFn: () => listTenants(params),
  })
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: queryKeys.rental.tenant(id),
    queryFn: () => getTenant(id),
    enabled: !!id,
  })
}

export function useActiveTenants() {
  return useQuery({
    queryKey: [...queryKeys.rental.tenants, 'active'],
    queryFn: getActiveTenants,
  })
}

export function useTenantStatistics() {
  return useQuery({
    queryKey: [...queryKeys.rental.tenants, 'statistics'],
    queryFn: getTenantStatistics,
  })
}

export function useTenantDocuments(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.rental.tenants, 'documents', params],
    queryFn: () => listDocuments(params),
  })
}

export function useExpiredDocuments() {
  return useQuery({
    queryKey: [...queryKeys.rental.tenants, 'documents', 'expired'],
    queryFn: getExpiredDocuments,
  })
}

export function useRentalActions(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...queryKeys.rental.tenants, 'actions', params],
    queryFn: () => listRentalActions(params),
  })
}
