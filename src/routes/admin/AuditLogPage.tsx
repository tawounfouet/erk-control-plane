import { useState } from 'react'
import { Search, Download } from 'lucide-react'
import { useAuditLogs } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function AuditLogPage() {
  const [userFilter, setUserFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const { data, isLoading } = useAuditLogs({ user: userFilter, action: actionFilter })

  const logs = data?.results || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit & Logs"
        description="Historique des actions et modifications système"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Utilisateur..."
                className="pl-8"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="">Toutes les actions</option>
              <option value="CREATE">Création</option>
              <option value="UPDATE">Modification</option>
              <option value="DELETE">Suppression</option>
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
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Utilisateur</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                  <th className="px-4 py-3 text-left font-medium">App/Modèle</th>
                  <th className="px-4 py-3 text-left font-medium">Objet</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">{log.user}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        log.action === 'CREATE' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">{log.app_name}/{log.model_name}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate">{log.object_repr}</td>
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
