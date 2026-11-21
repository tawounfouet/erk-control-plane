export interface UserDetail extends User {
  date_of_birth?: string | null
  age?: number | null
  gender?: string | null
  gender_display?: string | null
  education_level?: string | null
  education_level_display?: string | null
  field_of_study?: string | null
  city_of_origin?: string | null
  language_preference?: string | null
  language_preference_display?: string | null
  school?: string | null
  date_joined: string
  last_login: string | null
  is_superuser: boolean
  role_priority?: number
  can_manage_own_reservations?: boolean
  can_access_residence_services?: boolean
  max_reservations_per_month?: number
  enforce_role_hierarchy?: boolean
  external_id?: string | null
  created_at?: string
  updated_at?: string
  created_by?: UserReference | null
  updated_by?: UserReference | null
  groups: Array<string | UserGroup>
  user_permissions: Array<string | UserPermission>
  effective_permissions?: string[]
  tenant_profile?: TenantProfile | null
  active_session_count?: number
}

export interface UserReference {
  id: string
  email: string
  full_name: string
}

export interface UserPermission {
  id: number
  name: string
  codename: string
  app_label: string
  model: string
}

export interface UserGroup {
  id: number
  name: string
  permissions: string[]
}

export interface UnitSummary {
  id: string
  identifier: string
  building: string | null
}

export interface TenantDocumentSummary {
  id: string
  title: string | null
  document_type: string
  document_type_display: string
  is_verified: boolean
  verified_by: string | null
  verified_at: string | null
  expires_at: string | null
  is_expired: boolean
  notes: string
  created_at: string
  updated_at: string
}

export interface TenantProfile {
  id: string
  is_active: boolean
  current_unit: UnitSummary | null
  active_unit: UnitSummary | null
  move_in_date: string | null
  move_out_date: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  notes: string
  is_currently_renting: boolean
  days_since_move_in: number | null
  lease_duration: number | null
  has_complete_documentation: boolean
  documents_count: number
  verified_documents_count: number
  pending_documents_count: number
  expired_documents_count: number
  documents: TenantDocumentSummary[]
  created_at: string
  updated_at: string
  created_by: UserReference | null
  updated_by: UserReference | null
}

export interface UserSession {
  id: string
  user: string
  session_type?: string
  ip_address: string
  user_agent: string
  created_at: string
  last_activity: string
  is_active: boolean
  is_expired?: boolean
  expires_at?: string | null
  duration?: number
  device_info?: {
    device_type: string
    browser: string
    os: string
  } | null
}

export interface StudentProfile {
  id: string
  user: UserDetail
  school: string
  level: string
  tutor_name: string
  tutor_phone: string
  documents: StudentDocument[]
  completion_rate: number
  is_complete: boolean
}

export interface StudentDocument {
  id: string
  document_type: string
  file_url: string
  uploaded_at: string
  verified: boolean
}

export interface AuditLogEntry {
  id: string
  user: string
  action: string
  app_name: string
  model_name: string
  object_id: string
  object_repr: string
  metadata: Record<string, unknown>
  timestamp: string
}

export interface SystemConfiguration {
  id: string
  key: string
  value: string
  category: string
  is_sensitive: boolean
  description: string
  updated_at: string
  updated_by: string
}

export interface Notification {
  id: string
  title: string
  message: string
  recipients: string[]
  priority: 'low' | 'normal' | 'high' | 'urgent'
  sent_at: string
  read_by: string[]
  expired_at: string | null
}

export interface MediaFile {
  id: string
  file: string
  file_name: string
  file_size: number
  media_type: string
  app_name: string
  uploaded_at: string
  uploaded_by: string
}

export interface ImportJob {
  id: string
  import_type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  total_rows: number
  processed_rows: number
  error_rows: number
  file_name: string
  created_at: string
  completed_at: string | null
  errors: string[]
}

export interface ExportJob {
  id: string
  export_type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  file_url: string | null
  filters: Record<string, unknown>
  created_at: string
  completed_at: string | null
}

export interface Permission {
  id: string
  name: string
  codename: string
  app_label: string
  model: string
}

export interface Group {
  id: string
  name: string
  permissions: Permission[]
  user_count: number
}

export interface ConditionReport {
  id: string
  unit: string
  unit_number: string
  report_type: 'entry' | 'exit'
  status: 'draft' | 'submitted' | 'validated' | 'rejected'
  manager_signature: string | null
  student_signature: string | null
  validated_at: string | null
  created_at: string
  sections: ConditionReportSection[]
}

export interface ConditionReportSection {
  id: string
  section_code: string
  section_name: string
  items: ConditionReportItem[]
  notes: string
  photos: string[]
}

export interface ConditionReportItem {
  id: string
  label: string
  state_before: 'A1' | 'A2' | 'A3'
  state_after: 'A1' | 'A2' | 'A3' | null
  comments: string
}

// Re-export User from auth types for convenience
import type { User } from './auth.types'
export type { User }
