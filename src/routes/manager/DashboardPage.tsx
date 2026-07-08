import { useAuthStore } from '@/stores/auth-store'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, Wrench, MessageSquare } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description={user ? `Bienvenue, ${user.first_name}` : undefined}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Bâtiments', value: '—', icon: Building2 },
          { label: 'Locataires', value: '—', icon: Users },
          { label: 'Maintenance', value: '—', icon: Wrench },
          { label: 'Suggestions', value: '—', icon: MessageSquare },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Les données en temps réel apparaîtront ici une fois l'intégration API terminée.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
