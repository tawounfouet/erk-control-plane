export type ContactType =
  | 'particulier'
  | 'entreprise'
  | 'association'
  | 'administration'
  | 'emergency'
  | 'service'
  | 'staff'

export type ContactPriority = 1 | 2 | 3 | 4

export interface ContactListItem {
  id: string
  type: ContactType
  type_display: string
  first_name: string
  last_name: string
  name: string
  organization: string
  position: string
  priority: ContactPriority
  priority_display: string
  phone_number: string
  email: string
  is_public: boolean
  is_emergency_contact: boolean
  is_active: boolean
  building_count: number
  created_at: string
}

export interface ContactPublic {
  id: string
  type: ContactType
  type_display: string
  first_name: string
  last_name: string
  name: string
  organization: string
  position: string
  department: string
  phone_number: string
  phone_number_secondary: string
  whatsapp_number: string
  email: string
  address: string
  availability_info: string
  priority: ContactPriority
  priority_display: string
  is_emergency_contact: boolean
  whatsapp_link: string | null
  call_link: string | null
  email_link: string | null
}

export interface ContactCarnet {
  emergency: ContactPublic[]
  staff: ContactPublic[]
  services: ContactPublic[]
  administration: ContactPublic[]
  businesses: ContactPublic[]
  associations: ContactPublic[]
  individuals: ContactPublic[]
}

export type ScheduleType = 'gestion' | 'urgence' | 'service' | 'maintenance' | 'custom'

export interface AvailabilitySchedule {
  id: string
  title: string
  schedule_type: ScheduleType
  schedule_type_display: string
  schedule_text: string
  icon: string
  description: string
  display_order: number
  is_highlighted: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export type NoteType = 'info' | 'tip' | 'warning' | 'urgent'

export interface ContactNote {
  id: string
  title: string
  content: string
  note_type: NoteType
  note_type_display: string
  icon: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
