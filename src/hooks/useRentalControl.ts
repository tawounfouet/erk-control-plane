import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  assignTenantUnit, closeInspection, createAcceptanceBatch, createInspection, createMeterReading,
  listAcceptanceBatches, listInspections, listMeterReadings, listOccupations, listRentalActions,
  releaseTenantUnit, signAcceptanceBatch, uploadTenantDocument, verifyDocument,
} from '@/lib/api/rental'
import { queryKeys } from '@/lib/query-client'
import type { AcceptanceSignPayload, InspectionWritePayload, MeterReadingWritePayload } from '@/lib/types/rental.types'

export function useRentalActions(params?: Record<string, string>) {
  return useQuery({ queryKey: [...queryKeys.rental.actions, params], queryFn: () => listRentalActions(params) })
}

export function useOccupations(params?: Record<string, string>) {
  return useQuery({ queryKey: [...queryKeys.rental.occupations, params], queryFn: () => listOccupations(params) })
}

export function useMeterReadings(params?: Record<string, string>) {
  return useQuery({ queryKey: [...queryKeys.rental.meters, params], queryFn: () => listMeterReadings(params) })
}

export function useInspections(params?: Record<string, string>) {
  return useQuery({ queryKey: [...queryKeys.rental.inspections, params], queryFn: () => listInspections(params) })
}

export function useAcceptanceBatches(params?: Record<string, string>) {
  return useQuery({ queryKey: [...queryKeys.rental.acceptances, params], queryFn: () => listAcceptanceBatches(params) })
}

export function useRentalMutations() {
  const client = useQueryClient()
  const invalidate = (key: readonly unknown[]) => client.invalidateQueries({ queryKey: key })
  return {
    createMeter: useMutation({ mutationFn: (payload: MeterReadingWritePayload) => createMeterReading(payload), onSuccess: () => invalidate(queryKeys.rental.meters) }),
    createInspection: useMutation({ mutationFn: (payload: InspectionWritePayload) => createInspection(payload), onSuccess: () => invalidate(queryKeys.rental.inspections) }),
    closeInspection: useMutation({ mutationFn: closeInspection, onSuccess: () => invalidate(queryKeys.rental.inspections) }),
    createAcceptance: useMutation({ mutationFn: ({ occupation, batchType }: { occupation: string; batchType: 'INITIAL' | 'INCREMENTAL' }) => createAcceptanceBatch(occupation, batchType), onSuccess: () => invalidate(queryKeys.rental.acceptances) }),
    signAcceptance: useMutation({ mutationFn: ({ id, payload }: { id: string; payload: AcceptanceSignPayload }) => signAcceptanceBatch(id, payload), onSuccess: () => invalidate(queryKeys.rental.acceptances) }),
    verifyDocument: useMutation({ mutationFn: verifyDocument, onSuccess: () => { invalidate(queryKeys.rental.documents); invalidate(queryKeys.rental.tenants) } }),
    assignUnit: useMutation({ mutationFn: ({ tenantId, unitId, moveInDate }: { tenantId: string; unitId: string; moveInDate?: string }) => assignTenantUnit(tenantId, unitId, moveInDate), onSuccess: () => { invalidate(queryKeys.rental.tenants); invalidate(queryKeys.patrimoine.units) } }),
    releaseUnit: useMutation({ mutationFn: ({ tenantId, moveOutDate }: { tenantId: string; moveOutDate?: string }) => releaseTenantUnit(tenantId, moveOutDate), onSuccess: () => { invalidate(queryKeys.rental.tenants); invalidate(queryKeys.patrimoine.units) } }),
    uploadDocument: useMutation({ mutationFn: ({ tenantId, payload }: { tenantId: string; payload: { document_type: string; file: File; title: string; expires_at?: string; notes?: string } }) => uploadTenantDocument(tenantId, payload), onSuccess: () => { invalidate(queryKeys.rental.documents); invalidate(queryKeys.rental.tenants) } }),
  }
}
