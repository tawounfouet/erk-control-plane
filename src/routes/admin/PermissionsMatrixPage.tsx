import { useGroups } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckSquare, Square } from 'lucide-react'

export function PermissionsMatrixPage() {
  const { data, isLoading } = useGroups()
  const groups = data?.results || []

  const allPermissions: { id: string; name: string; codename: string; app_label: string; model: string }[] = Array.from(
    new Set(groups.flatMap((g) => g.permissions.map((p) => JSON.stringify(p))))
  ).map((p) => JSON.parse(p as string) as { id: string; name: string; codename: string; app_label: string; model: string })

  const apps = Array.from(new Set(allPermissions.map((p) => p.app_label)))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matrice de permissions"
        description="Vue croisée des permissions par groupe et modèle"
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-60" />
          ))}
        </div>
      ) : (
        apps.map((app) => (
          <Card key={app}>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3 capitalize">{app}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Permission</th>
                      {groups.map((g) => (
                        <th key={g.id} className="px-3 py-2 text-center font-medium">{g.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allPermissions
                      .filter((p) => p.app_label === app)
                      .map((perm) => (
                        <tr key={perm.id} className="hover:bg-muted/50">
                          <td className="px-3 py-2">{perm.name}</td>
                          {groups.map((g) => (
                            <td key={g.id} className="px-3 py-2 text-center">
                              {g.permissions.some((p) => p.id === perm.id) ? (
                                <CheckSquare className="h-4 w-4 text-green-500 mx-auto" />
                              ) : (
                                <Square className="h-4 w-4 text-muted-foreground mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
