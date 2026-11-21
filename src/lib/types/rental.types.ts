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

export interface TenantWritePayload {
  user_id: string
  current_unit_id?: string | null
  move_in_date?: string | null
  move_out_date?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  notes?: string
}

export interface TenantDocumentWritePayload {
  tenant?: string
  document_id?: string
  document_type?: string
  expires_at?: string | null
  notes?: string
}

export type MeterType = 'ELECTRICITY' | 'WATER'
export type ReadingType = 'ENTRY' | 'INTERMEDIATE' | 'EXIT'

export interface MeterReading {
  id: string
  occupation: string
  unit_identifier: string
  meter_type: MeterType
  meter_type_display: string
  reading_type: ReadingType
  reading_type_display: string
  value: string
  reading_date: string
  recorded_by: string | null
  recorded_by_name: string | null
}

export interface MeterReadingWritePayload {
  occupation: string
  meter_type: MeterType
  reading_type: ReadingType
  value: string
  reading_date: string
}

export type InspectionType = 'ENTRY' | 'INTERMEDIATE' | 'EXIT'

export interface InspectionLine {
  id: string
  inspection: string
  equipment_assignment: string | null
  room_asset: string | null
  equipment_reference: string | null
  source_type: 'equipment' | 'room_asset' | null
  condition: string
  condition_display: string
  observation: string
  imputed_amount: string
}

export interface InspectionLineWritePayload {
  condition: string
  equipment_assignment?: string | null
  room_asset?: string | null
  imputed_amount?: string
  observation?: string
}

export interface InspectionSession {
  id: string
  occupation: string
  unit_identifier: string
  inspection_type: InspectionType
  inspection_type_display: string
  inspection_date: string
  conducted_by: string
  conducted_by_name: string | null
  general_observations: string
  closed_at: string | null
  lines: InspectionLine[]
  created_at: string
}

export interface InspectionWritePayload {
  occupation: string
  inspection_type: InspectionType
  inspection_date: string
  general_observations?: string
  lines?: InspectionLineWritePayload[]
}

export interface AcceptedItemSnapshot {
  id: string
  equipment_reference: string
  designation: string
  condition_at_acceptance: string
  observations: string
}

export interface AcceptanceSignature {
  id: string
  resident: string
  signed_by_name: string
  signed_at: string
  signature_svg: string
}

export interface AcceptanceBatch {
  id: string
  occupation: string
  unit_identifier: string
  batch_type: 'INITIAL' | 'INCREMENTAL'
  batch_type_display: string
  content_hash: string
  is_fully_accepted: boolean
  items: AcceptedItemSnapshot[]
  signatures: AcceptanceSignature[]
  created_at: string
}

export interface AcceptanceSignPayload {
  resident: string
  signature_svg: string
  ip_address?: string | null
  user_agent?: string
}

export interface OccupationResident {
  id: string
  tenant: string
  tenant_name: string
  tenant_email: string
  negotiated_rent: string
  security_deposit: string
  imputed_total: string
}

export interface Occupation {
  id: string
  managed_unit: string
  unit_identifier: string
  start_date: string
  end_date: string | null
  is_current: boolean
  is_validated: boolean
  validated_at: string | null
  resident_count: number
  residents: OccupationResident[]
}
