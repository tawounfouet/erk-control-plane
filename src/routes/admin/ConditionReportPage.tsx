import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, CheckCircle, XCircle } from 'lucide-react'
import { useConditionReports } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export function ConditionReportPage() {
  const [unitFilter, setUnitFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const { data, isLoading } = useConditionReports({ unit: unitFilter, type: typeFilter })

  const reports = data?.results || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="États des lieux"
        description="Rapports d'état des lieux entrée/sortie"
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Unité..."
                className="pl-8"
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="entry">Entrée</option>
              <option value="exit">Sortie</option>
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
                  <th className="px-4 py-3 text-left font-medium">Unité</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Statut</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Validation</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <Link to={`/admin/condition-reports/${report.id}`} className="font-medium text-primary hover:underline">
                        {report.unit_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={report.report_type === 'entry' ? 'default' : 'secondary'}>
                        {report.report_type === 'entry' ? 'Entrée' : 'Sortie'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        report.status === 'validated'
                          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                          : report.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      {report.validated_at ? (
                        <span className="inline-flex items-center text-green-600">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {new Date(report.validated_at).toLocaleDateString('fr-FR')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-muted-foreground">
                          <XCircle className="mr-1 h-3 w-3" /> Non validé
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/condition-reports/${report.id}`}>
                        <FileText className="h-4 w-4 inline-block text-muted-foreground hover:text-foreground" />
                      </Link>
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
