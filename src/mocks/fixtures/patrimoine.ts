export const MOCK_BUILDINGS = [
  { id: 'b-001', name: 'Résidence Eureka A', code: 'A', address: '123 Rue Principale', city: 'Douala', description: 'Bâtiment principal', units_count: 12, floors_count_actual: 3, created_at: '2025-01-01T00:00:00Z' },
  { id: 'b-002', name: 'Résidence Eureka B', code: 'B', address: '45 Avenue des Palmiers', city: 'Douala', description: 'Bâtiment secondaire', units_count: 8, floors_count_actual: 2, created_at: '2025-01-01T00:00:00Z' },
]

export const MOCK_FLOORS = [
  { id: 'f-001', building: 'b-001', name: 'Rez-de-chaussée', number: 0, unit_count: 4, created_at: '2025-01-01T00:00:00Z' },
  { id: 'f-002', building: 'b-001', name: '1er étage', number: 1, unit_count: 4, created_at: '2025-01-01T00:00:00Z' },
  { id: 'f-003', building: 'b-001', name: '2ème étage', number: 2, unit_count: 4, created_at: '2025-01-01T00:00:00Z' },
  { id: 'f-004', building: 'b-002', name: 'Rez-de-chaussée', number: 0, unit_count: 4, created_at: '2025-01-01T00:00:00Z' },
  { id: 'f-005', building: 'b-002', name: '1er étage', number: 1, unit_count: 4, created_at: '2025-01-01T00:00:00Z' },
]

export const MOCK_UNITS = [
  { id: 'u-001', building: 'b-001', floor: 'f-001', identifier: 'A-001', name: 'Studio A1', unit_type_name: 'Studio', surface_area: 25, monthly_rent: 150000, current_status: 'OCCUPIED', is_furnished: true, features: ['Climatisation', 'Eau chaude'], created_at: '2025-01-01T00:00:00Z' },
  { id: 'u-002', building: 'b-001', floor: 'f-001', identifier: 'A-002', name: 'Studio A2', unit_type_name: 'Studio', surface_area: 25, monthly_rent: 150000, current_status: 'AVAILABLE', is_furnished: true, features: ['Climatisation'], created_at: '2025-01-01T00:00:00Z' },
  { id: 'u-003', building: 'b-001', floor: 'f-002', identifier: 'A-101', name: 'T2 A101', unit_type_name: 'T2', surface_area: 45, monthly_rent: 250000, current_status: 'OCCUPIED', is_furnished: true, features: ['Climatisation', 'Eau chaude', 'Parking'], created_at: '2025-01-01T00:00:00Z' },
  { id: 'u-004', building: 'b-001', floor: 'f-003', identifier: 'A-201', name: 'T3 A201', unit_type_name: 'T3', surface_area: 65, monthly_rent: 350000, current_status: 'MAINTENANCE', is_furnished: true, features: ['Climatisation', 'Eau chaude', 'Parking', 'Balcon'], created_at: '2025-01-01T00:00:00Z' },
  { id: 'u-005', building: 'b-002', floor: 'f-004', identifier: 'B-001', name: 'Studio B1', unit_type_name: 'Studio', surface_area: 22, monthly_rent: 120000, current_status: 'OCCUPIED', is_furnished: false, features: ['Ventilateur'], created_at: '2025-01-01T00:00:00Z' },
]

export const MOCK_BUILDING_STATS = {
  id: 'b-001',
  name: 'Résidence Eureka A',
  total_units: 12,
  occupied_units: 8,
  available_units: 2,
  maintenance_units: 1,
  reserved_units: 1,
  occupancy_rate: 66.7,
  floors_count: 3,
  units_by_status: { AVAILABLE: 2, OCCUPIED: 8, MAINTENANCE: 1, RESERVED: 1, OUT_OF_SERVICE: 0 },
}

export const MOCK_INVENTORY_ITEMS = [
  { id: 'i-001', name: 'Climatisation 9000 BTU', reference: 'CLIM-9000', category: 'Climatisation', brand: 'Samsung', model: 'AR9500T', stock_quantity: 5, available_quantity: 3, unit_price: 350000, created_at: '2025-01-01T00:00:00Z' },
  { id: 'i-002', name: 'Chauffe-eau 50L', reference: 'CE-50', category: 'Plomberie', brand: 'Atlantic', model: 'Steatite VM', stock_quantity: 4, available_quantity: 2, unit_price: 180000, created_at: '2025-01-01T00:00:00Z' },
  { id: 'i-003', name: 'Ventilateur plafond', reference: 'VENT-PLAF', category: 'Équipement', brand: 'Belling', model: 'Breeze', stock_quantity: 10, available_quantity: 8, unit_price: 45000, created_at: '2025-01-01T00:00:00Z' },
]

export const MOCK_INVENTORY_ASSIGNMENTS = [
  { id: 'ia-001', inventory_item: 'i-001', inventory_item_name: 'Climatisation 9000 BTU', unit: 'u-001', unit_identifier: 'A-001', serial_number: 'LEGACY-001', assignment_date: '2025-03-01T00:00:00Z', return_date: null, condition_on_assignment: 'GOOD', current_condition: 'GOOD', purchase_price: '350000.00', purchase_date: '2025-02-15', warranty_end_date: '2027-02-15', assigned_by_name: 'Admin Eureka', returned_by_name: null, notes: '', is_assigned: true, is_under_warranty: true },
  { id: 'ia-002', inventory_item: 'i-003', inventory_item_name: 'Ventilateur plafond', unit: 'u-001', unit_identifier: 'A-001', serial_number: 'LEGACY-002', assignment_date: '2025-03-01T00:00:00Z', return_date: null, condition_on_assignment: 'GOOD', current_condition: 'GOOD', purchase_price: '45000.00', purchase_date: '2025-02-15', warranty_end_date: null, assigned_by_name: 'Admin Eureka', returned_by_name: null, notes: '', is_assigned: true, is_under_warranty: false },
]

export const MOCK_UNIT_TYPES = [
  { id: 'ut-001', name: 'Studio', code: 'STUDIO', description: 'Unité autonome louable', is_composite: false, is_rentable: true, color_display: '#0f766e', sort_order: 1, units_count: 4, is_active: true },
  { id: 'ut-002', name: 'Appartement T2', code: 'T2', description: 'Appartement deux pièces', is_composite: true, is_rentable: true, color_display: '#0369a1', sort_order: 2, units_count: 1, is_active: true },
]

export const MOCK_UNIT_FEATURES = [
  { id: 'uf-001', unit: 'u-001', feature_name: 'Climatisation', feature_type: 'BOOLEAN', feature_value: 'true', formatted_value: 'Oui', display_order: 1, is_active: true },
  { id: 'uf-002', unit: 'u-001', feature_name: 'Balcon', feature_type: 'BOOLEAN', feature_value: 'false', formatted_value: 'Non', display_order: 2, is_active: true },
]

export const MOCK_STATUS_HISTORY = [
  { id: 'ush-001', unit: 'u-001', unit_name: 'A-001 · Studio A1', old_status: 'AVAILABLE', new_status: 'OCCUPIED', changed_by: 'u-admin', changed_by_name: 'Admin Eureka', change_date: '2026-09-01T08:00:00Z', notes: 'Occupation activée', is_active: true, created_at: '2026-09-01T08:00:00Z' },
]

export const MOCK_ROOM_ASSETS = [
  { id: 'ra-001', managed_unit: 'u-001', unit_identifier: 'A-001', code: 'WALL-01', asset_type: 'WALL_FLOOR', asset_type_display: 'Murs, sol et carrelage', name: 'Peinture des murs', description: 'Revêtement mural de la pièce principale' },
  { id: 'ra-002', managed_unit: 'u-001', unit_identifier: 'A-001', code: 'SAN-01', asset_type: 'SANITARY', asset_type_display: 'Sanitaires', name: 'Lavabo', description: 'Lavabo et robinetterie' },
]

export const MOCK_EQUIPMENTS = [
  { id: 'eq-001', technical_reference: 'CLI-2026-SAM-00001', template: 'i-001', template_name: 'Climatisation 9000 BTU', designation: 'Climatiseur chambre A-001', brand: 'Samsung', model_name: 'AR9500T', serial_number: 'SN-001', condition: 'B', condition_display: 'Bon', status: 'ASSIGNED', status_display: 'Assigné', is_assigned: true, purchase_date: '2026-01-10', acquisition_year: 2026, warranty_end_date: '2028-01-10', notes: '', purchase_price: '350000.00', ancillary_cost: '15000.00', cost_price: '365000.00', disposal_amount: '0.00', created_at: '2026-01-10T08:00:00Z' },
  { id: 'eq-002', technical_reference: 'VEN-2026-BEL-00002', template: 'i-003', template_name: 'Ventilateur plafond', designation: 'Ventilateur de réserve', brand: 'Belling', model_name: 'Breeze', serial_number: 'SN-002', condition: 'TB', condition_display: 'Très bon', status: 'IN_STOCK', status_display: 'En stock', is_assigned: false, purchase_date: '2026-02-01', acquisition_year: 2026, warranty_end_date: null, notes: '', purchase_price: '45000.00', ancillary_cost: '0.00', cost_price: '45000.00', disposal_amount: '0.00', created_at: '2026-02-01T08:00:00Z' },
]

export const MOCK_INVOICES = [
  { id: 'inv-001', invoice_number: 'FAC-2026-001', supplier_name: 'Equipements Cameroun', invoice_date: '2026-02-01', total_amount: '45000.00', calculated_total: '45000.00', file_attachment: null, file_url: null, uploaded_by: 'u-admin', uploaded_by_name: 'Admin Eureka', status: 'ACTIVE', voided_at: null, voided_by: null, void_reason: '', replacement_invoice: null, equipment_lines: [{ id: 'line-001', equipment: 'eq-002', technical_reference: 'VEN-2026-BEL-00002', equipment_category: 'APPLIANCE', unit_purchase_price: '45000.00' }], created_at: '2026-02-01T09:00:00Z' },
]

export const MOCK_PATRIMOINE_INTERVENTIONS = [
  { id: 'pi-001', unit: 'u-004', unit_name: 'A-201 · T3 A201', title: 'Contrôle installation électrique', category: 'ELECTRICAL', priority: 'HIGH', status: 'PENDING', requested_by: 'u-admin', requested_by_name: 'Admin Eureka', assigned_to: null, assigned_to_name: null, request_date: '2026-09-29T08:00:00Z', scheduled_date: '2026-10-02T09:00:00Z', completion_date: null, estimated_cost: null, actual_cost: null, is_overdue: false, is_active: true },
]
