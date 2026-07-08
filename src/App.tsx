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
            <Route path="/tenants" element={<div className="text-muted-foreground">Locataires — à venir</div>} />
            <Route path="/operations" element={<div className="text-muted-foreground">Maintenance — à venir</div>} />
            <Route path="/contacts" element={<div className="text-muted-foreground">Contacts — à venir</div>} />
            <Route path="/suggestions" element={<div className="text-muted-foreground">Suggestions — à venir</div>} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
