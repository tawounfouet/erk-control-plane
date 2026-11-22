export const MOCK_TENANTS = [
  {
    id: 't-001',
    user: { id: 'u-user-1', email: 'jean.dupont@email.com', first_name: 'Jean', last_name: 'Dupont' },
    current_unit: 'u-001',
    current_unit_identifier: 'A-001',
    is_currently_renting: true,
    move_in_date: '2025-01-15',
    documents_count: 3,
    verified_documents_count: 2,
    created_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 't-002',
    user: { id: 'u-user-2', email: 'marie.ndiaye@email.com', first_name: 'Marie', last_name: 'Ndiaye' },
    current_unit: 'u-003',
    current_unit_identifier: 'A-101',
    is_currently_renting: true,
    move_in_date: '2025-02-01',
    documents_count: 4,
    verified_documents_count: 4,
    created_at: '2025-01-25T00:00:00Z',
  },
  {
    id: 't-003',
    user: { id: 'u-user-3', email: 'paul.biyong@email.com', first_name: 'Paul', last_name: 'Biyong' },
    current_unit: 'u-005',
    current_unit_identifier: 'B-001',
    is_currently_renting: true,
    move_in_date: '2025-03-01',
    documents_count: 2,
    verified_documents_count: 1,
    created_at: '2025-02-20T00:00:00Z',
  },
]

export const MOCK_TENANT_DOCUMENTS = [
  { id: 'd-001', tenant: 't-001', document: { title: 'CNI Jean Dupont' }, document_type: 'CNI', document_type_display: 'Carte nationale d\'identité', status: 'verified', status_display: 'Vérifié', is_verified: true, file_url: '/docs/cni_jean.pdf', file_extension: 'pdf', expires_at: '2028-06-15', created_at: '2025-01-10T00:00:00Z' },
  { id: 'd-002', tenant: 't-001', document: { title: 'Contrat de location' }, document_type: 'CONTRAT', document_type_display: 'Contrat de location', status: 'pending', status_display: 'En attente', is_verified: false, file_url: '/docs/contrat_jean.pdf', file_extension: 'pdf', expires_at: null, created_at: '2025-01-10T00:00:00Z' },
  { id: 'd-003', tenant: 't-002', document: { title: 'CNI Marie Ndiaye' }, document_type: 'CNI', document_type_display: 'Carte nationale d\'identité', status: 'verified', status_display: 'Vérifié', is_verified: true, file_url: '/docs/cni_marie.pdf', file_extension: 'pdf', expires_at: '2027-11-20T00:00:00Z', created_at: '2025-01-25T00:00:00Z' },
  { id: 'd-004', tenant: 't-002', document: { title: 'Passeport Marie Ndiaye' }, document_type: 'PASSPORT', document_type_display: 'Passeport', status: 'verified', status_display: 'Vérifié', is_verified: true, file_url: '/docs/passeport_marie.pdf', file_extension: 'pdf', expires_at: '2029-03-10T00:00:00Z', created_at: '2025-01-25T00:00:00Z' },
]

export const MOCK_RENTAL_ACTIONS = [{ id: 'act-001', action_type: 'UNIT_ASSIGNED', action_type_display: 'Logement affecté', title: 'Affectation de A-001', description: 'Entrée du locataire enregistrée', user: 'u-admin', performed_by_name: 'Administrateur Eureka', tenant: 't-001', tenant_name: 'Jean Dupont', unit: 'u-001', unit_identifier: 'A-001', tenant_document: null, metadata: {}, created_at: '2026-09-01T10:00:00Z' }]

export const MOCK_METER_READINGS = [{ id: 'meter-001', occupation: 'occ-001', unit_identifier: 'A-001', meter_type: 'ELECTRICITY', meter_type_display: 'Électricité (kWh)', reading_type: 'ENTRY', reading_type_display: "Relevé d'entrée", value: '1284.50', reading_date: '2026-09-01', recorded_by: 'u-admin', recorded_by_name: 'Administrateur Eureka' }]

export const MOCK_INSPECTIONS = [{ id: 'inspection-001', occupation: 'occ-001', unit_identifier: 'A-001', inspection_type: 'ENTRY', inspection_type_display: "État des lieux d'entrée", inspection_date: '2026-09-01', conducted_by: 'u-admin', conducted_by_name: 'Administrateur Eureka', general_observations: 'Logement remis en bon état.', closed_at: null, lines: [{ id: 'line-001', inspection: 'inspection-001', equipment_assignment: 'ia-001', room_asset: null, equipment_reference: 'CLI-2026-SAM-00001', source_type: 'equipment', condition: 'G', condition_display: 'Bon', observation: '', imputed_amount: '0.00' }], created_at: '2026-09-01T09:00:00Z' }]

export const MOCK_ACCEPTANCES = [{ id: 'acceptance-001', occupation: 'occ-001', unit_identifier: 'A-001', batch_type: 'INITIAL', batch_type_display: 'Initial - rentrée générale', content_hash: '4d6f3c77d53b8f068fbb6f49f7b2ff722df389c46fb8885574227d97eb7d9e87', is_fully_accepted: false, items: [{ id: 'snapshot-001', equipment_reference: 'CLI-2026-SAM-00001', designation: 'Climatiseur Samsung', condition_at_acceptance: 'G', observations: '' }], signatures: [], created_at: '2026-09-01T09:30:00Z' }]

export const MOCK_OCCUPATIONS = [{ id: 'occ-001', managed_unit: 'u-001', unit_identifier: 'A-001', start_date: '2026-09-01', end_date: null, is_current: true, is_validated: false, validated_at: null, resident_count: 1, residents: [{ id: 'resident-001', tenant: 't-001', tenant_name: 'Jean Dupont', tenant_email: 'jean.dupont@email.com', negotiated_rent: '85000.00', security_deposit: '170000.00', imputed_total: '0.00' }] }]
