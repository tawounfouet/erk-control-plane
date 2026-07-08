import { fetchJSON } from './client'
import type { DashboardStats, RevenueData, SearchResponse, Notification } from '@/lib/types/manager.types'

export function getDashboardStats() {
  return fetchJSON<DashboardStats>('/api/manager/dashboard/stats/')
}

export function getRevenue() {
  return fetchJSON<RevenueData>('/api/manager/dashboard/revenue/')
}

export function globalSearch(q: string) {
  return fetchJSON<SearchResponse>(`/api/manager/search/?q=${encodeURIComponent(q)}`)
}

export function listNotifications() {
  return fetchJSON<Notification[]>('/api/manager/notifications/')
}

export function markNotificationRead(id: string) {
  return fetchJSON<Notification>(`/api/manager/notifications/${id}/read/`, {
    method: 'POST',
  })
}
