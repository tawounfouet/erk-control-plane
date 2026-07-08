import { useDashboardStats, useRevenue } from '@/hooks/useManager'
import { useAuthStore } from '@/stores/auth-store'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Building2, Users, Wrench, MessageSquare, DoorOpen, Home,
  Activity, DollarSign, TrendingUp,
} from 'lucide-react'

function StatCard({ label, value, icon: Icon, loading }: { label: string; value: string; icon: React.ElementType; loading?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const { data: stats, isLoading } = useDashboardStats()
  const { data: revenue } = useRevenue()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description={user ? `Bienvenue, ${user.first_name}` : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Bâtiments"
          value="—"
          icon={Building2}
        />
        <StatCard
          label="Logements"
          value={stats?.total_units?.toString() ?? '—'}
          icon={Home}
          loading={isLoading}
        />
        <StatCard
          label="Taux d'occupation"
          value={stats ? `${stats.occupancy_rate}%` : '—'}
          icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          label="Locataires actifs"
          value={stats?.active_tenants?.toString() ?? '—'}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          label="Occupés"
          value={stats?.occupied_units?.toString() ?? '—'}
          icon={DoorOpen}
          loading={isLoading}
        />
        <StatCard
          label="Disponibles"
          value={stats?.available_units?.toString() ?? '—'}
          icon={Activity}
          loading={isLoading}
        />
        <StatCard
          label="Maintenance ouverte"
          value={stats?.maintenance_open?.toString() ?? '—'}
          icon={Wrench}
          loading={isLoading}
        />
        <StatCard
          label="Suggestions non lues"
          value={stats?.unread_suggestions?.toString() ?? '—'}
          icon={MessageSquare}
          loading={isLoading}
        />
      </div>

      {revenue && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Revenus {revenue.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground">MRR</p>
                <p className="text-xl font-bold flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  {revenue.current_mrr.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cumul annuel</p>
                <p className="text-xl font-bold flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  {revenue.total_revenue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-end gap-1 h-16">
                  {revenue.monthly_revenue.map((m) => {
                    const maxRevenue = Math.max(...revenue.monthly_revenue.filter(r => r.revenue !== null).map(r => r.revenue!), 1)
                    const height = m.revenue !== null ? Math.round((m.revenue / maxRevenue) * 100) : 0
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
                        <div
                          className={`w-full rounded-t ${m.revenue !== null ? 'bg-primary' : 'bg-muted'}`}
                          style={{ height: `${Math.max(height, 4)}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(2024, m.month - 1).toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : stats ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Logements en maintenance</p>
                <p className="mt-1 text-lg font-semibold">{stats.maintenance_units}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Maintenance en cours</p>
                <p className="mt-1 text-lg font-semibold">{stats.maintenance_in_progress}</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Logements disponibles</p>
                <p className="mt-1 text-lg font-semibold">{stats.available_units}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Connectez-vous pour voir les données.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
