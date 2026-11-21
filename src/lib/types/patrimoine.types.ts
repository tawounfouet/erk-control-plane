export type { PaginatedResponse } from './common.types'

export interface Building {
  id: string
  name: string
  code: string
  address: string
  main_image: string | null
  main_image_url: string | null
  main_image_thumbnail_url: string | null
  total_area_m2: string | null
  floors_count: number
  floors_count_actual: number
  units_count: number
  construction_year: number | null
  manager: string | null
  manager_name: string | null
  is_active: boolean
}

export interface FloorMinimal {
  id: string
  number: number
  chemical_code: string
  name: string
  area_m2: string | null
  units_count: number
}

export interface BuildingDetail extends Building {
  description: string
  occupancy_rate: number
  floors: FloorMinimal[]
  main_image_details: MediaFile | null
  all_images_details: MediaFile[]
  created_at: string
  updated_at: string
}

export interface BuildingStats {
  building_id: string
  building_name: string
  floors_count: number
  total_units: number
  units_by_status: Record<string, number>
  rentable_units: number
  occupied_units: number
  occupancy_rate: number
  total_area_m2: string | null
}

export interface MediaFile {
  id: string
  title: string
  description: string
  media_type: string
  file: string
  file_url: string
  thumbnail_url: string
  file_size_formatted: string
  created_at: string
}

export interface Floor {
  id: string
  building: string
  building_name: string
  number: number
  chemical_code: string
  name: string
  full_name: string
  area_m2: string | null
  floor_plan: string | null
  floor_plan_url: string | null
  plan_url: string | null
  units_count: number
  is_active: boolean
}

export interface FloorDetail extends Floor {
  building_details: Building
  units: UnitMinimal[]
  images_details: MediaFile[]
  created_at: string
  updated_at: string
}

export interface UnitMinimal {
  id: string
  identifier: string
  name: string
  full_name: string
  unit_type: string
  unit_type_name: string
  area_m2: string | null
  current_status: UnitStatus
  monthly_rent: string | null
}

export interface Unit {
  id: string
  floor: string
  building_name: string
  floor_code: string
  unit_type: string
  unit_type_name: string
  parent: string | null
  identifier: string
  name: string
  full_name: string
  main_image_url: string | null
  main_image_thumbnail_url: string | null
  area_m2: string | null
  current_status: UnitStatus
  monthly_rent: string | null
  monthly_charges: string | null
  total_monthly_cost: string | null
  current_occupant: string | null
  occupant_name: string | null
  occupation_start_date: string | null
  is_active: boolean
}

export type UnitStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'OUT_OF_SERVICE'

export interface UnitDetail extends Unit {
  floor_details: Floor
  unit_type_details: UnitType
  manager_details: UserBasic | null
  occupant_details: UserBasic | null
  features: UnitFeature[]
  children: UnitMinimal[]
  security_deposit: string | null
  manager: string | null
  notes: string
  metadata: Record<string, unknown>
  is_available: boolean
  is_rentable: boolean
  is_composite: boolean
  children_count: number
  inventory_items_count: number
  created_at: string
  updated_at: string
}

export interface UserBasic {
  id: string
  email: string
  first_name: string
  last_name: string
}

export interface UnitType {
  id: string
  name: string
  code: string
  description: string
  is_composite: boolean
  is_rentable: boolean
  color_display: string
  sort_order: number
  units_count: number
  is_active: boolean
}

export interface UnitFeature {
  id: string
  unit: string
  feature_name: string
  feature_type: string
  feature_value: string
  formatted_value: string
  display_order: number
  is_active: boolean
}

export interface InventoryItem {
  id: string
  name: string
  category: InventoryCategory
  category_display: string
  brand: string
  model: string
  reference: string
  description: string
  stock_quantity: number
  unit_price: string | null
  technical_specs: Record<string, unknown>
  notes: string
  main_image_url: string | null
  main_image_thumbnail_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type InventoryCategory = 'FURNITURE' | 'APPLIANCE' | 'PLUMBING' | 'LIGHTING' | 'HEATING' | 'IT' | 'SECURITY' | 'DECORATION' | 'OTHER'

export interface InventoryAssignment {
  id: string
  inventory_item: string
  inventory_item_name: string
  unit: string
  unit_identifier: string
  serial_number: string
  assignment_date: string
  return_date: string | null
  condition_on_assignment: string
  current_condition: string
  purchase_price: string | null
  purchase_date: string | null
  warranty_end_date: string | null
  assigned_by_name: string | null
  returned_by_name: string | null
  notes: string
  is_assigned: boolean
  is_under_warranty: boolean
}

export interface Intervention {
  id: string
  unit: string
  unit_name: string
  title: string
  category: string
  priority: string
  status: string
  requested_by: string | null
  requested_by_name: string
  assigned_to: string | null
  assigned_to_name: string | null
  request_date: string
  scheduled_date: string | null
  completion_date: string | null
  estimated_cost: string | null
  actual_cost: string | null
  is_overdue: boolean
  is_active: boolean
}

export interface InterventionDetail extends Intervention {
  unit_details: UnitMinimal
  inventory_item: string | null
  inventory_item_details: InventoryItem | null
  description: string
  start_date: string | null
  before_images_details: MediaFile[]
  after_images_details: MediaFile[]
  documents_details: MediaFile[]
  resolution: string
  technical_notes: string
  duration: number | null
  time_since_request: number | null
  created_at: string
  updated_at: string
}

export interface InterventionStatistics {
  total: number
  by_status: Record<string, number>
  by_priority: Record<string, number>
  by_category: Record<string, number>
}

export interface UnitStatusHistory {
  id: string
  unit: string
  unit_name: string
  old_status: UnitStatus
  new_status: UnitStatus
  changed_by: string | null
  changed_by_name: string | null
  change_date: string
  notes: string
  is_active: boolean
  created_at: string
}

export interface UnitHierarchy {
  unit: UnitDetail
  path: string
  children: UnitMinimal[]
}

export interface RoomAsset {
  id: string
  managed_unit: string
  unit_identifier: string
  code: string
  asset_type: string
  asset_type_display: string
  name: string
  description: string
}

export interface Equipment {
  id: string
  technical_reference: string
  template: string
  template_name: string
  designation: string
  brand: string
  model_name: string
  serial_number: string | null
  condition: EquipmentCondition
  condition_display: string
  status: EquipmentStatus
  status_display: string
  is_assigned: boolean
  purchase_date: string | null
  acquisition_year: number
  warranty_end_date: string | null
  notes: string
  purchase_price?: string
  ancillary_cost?: string
  cost_price?: string
  disposal_amount?: string
  created_at: string
}

export type EquipmentCondition = 'TB' | 'B' | 'M' | 'D' | 'HS'
export type EquipmentStatus = 'IN_STOCK' | 'ASSIGNED' | 'OUT_OF_INVENTORY'

export interface EquipmentCreateInput {
  template: string
  designation?: string
  brand?: string
  model_name?: string
  serial_number?: string
  condition?: EquipmentCondition
  purchase_price?: string
  ancillary_cost?: string
  purchase_date?: string | null
  acquisition_year?: number
  warranty_end_date?: string | null
  notes?: string
}

export interface EquipmentUpdateInput {
  designation?: string
  brand?: string
  model_name?: string
  serial_number?: string | null
  warranty_end_date?: string | null
  notes?: string
}

export interface EquipmentAssignInput {
  managed_unit: string
  occupation?: string | null
  entry_condition?: EquipmentCondition
  notes?: string
}

export interface InvoiceLine {
  id: string
  equipment: string
  technical_reference: string
  equipment_category: string
  unit_purchase_price: string
}

export interface Invoice {
  id: string
  invoice_number: string
  supplier_name: string
  invoice_date: string
  total_amount: string
  calculated_total: string
  file_attachment: string | null
  file_url: string | null
  uploaded_by: string
  uploaded_by_name: string | null
  status: 'ACTIVE' | 'CANCELLED' | 'REPLACED'
  voided_at: string | null
  voided_by: string | null
  void_reason: string
  replacement_invoice: string | null
  equipment_lines: InvoiceLine[]
  created_at: string
}

export interface InvoiceCreateInput {
  invoice_number: string
  supplier_name: string
  invoice_date: string
  total_amount?: string | null
  file_attachment?: string | null
  lines: Array<{ equipment: string; unit_purchase_price: string }>
}
