import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ClipboardCheck, FileText, Search, X } from 'lucide-react'
import { useConditionReports } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ConditionReport } from '@/lib/types/admin.types'

const statusLabels: Record<ConditionReport['status'], string> = {
  draft: 'Brouillon',
  submitted: 'À valider',
  validated: 'Validé',
  rejected: 'À corriger',
}

const statusStyles: Record<ConditionReport['status'], string> = {
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  submitted: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
  validated: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
}

export function ConditionReportPage() {
  const [unitFilter, setUnitFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const { data, isLoading, isError } = useConditionReports({ unit: unitFilter, type: typeFilter })
  const reports = data?.results || []
  const hasFilters = Boolean(unitFilter || typeFilter)

  return (
    <div>
      <PageHeader title="États des lieux" description="Retrouvez, contrôlez et validez les rapports d’entrée et de sortie." />

      <Card className="mb-5">
        <CardContent className="p-4 sm:p-5">
          <form className="flex flex-col gap-3 md:flex-row md:items-end" onSubmit={(event) => event.preventDefault()} role="search">
            <div className="min-w-0 flex-1">
              <label htmlFor="condition-report-unit" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Rechercher un logement</label>
              <div className="relative">
                <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="condition-report-unit" type="search" placeholder="Numéro ou nom du logement…" className="pl-10" value={unitFilter} onChange={(event) => setUnitFilter(event.target.value)} />
              </div>
            </div>
            <div className="md:w-52">
              <label htmlFor="condition-report-type" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Type de rapport</label>
              <select id="condition-report-type" className="h-11 w-full rounded-lg border border-input bg-background/80 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                <option value="">Tous les types</option>
                <option value="entry">Entrée</option>
                <option value="exit">Sortie</option>
              </select>
            </div>
            {hasFilters && (
              <Button type="button" variant="ghost" onClick={() => { setUnitFilter(''); setTypeFilter('') }}>
                <X aria-hidden="true" /> Réinitialiser
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground" aria-live="polite">{isLoading ? 'Chargement des rapports…' : `${reports.length} rapport${reports.length > 1 ? 's' : ''}`}</p>
        <p className="hidden text-xs text-muted-foreground sm:block">Sélectionnez un rapport pour consulter son détail</p>
      </div>

      {isError && <div role="alert" className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Impossible de charger les états des lieux. Réessayez dans quelques instants.</div>}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5" aria-label="Chargement des états des lieux">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}</div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><ClipboardCheck aria-hidden="true" className="h-6 w-6" /></span>
              <h2 className="font-display mt-4 text-xl font-semibold">Aucun état des lieux trouvé</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">{hasFilters ? 'Modifiez ou réinitialisez les filtres pour élargir la recherche.' : 'Les nouveaux rapports apparaîtront ici.'}</p>
              {hasFilters && <Button type="button" variant="outline" className="mt-5" onClick={() => { setUnitFilter(''); setTypeFilter('') }}>Effacer les filtres</Button>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-sm">
                <caption className="sr-only">Liste des états des lieux</caption>
                <thead className="border-b bg-muted/45">
                  <tr>
                    {['Logement', 'Type', 'Statut', 'Créé le', 'Validation'].map((heading) => <th key={heading} scope="col" className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">{heading}</th>)}
                    <th scope="col" className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reports.map((report) => (
                    <tr key={report.id} className="transition-colors hover:bg-muted/40">
                      <td className="px-5 py-4"><Link to={`/admin/condition-reports/${report.id}`} className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Logement {report.unit_number}</Link></td>
                      <td className="px-5 py-4"><Badge variant={report.report_type === 'entry' ? 'default' : 'secondary'}>{report.report_type === 'entry' ? 'Entrée' : 'Sortie'}</Badge></td>
                      <td className="px-5 py-4"><span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-bold', statusStyles[report.status])}>{statusLabels[report.status]}</span></td>
                      <td className="px-5 py-4 text-muted-foreground"><time dateTime={report.created_at}>{new Date(report.created_at).toLocaleDateString('fr-FR')}</time></td>
                      <td className="px-5 py-4">
                        {report.validated_at ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><CheckCircle2 aria-hidden="true" className="h-4 w-4" /><time dateTime={report.validated_at}>{new Date(report.validated_at).toLocaleDateString('fr-FR')}</time></span>
                        ) : <span className="text-muted-foreground">En attente</span>}
                      </td>
                      <td className="px-5 py-4 text-right"><Link to={`/admin/condition-reports/${report.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 font-semibold text-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><FileText aria-hidden="true" className="h-4 w-4" />Voir<span className="sr-only"> le rapport du logement {report.unit_number}</span></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
