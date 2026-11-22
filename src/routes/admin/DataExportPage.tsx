import { useState } from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { useExportJobs, useCreateExportJob } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const EXPORT_TYPES = [
  { value: 'units', label: 'Unités' },
  { value: 'tenants', label: 'Locataires' },
  { value: 'operations', label: 'Opérations' },
  { value: 'inventory', label: 'Inventaire' },
]

export function DataExportPage() {
  const [exportType, setExportType] = useState('')
  const { data: jobs, isLoading } = useExportJobs()
  const createExport = useCreateExportJob()

  const handleExport = () => {
    if (exportType) {
      createExport.mutate({ exportType, filters: {} })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Export de données" description="Exporter les données en CSV ou Excel" />

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm flex-1"
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
            >
              <option value="">Type d'export...</option>
              {EXPORT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <Button onClick={handleExport} disabled={!exportType || createExport.isPending}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b bg-muted/50">
            <h3 className="font-medium text-sm">Historique des exports</h3>
          </div>
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-right font-medium">Fichier</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(jobs?.results || []).map((job) => (
                  <tr key={job.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">{new Date(job.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">{job.export_type}</td>
                    <td className="px-4 py-3">{job.status}</td>
                    <td className="px-4 py-3 text-right">
                      {job.file_url ? (
                        <a href={job.file_url} className="text-primary hover:underline">
                          <FileSpreadsheet className="h-4 w-4 inline" />
                        </a>
                      ) : (
                        '-'
                      )}
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
