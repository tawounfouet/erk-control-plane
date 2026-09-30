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
