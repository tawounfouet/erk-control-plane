import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, PenLine } from 'lucide-react'
import { useConditionReport, useValidateConditionReport } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export function ConditionReportDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: report, isLoading } = useConditionReport(id || '')
  const validate = useValidateConditionReport(id || '')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-60" />
      </div>
    )
  }

  if (!report) {
    return <div className="p-8 text-center text-muted-foreground">Rapport non trouvé</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/condition-reports">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title={`État des lieux - ${report.unit_number}`}
          description={`${report.report_type === 'entry' ? 'Entrée' : 'Sortie'} · ${new Date(report.created_at).toLocaleDateString('fr-FR')}`}
        />
        <div className="ml-auto flex gap-2">
          {report.status !== 'validated' && (
            <Button onClick={() => validate.mutate()} disabled={validate.isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Badge variant={report.report_type === 'entry' ? 'default' : 'secondary'}>
          {report.report_type === 'entry' ? 'Entrée' : 'Sortie'}
        </Badge>
        <Badge className={`${
          report.status === 'validated'
            ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
            : report.status === 'rejected'
            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        }`}>
          {report.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              Signature Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.manager_signature ? (
              <img src={report.manager_signature} alt="Signature manager" className="max-h-32" />
            ) : (
              <p className="text-sm text-muted-foreground">Non signé</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              Signature Étudiant
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.student_signature ? (
              <img src={report.student_signature} alt="Signature étudiant" className="max-h-32" />
            ) : (
              <p className="text-sm text-muted-foreground">Non signé</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {report.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-base">{section.section_name} ({section.section_code})</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Élément</th>
                    <th className="px-3 py-2 text-left font-medium">État avant</th>
                    <th className="px-3 py-2 text-left font-medium">État après</th>
                    <th className="px-3 py-2 text-left font-medium">Commentaires</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {section.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2">{item.label}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline">{item.state_before}</Badge>
                      </td>
                      <td className="px-3 py-2">
                        {item.state_after ? (
                          <Badge variant="outline">{item.state_after}</Badge>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{item.comments || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {section.notes && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md text-sm">
                  <span className="font-medium">Notes :</span> {section.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
