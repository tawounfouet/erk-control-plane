import { Activity, Database, HardDrive, Server } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SystemHealthPage() {
  const services = [
    { name: 'Base de données', status: 'healthy', icon: Database, latency: '12ms' },
    { name: 'Redis', status: 'healthy', icon: Server, latency: '4ms' },
    { name: 'Celery', status: 'healthy', icon: Activity, latency: '-' },
    { name: 'Stockage', status: 'healthy', icon: HardDrive, latency: '-' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Santé du système" description="État des services et métriques" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <Card key={s.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.name}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium capitalize">{s.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Latence: {s.latency}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
