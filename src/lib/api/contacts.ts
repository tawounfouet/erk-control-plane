import { fetchJSON } from './client'
import type { PaginatedResponse } from '@/lib/types/common.types'
import type {
  ContactListItem,
  ContactCarnet,
  AvailabilitySchedule,
  ContactNote,
} from '@/lib/types/contacts.types'

const CONTACTS = '/api/contacts'
const SCHEDULES = '/api/availability-schedules'
const NOTES = '/api/contact-notes'

export function listContacts(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<ContactListItem>>(`${CONTACTS}/${qs}`)
}

export function getContact(id: string) {
  return fetchJSON<ContactListItem>(`${CONTACTS}/${id}/`)
}

export function getCarnet() {
  return fetchJSON<ContactCarnet>(`${CONTACTS}/carnet/`)
}

export function getEmergencyContacts() {
  return fetchJSON<ContactListItem[]>(`${CONTACTS}/emergency/`)
}

export function getPublicContacts() {
  return fetchJSON<ContactListItem[]>(`${CONTACTS}/public/`)
}

export function listSchedules(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<AvailabilitySchedule>>(`${SCHEDULES}/${qs}`)
}

export function listContactNotes(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : ''
  return fetchJSON<PaginatedResponse<ContactNote>>(`${NOTES}/${qs}`)
}
