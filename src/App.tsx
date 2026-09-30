import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoginPage } from '@/routes/auth/LoginPage'
import { LogoutPage } from '@/routes/auth/LogoutPage'
import { ResetPasswordPage } from '@/routes/auth/ResetPasswordPage'
import { DashboardPage } from '@/routes/manager/DashboardPage'
import { BuildingsPage } from '@/routes/patrimoine/BuildingsPage'
import { BuildingDetailPage } from '@/routes/patrimoine/BuildingDetailPage'
import { UnitsPage } from '@/routes/patrimoine/UnitsPage'
import { UnitDetailPage } from '@/routes/patrimoine/UnitDetailPage'
import { InventoryPage } from '@/routes/patrimoine/InventoryPage'
import { InventoryAssignmentsPage } from '@/routes/patrimoine/InventoryAssignmentsPage'
import { TenantsPage } from '@/routes/rental/TenantsPage'
import { TenantDetailPage } from '@/routes/rental/TenantDetailPage'
import { DocumentsPage } from '@/routes/rental/DocumentsPage'
import { OperationsPage } from '@/routes/operations/OperationsPage'
import { OperationDetailPage } from '@/routes/operations/OperationDetailPage'
import { OperationKanbanPage } from '@/routes/operations/OperationKanbanPage'
import { ContactsPage } from '@/routes/contacts/ContactsPage'
import { SuggestionsPage } from '@/routes/suggestions/SuggestionsPage'
import { SuggestionDetailPage } from '@/routes/suggestions/SuggestionDetailPage'
import { SearchPage } from '@/routes/manager/SearchPage'
import { UsersListPage } from '@/routes/admin/UsersListPage'
import { UserDetailPage } from '@/routes/admin/UserDetailPage'
import { UserCreatePage } from '@/routes/admin/UserCreatePage'
import { StudentProfilesPage } from '@/routes/admin/StudentProfilesPage'
import { AuditLogPage } from '@/routes/admin/AuditLogPage'
import { NotificationsPage } from '@/routes/admin/NotificationsPage'
import { SettingsPage } from '@/routes/admin/SettingsPage'
import { SystemHealthPage } from '@/routes/admin/SystemHealthPage'
import { MediaFilesPage } from '@/routes/admin/MediaFilesPage'
import { DataImportPage } from '@/routes/admin/DataImportPage'
import { DataExportPage } from '@/routes/admin/DataExportPage'
import { BatchActionsPage } from '@/routes/admin/BatchActionsPage'
import { GroupManagementPage } from '@/routes/admin/GroupManagementPage'
import { PermissionsMatrixPage } from '@/routes/admin/PermissionsMatrixPage'
import { AdvancedDashboardPage } from '@/routes/admin/AdvancedDashboardPage'
import { ConditionReportPage } from '@/routes/admin/ConditionReportPage'
import { ConditionReportDetailPage } from '@/routes/admin/ConditionReportDetailPage'

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/buildings" element={<BuildingsPage />} />
            <Route path="/buildings/:id" element={<BuildingDetailPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/units/:id" element={<UnitDetailPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/assignments" element={<InventoryAssignmentsPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/tenants/:id" element={<TenantDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/operations" element={<OperationsPage />} />
            <Route path="/operations/:id" element={<OperationDetailPage />} />
            <Route path="/operations/kanban" element={<OperationKanbanPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/suggestions" element={<SuggestionsPage />} />
            <Route path="/suggestions/:id" element={<SuggestionDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            {/* Admin routes */}
            <Route path="/admin/users" element={<UsersListPage />} />
            <Route path="/admin/users/new" element={<UserCreatePage />} />
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
            <Route path="/admin/students" element={<StudentProfilesPage />} />
            <Route path="/admin/audit" element={<AuditLogPage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route path="/admin/health" element={<SystemHealthPage />} />
            <Route path="/admin/media" element={<MediaFilesPage />} />
            <Route path="/admin/import" element={<DataImportPage />} />
            <Route path="/admin/export" element={<DataExportPage />} />
            <Route path="/admin/batch" element={<BatchActionsPage />} />
            <Route path="/admin/groups" element={<GroupManagementPage />} />
            <Route path="/admin/permissions" element={<PermissionsMatrixPage />} />
            <Route path="/admin/dashboard" element={<AdvancedDashboardPage />} />
            <Route path="/admin/condition-reports" element={<ConditionReportPage />} />
            <Route path="/admin/condition-reports/:id" element={<ConditionReportDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
