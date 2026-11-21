import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthBootstrap } from '@/components/auth/AuthBootstrap'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoginPage } from '@/routes/auth/LoginPage'
import { LogoutPage } from '@/routes/auth/LogoutPage'
import { ResetPasswordPage } from '@/routes/auth/ResetPasswordPage'
import { ActivateAccountPage } from '@/routes/auth/ActivateAccountPage'
import { ConfirmResetPasswordPage } from '@/routes/auth/ConfirmResetPasswordPage'
import { ResendActivationPage } from '@/routes/auth/ResendActivationPage'
import { DashboardPage } from '@/routes/manager/DashboardPage'
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

const EquipmentPage = lazy(() => import('@/routes/patrimoine/EquipmentPage').then((module) => ({ default: module.EquipmentPage })))
const BuildingsPage = lazy(() => import('@/routes/patrimoine/BuildingsPage').then((module) => ({ default: module.BuildingsPage })))
const BuildingDetailPage = lazy(() => import('@/routes/patrimoine/BuildingDetailPage').then((module) => ({ default: module.BuildingDetailPage })))
const FloorDetailPage = lazy(() => import('@/routes/patrimoine/FloorDetailPage').then((module) => ({ default: module.FloorDetailPage })))
const InventoryAssignmentsPage = lazy(() => import('@/routes/patrimoine/InventoryAssignmentsPage').then((module) => ({ default: module.InventoryAssignmentsPage })))
const InventoryPage = lazy(() => import('@/routes/patrimoine/InventoryPage').then((module) => ({ default: module.InventoryPage })))
const InvoicesPage = lazy(() => import('@/routes/patrimoine/InvoicesPage').then((module) => ({ default: module.InvoicesPage })))
const PatrimoineInterventionsPage = lazy(() => import('@/routes/patrimoine/PatrimoineInterventionsPage').then((module) => ({ default: module.PatrimoineInterventionsPage })))
const PatrimoineRegistryPage = lazy(() => import('@/routes/patrimoine/PatrimoineRegistryPage').then((module) => ({ default: module.PatrimoineRegistryPage })))
const UnitDetailPage = lazy(() => import('@/routes/patrimoine/UnitDetailPage').then((module) => ({ default: module.UnitDetailPage })))
const UnitsPage = lazy(() => import('@/routes/patrimoine/UnitsPage').then((module) => ({ default: module.UnitsPage })))
const RentalControlPage = lazy(() => import('@/routes/rental/RentalControlPage').then((module) => ({ default: module.RentalControlPage })))

export default function App() {
  return (
    <ErrorBoundary>
      <AuthBootstrap />
      <Suspense fallback={<main className="grid min-h-[40vh] place-items-center" aria-busy="true"><p role="status" className="text-sm text-muted-foreground">Chargement du module…</p></main>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/activate/:uid/:token" element={<ActivateAccountPage />} />
        <Route path="/resend-activation" element={<ResendActivationPage />} />
        <Route path="/password/reset/confirm/:uid/:token" element={<ConfirmResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/buildings" element={<BuildingsPage />} />
            <Route path="/buildings/:id" element={<BuildingDetailPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/units/:id" element={<UnitDetailPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/assignments" element={<InventoryAssignmentsPage />} />
            <Route path="/floors/:id" element={<FloorDetailPage />} />
            <Route path="/patrimoine/registry" element={<PatrimoineRegistryPage />} />
            <Route path="/patrimoine/equipments" element={<EquipmentPage />} />
            <Route path="/patrimoine/interventions" element={<PatrimoineInterventionsPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/tenants/:id" element={<TenantDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/rental/control" element={<RentalControlPage />} />
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
            <Route path="/admin/invoices" element={<InvoicesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
