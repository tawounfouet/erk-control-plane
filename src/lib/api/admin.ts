import { fetchJSON } from './client'
import type {
  UserDetail,
  StudentProfile,
  AuditLogEntry,
  SystemConfiguration,
  Notification,
  MediaFile,
  ImportJob,
  ExportJob,
  Group,
  ConditionReport,
} from '@/lib/types/admin.types'
import type { PaginatedResponse } from '@/lib/types/common.types'

// User Management
export async function listUsers(params?: Record<string, string>): Promise<PaginatedResponse<UserDetail>> {
  const searchParams = new URLSearchParams(params)
  return fetchJSON(`/api/auth/users/?${searchParams}`)
}

export async function getUser(id: string): Promise<UserDetail> {
  return fetchJSON(`/api/auth/users/${id}/`)
}

export async function createUser(data: Partial<UserDetail>): Promise<UserDetail> {
  return fetchJSON('/api/auth/users/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateUser(id: string, data: Partial<UserDetail>): Promise<UserDetail> {
  return fetchJSON(`/api/auth/users/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function activateUser(id: string, active: boolean): Promise<UserDetail> {
  const action = active ? 'activate-account' : 'suspend-account'
  return fetchJSON(`/api/auth/users/${id}/${action}/`, {
    method: 'POST',
  })
}

export async function resetUserPassword(email: string): Promise<void> {
  await fetchJSON('/api/auth/users/reset_password/', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// Student Profiles
export async function listStudentProfiles(params?: Record<string, string>): Promise<PaginatedResponse<StudentProfile>> {
  const searchParams = new URLSearchParams(params)
  return fetchJSON(`/api/auth/student-profiles/?${searchParams}`)
}

export async function getStudentProfile(id: string): Promise<StudentProfile> {
  return fetchJSON(`/api/auth/student-profiles/${id}/`)
}

// Audit Logs
export async function listAuditLogs(params?: Record<string, string>): Promise<PaginatedResponse<AuditLogEntry>> {
  const searchParams = new URLSearchParams(params)
  return fetchJSON(`/api/core/audit-logs/?${searchParams}`)
}

export async function getAuditLog(id: string): Promise<AuditLogEntry> {
  return fetchJSON(`/api/core/audit-logs/${id}/`)
}

// Notifications
export async function listNotifications(params?: Record<string, string>): Promise<PaginatedResponse<Notification>> {
  const searchParams = new URLSearchParams(params)
  return fetchJSON(`/api/manager/notifications/?${searchParams}`)
}

// System Configuration
export async function listConfigurations(): Promise<PaginatedResponse<SystemConfiguration>> {
  return fetchJSON('/api/core/configurations/')
}

export async function updateConfiguration(id: string, value: string): Promise<SystemConfiguration> {
  return fetchJSON(`/api/core/configurations/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  })
}

// Media Files
export async function listMediaFiles(params?: Record<string, string>): Promise<PaginatedResponse<MediaFile>> {
  const searchParams = new URLSearchParams(params)
  return fetchJSON(`/api/core/media-files/?${searchParams}`)
}

export async function deleteMediaFile(id: string): Promise<void> {
  await fetchJSON(`/api/core/media-files/${id}/`, { method: 'DELETE' })
}

// Import / Export
export async function listImportJobs(): Promise<PaginatedResponse<ImportJob>> {
  return fetchJSON('/api/core/imports/')
}

export async function createImportJob(file: File, importType: string): Promise<ImportJob> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('import_type', importType)
  return fetchJSON('/api/core/imports/', {
    method: 'POST',
    body: formData,
  })
}

export async function listExportJobs(): Promise<PaginatedResponse<ExportJob>> {
  return fetchJSON('/api/core/exports/')
}

export async function createExportJob(exportType: string, filters: Record<string, unknown>): Promise<ExportJob> {
  return fetchJSON('/api/core/exports/', {
    method: 'POST',
    body: JSON.stringify({ export_type: exportType, filters }),
  })
}

// Groups / RBAC
export async function listGroups(): Promise<PaginatedResponse<Group>> {
  return fetchJSON('/api/auth/groups/')
}

export async function getGroup(id: string): Promise<Group> {
  return fetchJSON(`/api/auth/groups/${id}/`)
}

export async function updateGroup(id: string, permissions: string[]): Promise<Group> {
  return fetchJSON(`/api/auth/groups/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ permissions }),
  })
}

// Condition Reports
export async function listConditionReports(params?: Record<string, string>): Promise<PaginatedResponse<ConditionReport>> {
  const searchParams = new URLSearchParams(params)
  return fetchJSON(`/api/patrimoine/condition-reports/?${searchParams}`)
}

export async function getConditionReport(id: string): Promise<ConditionReport> {
  return fetchJSON(`/api/patrimoine/condition-reports/${id}/`)
}

export async function validateConditionReport(id: string): Promise<ConditionReport> {
  return fetchJSON(`/api/patrimoine/condition-reports/${id}/validate/`, { method: 'POST' })
}
