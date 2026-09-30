import { useState } from 'react'
import { Shield, Users, CheckSquare, Square } from 'lucide-react'
import { useGroups, useUpdateGroup } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function GroupManagementPage() {
  const { data, isLoading } = useGroups()
  const updateGroup = useUpdateGroup()
  const [editingGroup, setEditingGroup] = useState<string | null>(null)
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])

  const groups = data?.results || []

  const allPermissions = Array.from(
    new Set(groups.flatMap((g) => g.permissions.map((p) => JSON.stringify(p))))
  ).map((p) => JSON.parse(p) as { id: string; name: string; codename: string; app_label: string; model: string })

  const startEdit = (group: (typeof groups)[0]) => {
    setEditingGroup(group.id)
    setSelectedPerms(group.permissions.map((p) => p.id))
  }

  const save = (groupId: string) => {
    updateGroup.mutate({ id: groupId, permissions: selectedPerms })
    setEditingGroup(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Groupes & Permissions"
        description="Gestion des groupes Django et matrice de permissions"
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {group.user_count} membres · {group.permissions.length} permissions
                      </p>
                    </div>
                  </div>
                  {editingGroup === group.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditingGroup(null)}>
                        Annuler
                      </Button>
                      <Button size="sm" onClick={() => save(group.id)} disabled={updateGroup.isPending}>
                        Sauver
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => startEdit(group)}>
                      Modifier
                    </Button>
                  )}
                </div>

                {editingGroup === group.id && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {allPermissions.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 rounded-md border p-2 text-sm cursor-pointer hover:bg-muted/50"
                      >
                        {selectedPerms.includes(perm.id) ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={selectedPerms.includes(perm.id)}
                          onChange={(e) => {
                            setSelectedPerms((prev) =>
                              e.target.checked
                                ? [...prev, perm.id]
                                : prev.filter((id) => id !== perm.id)
                            )
                          }}
                        />
                        <span className="truncate">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
