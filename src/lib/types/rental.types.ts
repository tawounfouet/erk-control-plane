export interface Tenant {
  id: string
  user: UserBasic
  current_unit: string | null
  current_unit_identifier: string | null
  move_in_date: string | null
  move_out_date: string | null
  is_currently_renting: boolean
  days_since_move_in: number | null
  documents_count: number
  verified_documents_count: number
  pending_documents_count: number
  emergency_contact_name: string
  emergency_contact_phone: string
  created_at: string
}

export interface TenantDetail extends Omit<Tenant, 'current_unit'> {
  current_unit: UnitNested | null
  rental_unit_identifier: string | null
  rental_unit_info: string | null
  lease_duration: number | null
  has_complete_documentation: boolean
  expired_documents_count: number
  notes: string
  tenant_documents: TenantDocument[]
  updated_at: string
}

export interface TenantStatistics {
  total_tenants: number
  active_tenants: number
  inactive_tenants: number
  tenants_with_complete_docs: number
  tenants_with_pending_docs: number
  tenants_with_expired_docs: number
  total_documents: number
  verified_documents: number
  pending_documents: number
  expired_documents: number
}

export interface UserBasic {
  id: string
  email: string
  first_name: string
  last_name: string
}

export interface UnitNested {
  id: string
  identifier: string
  name: string
  full_name: string
  floor: string
  building_name: string
  floor_code: string
  unit_type: string
  unit_type_name: string
  area_m2: string | null
  current_status: string
  monthly_rent: string | null
  is_active: boolean
}

export interface TenantDocument {
  id: string
  tenant: string
  document: DocumentNested
  document_type: string
  document_type_display: string
  is_verified: boolean
  verified_by: string | null
  verified_by_name: string | null
  verified_at: string | null
  expires_at: string | null
  is_expired: boolean
  notes: string
  file_url: string
  file_extension: string
  created_at: string
  updated_at: string
}

export interface DocumentNested {
  id: string
  title: string
  description: string
  app_name: string
  file: string
  file_url: string
  created_at: string
}

export interface RentalAction {
  id: string
  action_type: string
  action_type_display: string
  title: string
  description: string
  user: string | null
  performed_by_name: string | null
  tenant: string | null
  tenant_name: string | null
  unit: string | null
  unit_identifier: string | null
  tenant_document: string | null
  metadata: Record<string, unknown>
  created_at: string
}
