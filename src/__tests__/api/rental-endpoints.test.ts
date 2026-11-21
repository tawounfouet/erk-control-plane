import { describe, expect, it } from 'vitest'
import * as api from '@/lib/api/rental'

describe('rental control-plane API coverage', () => {
  it('covers tenant CRUD and business actions', async () => {
    expect((await api.listTenants()).count).toBe(3)
    expect((await api.getTenant('t-001')).user.email).toContain('@')
    expect(await api.getActiveTenants()).toHaveLength(3)
    expect(await api.getInactiveTenants()).toHaveLength(0)
    expect((await api.getMyTenantProfile()).id).toBe('t-001')
    expect((await api.getTenantStatistics()).total_tenants).toBe(3)
    expect((await api.listOccupations({ current: 'true' })).results[0].residents[0].tenant_name).toBe('Jean Dupont')
    expect((await api.getOccupation('occ-001')).unit_identifier).toBe('A-001')
    await expect(api.createTenant({ user_id: 'u-new' })).resolves.toMatchObject({ id: 't-new' })
    await expect(api.updateTenant('t-001', { notes: 'Dossier suivi' })).resolves.toMatchObject({ notes: 'Dossier suivi' })
    await expect(api.assignTenantUnit('t-001', 'u-002', '2026-10-01')).resolves.toMatchObject({ current_unit: 'u-002' })
    await expect(api.releaseTenantUnit('t-001', '2026-10-01')).resolves.toMatchObject({ current_unit: null })
    await expect(api.uploadTenantDocument('t-001', { document_type: 'ID_CARD', title: 'CNI', file: new File(['test'], 'cni.pdf', { type: 'application/pdf' }) })).resolves.toMatchObject({ id: 'd-new' })
    await expect(api.deleteTenant('t-001')).resolves.toBeUndefined()
  })

  it('covers tenant document lifecycle and audit actions', async () => {
    expect((await api.listDocuments()).count).toBe(4)
    expect((await api.getDocument('d-001')).document_type).toBe('CNI')
    await expect(api.createDocument({ tenant: 't-001', document_id: 'core-doc-001', document_type: 'OTHER' })).resolves.toMatchObject({ id: 'd-new' })
    await expect(api.updateDocument('d-001', { notes: 'Contrôlé' })).resolves.toMatchObject({ notes: 'Contrôlé' })
    await expect(api.verifyDocument('d-002')).resolves.toMatchObject({ is_verified: true })
    await expect(api.getExpiredDocuments()).resolves.toEqual([])
    await expect(api.getExpiringSoonDocuments()).resolves.toEqual([])
    await expect(api.deleteDocument('d-001')).resolves.toBeUndefined()
    expect((await api.listRentalActions()).results[0].action_type).toBe('UNIT_ASSIGNED')
    expect((await api.getRentalAction('act-001')).unit_identifier).toBe('A-001')
  })

  it('covers meter readings, inspections and acceptance sealing', async () => {
    expect((await api.listMeterReadings()).results[0].value).toBe('1284.50')
    expect((await api.getMeterReading('meter-001')).meter_type).toBe('ELECTRICITY')
    await expect(api.createMeterReading({ occupation: 'occ-001', meter_type: 'WATER', reading_type: 'INTERMEDIATE', value: '42', reading_date: '2026-10-01' })).resolves.toMatchObject({ id: 'meter-new' })
    expect((await api.listInspections()).results[0].lines).toHaveLength(1)
    expect((await api.getInspection('inspection-001')).inspection_type).toBe('ENTRY')
    await expect(api.createInspection({ occupation: 'occ-001', inspection_type: 'EXIT', inspection_date: '2026-10-01', lines: [] })).resolves.toMatchObject({ id: 'inspection-new' })
    await expect(api.closeInspection('inspection-001')).resolves.toMatchObject({ closed_at: expect.any(String) })
    expect((await api.listAcceptanceBatches()).results[0].content_hash).toHaveLength(64)
    expect((await api.getAcceptanceBatch('acceptance-001')).batch_type).toBe('INITIAL')
    await expect(api.createAcceptanceBatch('occ-001', 'INCREMENTAL')).resolves.toMatchObject({ id: 'acceptance-new' })
    await expect(api.signAcceptanceBatch('acceptance-001', { resident: 'resident-001', signature_svg: '<svg />' })).resolves.toMatchObject({ is_fully_accepted: true })
  })
})
