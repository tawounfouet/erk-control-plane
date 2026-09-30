import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserPlus, Ban, CheckCircle, RefreshCw } from 'lucide-react'
import { useUsers, useActivateUser } from '@/hooks/useAdmin'
import { RoleBadge } from '@/components/admin/RoleBadge'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function UsersListPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const { data, isLoading } = useUsers({ search, role: roleFilter })
  const activate = useActivateUser()

  const users = data?.results || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Gestion des utilisateurs, rôles et sessions"
        actions={
          <Link to="/admin/users/new">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </Link>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">Tous les rôles</option>
              <option value="superuser">Superuser</option>
              <option value="staff">Staff</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Nom</th>
                  <th className="px-4 py-3 text-left font-medium">Rôle</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-left font-medium">Dernière connexion</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link to={`/admin/users/${user.id}`} className="font-medium text-primary hover:underline">
                        {user.email}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{user.full_name}</td>
                    <td className="px-4 py-3">
                      <RoleBadge isSuperuser={user.is_superuser} isStaff={user.is_staff} roleDisplay={user.role_display} />
                    </td>
                    <td className="px-4 py-3">
                      {user.is_active ? (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="mr-1 h-3 w-3" /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600">
                          <Ban className="mr-1 h-3 w-3" /> Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Jamais'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => activate.mutate({ id: user.id, active: !user.is_active })}
                        disabled={activate.isPending}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
