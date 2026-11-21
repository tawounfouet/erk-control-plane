import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '@/lib/api/patrimoine'
import type {
  EquipmentAssignInput,
  EquipmentCondition,
  EquipmentCreateInput,
  EquipmentUpdateInput,
  InvoiceCreateInput,
} from '@/lib/types/patrimoine.types'

const ROOT = ['patrimoine'] as const

function usePatrimoineMutation<TVariables>(mutationFn: (variables: TVariables) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ROOT }),
  })
}

export function useUnitTypes(params?: Record<string, string>) {
  return useQuery({ queryKey: [...ROOT, 'unit-types', params], queryFn: () => api.listUnitTypes(params) })
}

export function useFloors(params?: Record<string, string>) {
  return useQuery({ queryKey: [...ROOT, 'floors', params], queryFn: () => api.listFloors(params) })
}

export function useFloor(id: string) {
  return useQuery({ queryKey: [...ROOT, 'floors', id], queryFn: () => api.getFloor(id), enabled: Boolean(id) })
}

export function useUnitFeatures(params?: Record<string, string>) {
  return useQuery({ queryKey: [...ROOT, 'unit-features', params], queryFn: () => api.listUnitFeatures(params) })
}

export function useStatusHistory(params?: Record<string, string>) {
  return useQuery({ queryKey: [...ROOT, 'status-history', params], queryFn: () => api.listStatusHistory(params) })
}

export function useRoomAssets(params?: Record<string, string>) {
  return useQuery({ queryKey: [...ROOT, 'room-assets', params], queryFn: () => api.listRoomAssets(params) })
}

export function useEquipments(params?: Record<string, string>) {
  return useQuery({ queryKey: [...ROOT, 'equipments', params], queryFn: () => api.listEquipments(params) })
}

export function useCreateEquipment() {
  return usePatrimoineMutation<EquipmentCreateInput>(api.createEquipment)
}

export function useUpdateEquipment() {
  return usePatrimoineMutation<{ id: string; data: EquipmentUpdateInput }>(({ id, data }) => api.updateEquipment(id, data))
}

export function useDeleteEquipment() {
  return usePatrimoineMutation<string>(api.deleteEquipment)
}

export function useAssignEquipment() {
  return usePatrimoineMutation<{ id: string; data: EquipmentAssignInput }>(({ id, data }) => api.assignEquipment(id, data))
}

export function useUnassignEquipment() {
  return usePatrimoineMutation<{ id: string; condition?: EquipmentCondition; notes?: string }>(({ id, condition, notes }) => api.unassignEquipment(id, condition, notes))
}

export function useInspectEquipmentExit() {
  return usePatrimoineMutation<{ id: string; condition: EquipmentCondition; notes?: string }>(({ id, condition, notes }) => api.inspectEquipmentExit(id, condition, notes))
}

export function useInvoices(params?: Record<string, string>) {
  return useQuery({ queryKey: [...ROOT, 'invoices', params], queryFn: () => api.listInvoices(params) })
}

export function useCreateInvoice() {
  return usePatrimoineMutation<InvoiceCreateInput>(api.createInvoice)
}

export function useVoidInvoice() {
  return usePatrimoineMutation<{ id: string; reason: string; replacementInvoice?: string | null }>(({ id, reason, replacementInvoice }) => api.voidInvoice(id, reason, replacementInvoice))
}

export function usePatrimoineInterventions(params?: Record<string, string>) {
  return useQuery({ queryKey: [...ROOT, 'interventions', params], queryFn: () => api.listInterventions(params) })
}

export function useInterventionStatistics() {
  return useQuery({ queryKey: [...ROOT, 'interventions', 'statistics'], queryFn: api.getInterventionStatistics })
}

export function useInterventionAction() {
  return usePatrimoineMutation<{ id: string; action: 'start' | 'complete' | 'cancel'; message?: string }>(
    ({ id, action, message }) => {
      if (action === 'start') return api.startIntervention(id)
      if (action === 'complete') return api.completeIntervention(id, message)
      return api.cancelIntervention(id, message)
    },
  )
}
