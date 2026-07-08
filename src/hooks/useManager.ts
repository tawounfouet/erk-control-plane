import { useQuery } from '@tanstack/react-query'
import {
  getDashboardStats,
  getRevenue,
  globalSearch,
  listNotifications,
} from '@/lib/api/manager'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['manager', 'stats'],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000,
  })
}

export function useRevenue() {
  return useQuery({
    queryKey: ['manager', 'revenue'],
    queryFn: getRevenue,
    staleTime: 5 * 60 * 1000,
  })
}

export function useGlobalSearch(query: string) {
  return useQuery({
    queryKey: ['manager', 'search', query],
    queryFn: () => globalSearch(query),
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}

export function useNotifications() {
  return useQuery({
    queryKey: ['manager', 'notifications'],
    queryFn: listNotifications,
    staleTime: 30 * 1000,
  })
}
