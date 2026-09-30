import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Ban, CheckCircle, KeyRound, Shield } from 'lucide-react'
import { useUser, useUserSessions, useTerminateSession } from '@/hooks/useAdmin'
import { RoleBadge } from '@/components/admin/RoleBadge'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: user, isLoading } = useUser(id || '')
  const { data: sessionsData } = useUserSessions(id || '')
  const terminate = useTerminateSession()

  const sessions = sessionsData?.results || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="p-8 text-center text-muted-foreground">Utilisateur non trouvé</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title={user.full_name || user.email}
          description={`${user.email} · Inscrit le ${new Date(user.date_joined).toLocaleDateString('fr-FR')}`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Profil & Rôles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Téléphone</span>
                <p className="font-medium">{user.phone || '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Rôle</span>
                <p className="mt-1">
                  <RoleBadge isSuperuser={user.is_superuser} isStaff={user.is_staff} roleDisplay={user.role_display} />
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Statut</span>
                <p className="mt-1">
                  {user.is_active ? (
                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-3 w-3" /> Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-600">
                      <Ban className="mr-1 h-3 w-3" /> Inactif
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm">
                <KeyRound className="mr-2 h-3 w-3" />
                Réinitialiser le mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sessions actives</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune session active</p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                    <div>
                      <p className="font-medium">{session.ip_address}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{session.user_agent}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => terminate.mutate(session.id)}
                      disabled={terminate.isPending}
                    >
                      <Ban className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
