export interface DashboardStats {
  total_units: number
  occupied_units: number
  available_units: number
  maintenance_units: number
  occupancy_rate: number
  active_tenants: number
  maintenance_open: number
  maintenance_in_progress: number
  unread_suggestions: number
}

export interface MonthlyRevenue {
  month: number
  revenue: number | null
}

export interface RevenueData {
  year: number
  monthly_revenue: MonthlyRevenue[]
  total_revenue: number
  current_mrr: number
}

export interface SearchResult {
  type: string
  id: string
  label: string
  url: string
  detail?: string
}

export interface SearchResponse {
  query: string
  count: number
  results: SearchResult[]
}

export type RecipientGroup = 'manager' | 'agent' | 'all'

export interface Notification {
  id: string
  recipient_group: RecipientGroup
  title: string
  message: string
  is_read: boolean
  read_at: string | null
  link: string
  created_at: string
}
