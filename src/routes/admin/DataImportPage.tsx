import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import { useImportJobs, useCreateImportJob } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const IMPORT_TYPES = [
  { value: 'buildings', label: 'Bâtiments' },
  { value: 'units', label: 'Unités' },
  { value: 'inventory', label: 'Inventaire' },
  { value: 'tenants', label: 'Locataires' },
]

export function DataImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importType, setImportType] = useState('')
  const { data: jobs, isLoading } = useImportJobs()
  const createImport = useCreateImportJob()

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }, [])

  const handleUpload = () => {
    if (file && importType) {
      createImport.mutate({ file, importType })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import de données"
        description="Importer des données par CSV ou Excel"
      />

      <Card>
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 hover:border-muted-foreground/50 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium">Glissez un fichier CSV ici</p>
            <p className="text-xs text-muted-foreground mt-1">ou</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="mt-2"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
          </div>

          <div className="mt-4 flex gap-4">
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm flex-1"
              value={importType}
              onChange={(e) => setImportType(e.target.value)}
            >
              <option value="">Type d'import...</option>
              {IMPORT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <Button onClick={handleUpload} disabled={!file || !importType || createImport.isPending}>
              <Upload className="mr-2 h-4 w-4" />
              Importer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b bg-muted/50">
            <h3 className="font-medium text-sm">Historique des imports</h3>
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
                  <th className="px-4 py-3 text-left font-medium">Fichier</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-right font-medium">Lignes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(jobs?.results || []).map((job) => (
                  <tr key={job.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">{new Date(job.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">{job.import_type}</td>
                    <td className="px-4 py-3">{job.file_name}</td>
                    <td className="px-4 py-3">
                      {job.status === 'completed' ? (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="mr-1 h-3 w-3" /> Terminé
                        </span>
                      ) : job.status === 'failed' ? (
                        <span className="inline-flex items-center text-red-600">
                          <AlertCircle className="mr-1 h-3 w-3" /> Échec
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-blue-600">
                          <FileSpreadsheet className="mr-1 h-3 w-3" /> En cours
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {job.processed_rows}/{job.total_rows}
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
