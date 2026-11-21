export const MOCK_OPERATIONS = [
  {
    id: 'o-001',
    title: 'Fuite d\'eau A-101',
    description: 'Robinetterie de la cuisine qui fuit',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    category_name: 'Plomberie',
    unit_identifier: 'A-101',
    building_name: 'Résidence Eureka A',
    assigned_to_name: 'Thomas Awounfouet',
    requested_by_name: 'Marie Ndiaye',
    created_at: '2026-06-28T10:00:00Z',
    updated_at: '2026-06-30T14:00:00Z',
  },
  {
    id: 'o-002',
    title: 'Climatisation HS B-001',
    description: 'La climatisation ne refroidit plus',
    status: 'PENDING_VALIDATION',
    priority: 'HIGH',
    category_name: 'Climatisation',
    unit_identifier: 'B-001',
    building_name: 'Résidence Eureka B',
    assigned_to_name: null,
    requested_by_name: 'Paul Biyong',
    created_at: '2026-07-01T08:30:00Z',
    updated_at: '2026-07-01T08:30:00Z',
  },
  {
    id: 'o-003',
    title: 'Peinture couloir RDC',
    description: 'Reprendre la peinture du couloir du rez-de-chaussée',
    status: 'CREATED',
    priority: 'NORMAL',
    category_name: 'Peinture',
    unit_identifier: null,
    building_name: 'Résidence Eureka A',
    assigned_to_name: null,
    requested_by_name: 'Admin Eureka',
    created_at: '2026-07-02T15:00:00Z',
    updated_at: '2026-07-02T15:00:00Z',
  },
  {
    id: 'o-004',
    title: 'Changement ampoule hall',
    description: 'Néon du hall d\'entrée à remplacer',
    status: 'COMPLETED',
    priority: 'LOW',
    category_name: 'Électricité',
    unit_identifier: null,
    building_name: 'Résidence Eureka A',
    assigned_to_name: 'Thomas Awounfouet',
    requested_by_name: 'Admin Eureka',
    created_at: '2026-06-25T09:00:00Z',
    updated_at: '2026-06-26T11:00:00Z',
  },
]

export const MOCK_OPERATION_DETAIL = {
  ...MOCK_OPERATIONS[0],
  comments: [
    { id: 'oc-001', operation: 'o-001', author_name: 'Thomas Awounfouet', text: 'J\'ai commandé le joint d\'étanchéité', is_internal: false, created_at: '2026-06-29T10:00:00Z' },
    { id: 'oc-002', operation: 'o-001', author_name: 'Admin Eureka', text: 'Le locataire confirme que ça fuit toujours', is_internal: true, created_at: '2026-06-30T08:00:00Z' },
  ],
  history: [
    { id: 'oh-001', operation: 'o-001', field: 'status', old_value: 'APPROVED', new_value: 'IN_PROGRESS', changed_by_name: 'Admin Eureka', created_at: '2026-06-29T10:00:00Z' },
    { id: 'oh-002', operation: 'o-001', field: 'assigned_to', old_value: '', new_value: 'Thomas Awounfouet', changed_by_name: 'Admin Eureka', created_at: '2026-06-29T09:00:00Z' },
  ],
}

export const MOCK_OPERATION_STATS = {
  total: 4,
  by_status: { CREATED: 1, PENDING_VALIDATION: 1, APPROVED: 0, IN_PROGRESS: 1, COMPLETED: 1, CANCELLED: 0 },
  by_priority: { LOW: 1, NORMAL: 1, HIGH: 1, URGENT: 1 },
  overdue: 1,
}

export const MOCK_OPERATION_CATEGORIES = [{ id: 'cat-001', code: 'PLUMBING', name: 'Plomberie', description: 'Réseaux et sanitaires', color_code: '#2563eb', icon_name: 'droplets', sort_order: 1, operation_types_count: 1, is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }]
export const MOCK_OPERATION_TYPES = [{ id: 'type-001', name: 'Fuite', code: 'LEAK', description: 'Recherche et réparation de fuite', category_details: MOCK_OPERATION_CATEGORIES[0], requires_approval: false, default_priority: 'HIGH', sla_hours: 24, color_code: '#2563eb', icon_name: 'droplets', operations_count: 1, is_active: true }]
export const MOCK_OPERATION_COMMENTS = [{ id: 'comment-001', operation: 'o-001', author: 'u-admin', author_details: { id: 'u-admin', email: 'admin@eureka.test', first_name: 'Admin', last_name: 'Eureka' }, content: 'Intervention planifiée.', is_internal: true, parent_comment: null, replies_count: 0, created_at: '2026-06-29T10:00:00Z', updated_at: '2026-06-29T10:00:00Z' }]
export const MOCK_OPERATION_HISTORY = [{ id: 'history-001', operation: 'o-001', user: 'u-admin', user_details: null, action_type: 'STATUS_CHANGE', action_type_display: 'Changement de statut', description: 'Opération démarrée', formatted_description: 'Opération démarrée', previous_status: 'CREATED', new_status: 'IN_PROGRESS', duration_hours: null, cost_amount: null, created_at: '2026-06-29T10:00:00Z' }]
export const MOCK_OPERATION_ATTACHMENTS = [{ id: 'attachment-001', operation: 'o-001', media_file: 'media-001', attachment_type: 'photo_evidence', attachment_type_display: 'Photo du signalement', attachment_category: 'user_report', is_user_upload: true, is_manager_upload: false, is_required: false, is_confidential: false, tags: '', notes: '', sort_order: 0, file_url: '/media/leak.jpg', file_extension: 'jpg', is_image: true, is_document: false, created_at: '2026-06-28T10:05:00Z' }]
export const MOCK_OPERATION_NOTIFICATIONS = [{ id: 'notification-001', operation: 'o-001', title: 'Nouvelle affectation', message: 'Vous êtes affecté à une opération', notification_type: 'info', operation_notification_type: 'assigned', is_read: false, read_at: null, created_at: '2026-06-28T10:00:00Z' }]
