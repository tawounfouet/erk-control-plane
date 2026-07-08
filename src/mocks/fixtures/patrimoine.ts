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
}

export const MOCK_INVENTORY_ITEMS = [
  { id: 'i-001', name: 'Climatisation 9000 BTU', reference: 'CLIM-9000', category: 'Climatisation', brand: 'Samsung', model: 'AR9500T', stock_quantity: 5, available_quantity: 3, unit_price: 350000, created_at: '2025-01-01T00:00:00Z' },
  { id: 'i-002', name: 'Chauffe-eau 50L', reference: 'CE-50', category: 'Plomberie', brand: 'Atlantic', model: 'Steatite VM', stock_quantity: 4, available_quantity: 2, unit_price: 180000, created_at: '2025-01-01T00:00:00Z' },
  { id: 'i-003', name: 'Ventilateur plafond', reference: 'VENT-PLAF', category: 'Équipement', brand: 'Belling', model: 'Breeze', stock_quantity: 10, available_quantity: 8, unit_price: 45000, created_at: '2025-01-01T00:00:00Z' },
]

export const MOCK_INVENTORY_ASSIGNMENTS = [
  { id: 'ia-001', inventory_item: 'i-001', item_name: 'Climatisation 9000 BTU', unit: 'u-001', unit_identifier: 'A-001', quantity: 1, status: 'active', assigned_at: '2025-03-01T00:00:00Z' },
  { id: 'ia-002', inventory_item: 'i-003', item_name: 'Ventilateur plafond', unit: 'u-001', unit_identifier: 'A-001', quantity: 2, status: 'active', assigned_at: '2025-03-01T00:00:00Z' },
]
