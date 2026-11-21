import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  patrimoine: {
    buildings: ['patrimoine', 'buildings'] as const,
    building: (id: string) => ['patrimoine', 'buildings', id] as const,
    floors: ['patrimoine', 'floors'] as const,
    floor: (id: string) => ['patrimoine', 'floors', id] as const,
    units: ['patrimoine', 'units'] as const,
    unit: (id: string) => ['patrimoine', 'units', id] as const,
    inventory: ['patrimoine', 'inventory'] as const,
    inventoryItem: (id: string) => ['patrimoine', 'inventory', id] as const,
    assignments: ['patrimoine', 'assignments'] as const,
    assignment: (id: string) => ['patrimoine', 'assignments', id] as const,
    interventions: ['patrimoine', 'interventions'] as const,
  },
  rental: {
    tenants: ['rental', 'tenants'] as const,
    occupations: ['rental', 'occupations'] as const,
    tenant: (id: string) => ['rental', 'tenants', id] as const,
    documents: ['rental', 'documents'] as const,
    actions: ['rental', 'actions'] as const,
    meters: ['rental', 'meter-readings'] as const,
    inspections: ['rental', 'inspections'] as const,
    acceptances: ['rental', 'acceptances'] as const,
  },
  operations: {
    all: ['operations'] as const,
    detail: (id: string) => ['operations', id] as const,
  },
  contacts: {
    all: ['contacts'] as const,
    emergency: ['contacts', 'emergency'] as const,
  },
  suggestions: {
    all: ['suggestions'] as const,
    detail: (id: string) => ['suggestions', id] as const,
  },
  manager: {
    dashboard: ['manager', 'dashboard'] as const,
    revenue: ['manager', 'revenue'] as const,
    search: (q: string) => ['manager', 'search', q] as const,
  },
}
