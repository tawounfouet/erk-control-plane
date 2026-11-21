import { http, HttpResponse } from 'msw'
import type { UserDetail } from '@/lib/types/admin.types'
import {
  MOCK_USERS,
  MOCK_USER_DETAILS,
  MOCK_USER_SESSIONS,
  MOCK_STUDENT_PROFILES,
  MOCK_AUDIT_LOGS,
  MOCK_CONFIGURATIONS,
  MOCK_NOTIFICATIONS,
  MOCK_MEDIA_FILES,
  MOCK_IMPORT_JOBS,
  MOCK_EXPORT_JOBS,
  MOCK_GROUPS,
  MOCK_CONDITION_REPORTS,
  paginate,
} from '@/mocks/fixtures/admin'

export const adminHandlers = [
  // Users
  http.get('/api/auth/users/', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const search = url.searchParams.get('search') || ''
    const role = url.searchParams.get('role') || ''

    let results = [...MOCK_USERS]
    if (search) {
      const q = search.toLowerCase()
      results = results.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          u.first_name.toLowerCase().includes(q) ||
          u.last_name.toLowerCase().includes(q)
      )
    }
    if (role === 'superuser') results = results.filter((u) => u.is_superuser)
    if (role === 'staff') results = results.filter((u) => u.is_staff && !u.is_superuser)
    if (role === 'tenant') results = results.filter((u) => u.is_tenant)

    return HttpResponse.json(paginate(results, page))
  }),

  http.get('/api/auth/users/:id/', ({ params }) => {
    const user = MOCK_USERS.find((u) => u.id === params.id)
    if (!user) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    return HttpResponse.json({ ...user, ...MOCK_USER_DETAILS[user.id] })
  }),

  http.post('/api/auth/users/', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newUser: UserDetail = {
      id: `u-${String(MOCK_USERS.length + 1).padStart(3, '0')}`,
      email: (body.email as string) || '',
      first_name: (body.first_name as string) || '',
      last_name: (body.last_name as string) || '',
      phone: (body.phone as string) || '',
      is_active: true,
      is_staff: Boolean(body.is_staff),
      is_tenant: false,
      full_name: `${body.first_name || ''} ${body.last_name || ''}`.trim(),
      role_display: (body.is_staff ? 'Staff' : 'Locataire') as string,
      is_superuser: Boolean(body.is_superuser),
      date_joined: new Date().toISOString(),
      last_login: null,
      groups: [],
      user_permissions: [],
    }
    MOCK_USERS.push(newUser)
    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.patch('/api/auth/users/:id/', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const user = MOCK_USERS.find((u) => u.id === params.id)
    if (!user) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    Object.assign(user, body)
    return HttpResponse.json(user)
  }),

  http.post('/api/auth/users/:id/activate-account/', ({ params }) => {
    const user = MOCK_USERS.find((u) => u.id === params.id)
    if (!user) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    user.is_active = true
    return HttpResponse.json(user)
  }),

  http.post('/api/auth/users/:id/suspend-account/', ({ params }) => {
    const user = MOCK_USERS.find((u) => u.id === params.id)
    if (!user) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    user.is_active = false
    return HttpResponse.json(user)
  }),

  http.post('/api/auth/users/reset_password/', () =>
    new HttpResponse(null, { status: 204 })),

  // User Sessions
  http.get('/api/auth/sessions/', ({ request }) => {
    const userId = new URL(request.url).searchParams.get('user')
    const sessions = MOCK_USER_SESSIONS.filter((s) => !userId || s.user === userId)
    return HttpResponse.json(paginate(sessions))
  }),

  http.post('/api/auth/sessions/:sessionId/revoke/', ({ params }) => {
    const idx = MOCK_USER_SESSIONS.findIndex((s) => s.id === params.sessionId)
    if (idx !== -1) MOCK_USER_SESSIONS.splice(idx, 1)
    return HttpResponse.json({ detail: 'Session terminated' })
  }),

  // Student Profiles
  http.get('/api/auth/student-profiles/', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const school = url.searchParams.get('school') || ''

    let results = [...MOCK_STUDENT_PROFILES]
    if (school) results = results.filter((p) => p.school.toLowerCase().includes(school.toLowerCase()))

    return HttpResponse.json(paginate(results, page))
  }),

  http.get('/api/auth/student-profiles/:id/', ({ params }) => {
    const profile = MOCK_STUDENT_PROFILES.find((p) => p.id === params.id)
    if (!profile) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    return HttpResponse.json(profile)
  }),

  // Audit Logs
  http.get('/api/core/audit-logs/', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const user = url.searchParams.get('user') || ''
    const action = url.searchParams.get('action') || ''

    let results = [...MOCK_AUDIT_LOGS]
    if (user) results = results.filter((l) => l.user.toLowerCase().includes(user.toLowerCase()))
    if (action) results = results.filter((l) => l.action === action)

    return HttpResponse.json(paginate(results, page))
  }),

  http.get('/api/core/audit-logs/:id/', ({ params }) => {
    const log = MOCK_AUDIT_LOGS.find((l) => l.id === params.id)
    if (!log) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    return HttpResponse.json(log)
  }),

  // Notifications
  http.get('/api/manager/notifications/', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    return HttpResponse.json(paginate([...MOCK_NOTIFICATIONS], page))
  }),

  // System Configuration
  http.get('/api/core/configurations/', () =>
    HttpResponse.json(paginate([...MOCK_CONFIGURATIONS]))),

  http.patch('/api/core/configurations/:id/', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const cfg = MOCK_CONFIGURATIONS.find((c) => c.id === params.id)
    if (!cfg) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    Object.assign(cfg, body, { updated_at: new Date().toISOString() })
    return HttpResponse.json(cfg)
  }),

  // Media Files
  http.get('/api/core/media-files/', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const app = url.searchParams.get('app_name') || ''

    let results = [...MOCK_MEDIA_FILES]
    if (app) results = results.filter((m) => m.app_name === app)

    return HttpResponse.json(paginate(results, page))
  }),

  http.delete('/api/core/media-files/:id/', ({ params }) => {
    const idx = MOCK_MEDIA_FILES.findIndex((m) => m.id === params.id)
    if (idx !== -1) MOCK_MEDIA_FILES.splice(idx, 1)
    return HttpResponse.json({ detail: 'Deleted' })
  }),

  // Import Jobs
  http.get('/api/core/imports/', () =>
    HttpResponse.json(paginate([...MOCK_IMPORT_JOBS]))),

  http.post('/api/core/imports/', async () => {
    const newJob = {
      id: `imp-${String(MOCK_IMPORT_JOBS.length + 1).padStart(3, '0')}`,
      import_type: 'unknown',
      status: 'pending' as const,
      total_rows: 0,
      processed_rows: 0,
      error_rows: 0,
      file_name: 'uploaded.csv',
      created_at: new Date().toISOString(),
      completed_at: null,
      errors: [],
    }
    MOCK_IMPORT_JOBS.push(newJob)
    return HttpResponse.json(newJob, { status: 201 })
  }),

  // Export Jobs
  http.get('/api/core/exports/', () =>
    HttpResponse.json(paginate([...MOCK_EXPORT_JOBS]))),

  http.post('/api/core/exports/', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newJob = {
      id: `exp-${String(MOCK_EXPORT_JOBS.length + 1).padStart(3, '0')}`,
      export_type: (body.export_type as string) || 'unknown',
      status: 'pending' as const,
      file_url: null,
      filters: (body.filters as Record<string, unknown>) || {},
      created_at: new Date().toISOString(),
      completed_at: null,
    }
    MOCK_EXPORT_JOBS.push(newJob)
    return HttpResponse.json(newJob, { status: 201 })
  }),

  // Groups
  http.get('/api/auth/groups/', () =>
    HttpResponse.json(paginate([...MOCK_GROUPS]))),

  http.get('/api/auth/groups/:id/', ({ params }) => {
    const group = MOCK_GROUPS.find((g) => g.id === params.id)
    if (!group) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    return HttpResponse.json(group)
  }),

  http.patch('/api/auth/groups/:id/', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const group = MOCK_GROUPS.find((g) => g.id === params.id)
    if (!group) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    if (body.permissions) {
      const permIds = body.permissions as string[]
      const allPerms = Array.from(
        new Set(MOCK_GROUPS.flatMap((g) => g.permissions.map((p) => JSON.stringify(p))))
      ).map((p) => JSON.parse(p) as { id: string; name: string; codename: string; app_label: string; model: string })
      group.permissions = allPerms.filter((p) => permIds.includes(p.id))
    }
    return HttpResponse.json(group)
  }),

  // Condition Reports
  http.get('/api/patrimoine/condition-reports/', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const unit = url.searchParams.get('unit') || ''
    const type = url.searchParams.get('type') || ''

    let results = [...MOCK_CONDITION_REPORTS]
    if (unit) results = results.filter((r) => r.unit_number.toLowerCase().includes(unit.toLowerCase()))
    if (type) results = results.filter((r) => r.report_type === type)

    return HttpResponse.json(paginate(results, page))
  }),

  http.get('/api/patrimoine/condition-reports/:id/', ({ params }) => {
    const report = MOCK_CONDITION_REPORTS.find((r) => r.id === params.id)
    if (!report) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    return HttpResponse.json(report)
  }),

  http.post('/api/patrimoine/condition-reports/:id/validate/', ({ params }) => {
    const report = MOCK_CONDITION_REPORTS.find((r) => r.id === params.id)
    if (!report) return HttpResponse.json({ detail: 'Not found' }, { status: 404 })
    report.status = 'validated'
    report.validated_at = new Date().toISOString()
    return HttpResponse.json(report)
  }),
]
