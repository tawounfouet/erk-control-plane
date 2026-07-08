import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoginPage } from '@/routes/auth/LoginPage'
import { LogoutPage } from '@/routes/auth/LogoutPage'
import { ResetPasswordPage } from '@/routes/auth/ResetPasswordPage'
import { DashboardPage } from '@/routes/manager/DashboardPage'

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
            <Route path="/buildings" element={<div className="text-muted-foreground">Bâtiments — à venir</div>} />
            <Route path="/units" element={<div className="text-muted-foreground">Unités — à venir</div>} />
            <Route path="/inventory" element={<div className="text-muted-foreground">Inventaire — à venir</div>} />
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
