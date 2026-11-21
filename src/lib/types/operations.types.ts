export type OperationStatus = 'CREATED' | 'PENDING_VALIDATION' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export type OperationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

export interface Operation {
  id: string
  operation_number: string
  operation_type: string
  operation_type_name: string
  title: string
  description: string
  status: OperationStatus
  status_display: string
  priority: OperationPriority
  priority_display: string
  requester: string | null
  requester_name: string
  assigned_to: string | null
  assigned_to_name: string | null
  supervisor: string | null
  due_date: string | null
  started_at: string | null
  completed_at: string | null
  managed_unit: string | null
  managed_unit_details: ManagedUnitNested | null
  tags: string[]
  is_overdue: boolean
  days_until_due: number | null
  is_high_priority: boolean
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface OperationDetail extends Operation {
  operation_type_details: OperationType | null
  requester_details: UserBasic | null
  assigned_to_details: UserBasic | null
  supervisor_details: UserBasic | null
  metadata: Record<string, unknown>
  estimated_duration_hours: number | null
  actual_duration_hours: string | null
  comments: OperationComment[]
  history_logs: HistoryLog[]
  comments_count: number
}

export interface ManagedUnitNested {
  id: string
  identifier: string
  name: string
  building_name: string
  floor_code: string
}

export interface UserBasic {
  id: string
  email: string
  first_name: string
  last_name: string
}

export interface OperationCategory {
  id: string
  code: string
  name: string
  description: string
  color_code: string
  icon_name: string
  sort_order: number
  operation_types_count: number
  is_active: boolean
}

export interface OperationType {
  id: string
  name: string
  code: string
  description: string
  requires_approval: boolean
  default_priority: OperationPriority
  sla_hours: number | null
  color_code: string
  icon_name: string
  operations_count: number
  is_active: boolean
}

export interface OperationComment {
  id: string
  operation: string
  author: string
  author_details: UserBasic | null
  content: string
  is_internal: boolean
  parent_comment: string | null
  replies_count: number
  created_at: string
  updated_at: string
}

export interface HistoryLog {
  id: string
  operation: string
  user: string | null
  user_details: UserBasic | null
  action_type: string
  action_type_display: string
  description: string
  formatted_description: string
  previous_status: string | null
  new_status: string | null
  duration_hours: string | null
  cost_amount: string | null
  created_at: string
}

export interface OperationStats {
  total: number
  by_status: Record<string, number>
  by_priority: Record<string, number>
  overdue: number
  assigned_to_me?: number
  requested_by_me?: number
}

export type OperationWritePayload = Partial<Pick<Operation, 'title' | 'description' | 'priority' | 'due_date' | 'managed_unit' | 'tags' | 'is_active'>> & {
  operation_type?: string
  operation_type_code?: string
}

export interface OperationNotification {
  id: string
  operation: string | null
  title: string
  message: string
  notification_type: string
  operation_notification_type: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

export interface OperationAttachment {
  id: string
  operation: string
  media_file: string
  attachment_type: string
  attachment_type_display: string
  attachment_category: string
  is_user_upload: boolean
  is_manager_upload: boolean
  is_required: boolean
  is_confidential: boolean
  tags: string
  notes: string
  sort_order: number
  file_url: string
  file_extension: string
  is_image: boolean
  is_document: boolean
  created_at: string
}
