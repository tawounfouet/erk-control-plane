import { TrendingUp, AlertTriangle, Clock, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AdvancedDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Administrateur"
        description="Vue consolidée des métriques et indicateurs clés"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82.2%</div>
            <p className="text-xs text-muted-foreground">37/45 chambres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus mensuels</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M FCFA</div>
            <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opérations en cours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 en attente de validation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Documents expirants, stocks faibles</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Occupation par bâtiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Aile H', rate: 100, total: 9 },
                { name: 'Aile N', rate: 80, total: 10 },
                { name: 'Aile C', rate: 75, total: 8 },
                { name: 'Aile O', rate: 90, total: 10 },
                { name: 'Aile P', rate: 70, total: 8 },
              ].map((b) => (
                <div key={b.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{b.name}</span>
                    <span className="text-muted-foreground">{b.rate}% ({Math.round(b.rate * b.total / 100)}/{b.total})</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${b.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Opérations par statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Créées', value: 5, color: 'bg-gray-500' },
                { label: 'En attente', value: 3, color: 'bg-yellow-500' },
                { label: 'Approuvées', value: 4, color: 'bg-blue-500' },
                { label: 'En cours', value: 8, color: 'bg-indigo-500' },
                { label: 'Terminées', value: 12, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-sm flex-1">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
