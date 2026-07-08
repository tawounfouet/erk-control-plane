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

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            }
          >
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
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
