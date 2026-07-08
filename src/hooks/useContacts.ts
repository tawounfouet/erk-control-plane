import { useQuery } from '@tanstack/react-query'
import {
  listContacts,
  getContact,
  getCarnet,
  getEmergencyContacts,
  getPublicContacts,
} from '@/lib/api/contacts'

export function useContacts(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => listContacts(params),
  })
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => getContact(id),
    enabled: !!id,
  })
}

export function useCarnet() {
  return useQuery({
    queryKey: ['contacts', 'carnet'],
    queryFn: getCarnet,
    staleTime: 5 * 60 * 1000,
  })
}

export function useEmergencyContacts() {
  return useQuery({
    queryKey: ['contacts', 'emergency'],
    queryFn: getEmergencyContacts,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePublicContacts() {
  return useQuery({
    queryKey: ['contacts', 'public'],
    queryFn: getPublicContacts,
  })
}
