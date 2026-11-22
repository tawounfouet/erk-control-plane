import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock3, Play, Wrench } from 'lucide-react'
import { useInterventionAction, useInterventionStatistics, usePatrimoineInterventions } from '@/hooks/usePatrimoineAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PatrimoineInterventionsPage() {
  const [status, setStatus] = useState('')
  const [feedback, setFeedback] = useState('')
  const interventions = usePatrimoineInterventions(status ? { status } : undefined)
  const statistics = useInterventionStatistics()
  const action = useInterventionAction()
  const stats = statistics.data

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance patrimoniale" description="File technique historique du module patrimoine, distincte du workflow opérationnel avancé." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Card><CardContent className="flex items-center gap-3 p-5"><Wrench aria-hidden="true" className="text-primary" /><div><p className="text-2xl font-semibold">{stats?.total ?? '-'}</p><p className="text-xs text-muted-foreground">interventions actives</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-5"><Clock3 aria-hidden="true" className="text-amber-600" /><div><p className="text-2xl font-semibold">{stats?.by_status.PENDING ?? '-'}</p><p className="text-xs text-muted-foreground">en attente</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-5"><Play aria-hidden="true" className="text-sky-600" /><div><p className="text-2xl font-semibold">{stats?.by_status.IN_PROGRESS ?? '-'}</p><p className="text-xs text-muted-foreground">en cours</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-3 p-5"><CheckCircle2 aria-hidden="true" className="text-emerald-600" /><div><p className="text-2xl font-semibold">{stats?.by_status.COMPLETED ?? '-'}</p><p className="text-xs text-muted-foreground">terminées</p></div></CardContent></Card></div>
      <Card><CardContent className="flex items-center gap-3 p-4"><label htmlFor="intervention-status" className="text-sm font-medium">Statut</label><select id="intervention-status" className="h-10 rounded-lg border bg-background px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tous</option><option value="PENDING">En attente</option><option value="IN_PROGRESS">En cours</option><option value="COMPLETED">Terminées</option><option value="CANCELLED">Annulées</option></select></CardContent></Card>
      {feedback && <p role="status" aria-live="polite" className="rounded-lg border bg-muted/40 p-3 text-sm">{feedback}</p>}
      <Card><CardContent className="p-0">{interventions.isLoading ? <div className="space-y-2 p-5">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-20" />)}</div> : interventions.error ? <p role="alert" className="p-5 text-destructive">Les interventions sont indisponibles.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead><tr className="border-b bg-muted/40"><th className="p-4 text-left">Intervention</th><th className="p-4 text-left">Unité</th><th className="p-4 text-left">Priorité</th><th className="p-4 text-left">Statut</th><th className="p-4 text-left">Planification</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{interventions.data?.results.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-4"><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.category} · demandé par {item.requested_by_name}</p></td><td className="p-4">{item.unit_name}</td><td className="p-4"><Badge variant={item.priority === 'URGENT' ? 'destructive' : 'outline'}>{item.priority}</Badge></td><td className="p-4">{item.status}{item.is_overdue && <span className="ml-2 inline-flex items-center text-xs text-destructive"><AlertTriangle aria-hidden="true" className="mr-1 h-3 w-3" />En retard</span>}</td><td className="p-4">{item.scheduled_date ? new Date(item.scheduled_date).toLocaleString('fr-FR') : 'Non planifiée'}</td><td className="p-4"><div className="flex justify-end gap-1">{item.status === 'PENDING' && <Button size="sm" variant="outline" onClick={() => action.mutate({ id: item.id, action: 'start' }, { onSuccess: () => setFeedback('Intervention démarrée.') })}>Démarrer</Button>}{item.status === 'IN_PROGRESS' && <Button size="sm" onClick={() => action.mutate({ id: item.id, action: 'complete', message: 'Intervention clôturée depuis le centre de contrôle.' }, { onSuccess: () => setFeedback('Intervention terminée.') })}>Terminer</Button>}{['PENDING', 'IN_PROGRESS'].includes(item.status) && <Button size="sm" variant="ghost" onClick={() => action.mutate({ id: item.id, action: 'cancel', message: 'Annulation depuis le centre de contrôle.' }, { onSuccess: () => setFeedback('Intervention annulée.') })}>Annuler</Button>}</div></td></tr>)}</tbody></table></div>}</CardContent></Card>
    </div>
  )
}
