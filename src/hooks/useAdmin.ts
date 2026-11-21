import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/lib/api/admin'
import * as sessionsApi from '@/lib/api/sessions'
import type {
  UserDetail,
} from '@/lib/types/admin.types'

const ADMIN_QUERY_KEY = 'admin'

// Users
export function useUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'users', params],
    queryFn: () => api.listUsers(params),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'users', id],
    queryFn: () => api.getUser(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] }),
  })
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<UserDetail>) => api.updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] })
      qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users', id] })
    },
  })
}

export function useActivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => api.activateUser(id, active),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] })
      qc.setQueryData([ADMIN_QUERY_KEY, 'users', user.id], user)
    },
  })
}

export function useResetUserPassword() {
  return useMutation({ mutationFn: api.resetUserPassword })
}

export function useUserSessions(userId: string) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'users', userId, 'sessions'],
    queryFn: () => sessionsApi.listUserSessions(userId),
    enabled: !!userId,
  })
}

export function useTerminateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: sessionsApi.revokeSession,
    onSuccess: () => qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'users'] }),
  })
}

// Student Profiles
export function useStudentProfiles(params?: Record<string, string>) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'student-profiles', params],
    queryFn: () => api.listStudentProfiles(params),
  })
}

export function useStudentProfile(id: string) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'student-profiles', id],
    queryFn: () => api.getStudentProfile(id),
    enabled: !!id,
  })
}

// Audit Logs
export function useAuditLogs(params?: Record<string, string>) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'audit-logs', params],
    queryFn: () => api.listAuditLogs(params),
  })
}

export function useAuditLog(id: string) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'audit-logs', id],
    queryFn: () => api.getAuditLog(id),
    enabled: !!id,
  })
}

// Notifications
export function useNotifications(params?: Record<string, string>) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'notifications', params],
    queryFn: () => api.listNotifications(params),
  })
}

// System Config
export function useConfigurations() {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'configurations'],
    queryFn: () => api.listConfigurations(),
  })
}

export function useUpdateConfiguration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => api.updateConfiguration(id, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'configurations'] }),
  })
}

// Media Files
export function useMediaFiles(params?: Record<string, string>) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'media-files', params],
    queryFn: () => api.listMediaFiles(params),
  })
}

export function useDeleteMediaFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteMediaFile,
    onSuccess: () => qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'media-files'] }),
  })
}

// Import / Export
export function useImportJobs() {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'imports'],
    queryFn: () => api.listImportJobs(),
  })
}

export function useCreateImportJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ file, importType }: { file: File; importType: string }) =>
      api.createImportJob(file, importType),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'imports'] }),
  })
}

export function useExportJobs() {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'exports'],
    queryFn: () => api.listExportJobs(),
  })
}

export function useCreateExportJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ exportType, filters }: { exportType: string; filters: Record<string, unknown> }) =>
      api.createExportJob(exportType, filters),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'exports'] }),
  })
}

// Groups
export function useGroups() {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'groups'],
    queryFn: () => api.listGroups(),
  })
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'groups', id],
    queryFn: () => api.getGroup(id),
    enabled: !!id,
  })
}

export function useUpdateGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      api.updateGroup(id, permissions),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'groups'] }),
  })
}

// Condition Reports
export function useConditionReports(params?: Record<string, string>) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'condition-reports', params],
    queryFn: () => api.listConditionReports(params),
  })
}

export function useConditionReport(id: string) {
  return useQuery({
    queryKey: [ADMIN_QUERY_KEY, 'condition-reports', id],
    queryFn: () => api.getConditionReport(id),
    enabled: !!id,
  })
}

export function useValidateConditionReport(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.validateConditionReport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'condition-reports'] })
      qc.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY, 'condition-reports', id] })
    },
  })
}
