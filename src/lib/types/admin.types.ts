export interface UserDetail extends User {
  date_joined: string
  last_login: string | null
  is_superuser: boolean
  groups: string[]
  user_permissions: string[]
}

export interface UserSession {
  id: string
  user: string
  ip_address: string
  user_agent: string
  created_at: string
  last_activity: string
  is_active: boolean
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
