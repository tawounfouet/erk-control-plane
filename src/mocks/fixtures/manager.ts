export const MOCK_DASHBOARD_STATS = {
  total_units: 20,
  occupied_units: 13,
  available_units: 4,
  maintenance_units: 2,
  occupancy_rate: 65.0,
  active_tenants: 13,
  maintenance_open: 5,
  maintenance_in_progress: 2,
  unread_suggestions: 1,
}

export const MOCK_REVENUE = {
  year: 2026,
  monthly_revenue: [
    { month: 1, revenue: 3200000 },
    { month: 2, revenue: 3200000 },
    { month: 3, revenue: 3350000 },
    { month: 4, revenue: 3350000 },
    { month: 5, revenue: 3500000 },
    { month: 6, revenue: 3500000 },
    { month: 7, revenue: 3500000 },
    { month: 8, revenue: null },
    { month: 9, revenue: null },
    { month: 10, revenue: null },
    { month: 11, revenue: null },
    { month: 12, revenue: null },
  ],
  total_revenue: 21000000,
  current_mrr: 3500000,
}

export const MOCK_GLOBAL_SEARCH = {
  query: 'test',
  count: 3,
  results: [
    { type: 'tenant', id: 't-001', label: 'Jean Dupont (jean.dupont@email.com)', url: '/api/rental/tenants/t-001/' },
    { type: 'unit', id: 'u-001', label: 'A-001 — Studio A1', url: '/api/patrimoine/managedunits/u-001/' },
    { type: 'contact', id: 'c-st-1', label: 'Awounfouet Thomas', url: '/api/contacts/c-st-1/' },
  ],
}
