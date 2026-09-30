import { useNotifications } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Bell } from 'lucide-react'

export function NotificationsPage() {
  const { data, isLoading } = useNotifications()
  const notifications = data?.results || []

  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Notifications système envoyées aux utilisateurs" />
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-muted/50">
                  <Bell className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Priorité: {n.priority}</span>
                      <span>·</span>
                      <span>{new Date(n.sent_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
