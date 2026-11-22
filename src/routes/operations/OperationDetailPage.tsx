import { useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Calendar, Clock, MessageSquare, History, Play, CheckCircle2, UserRoundCheck, Upload } from 'lucide-react'
import { useOperation, useOperationComments, useOperationHistory } from '@/hooks/useOperations'
import { useOperationAttachments, useOperationMutations } from '@/hooks/useOperationsAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge, PriorityBadge } from '@/components/operations/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function OperationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: op, isLoading, error } = useOperation(id!)
  const { data: comments } = useOperationComments(id!)
  const { data: history } = useOperationHistory(id!)
  const { data: attachments } = useOperationAttachments(id!)
  const mutations = useOperationMutations(id!)
  const [message, setMessage] = useState('')

  async function submitAssign(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); await mutations.assign.mutateAsync({ assignedTo: String(data.get('assigned_to')), supervisor: String(data.get('supervisor') || '') || undefined }); setMessage('L’opération a été affectée.') }
  async function submitComment(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); await mutations.comment.mutateAsync({ content: String(data.get('content')), isInternal: data.get('is_internal') === 'on' }); event.currentTarget.reset(); setMessage('Le commentaire a été ajouté.') }
  async function submitUpload(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const file = data.get('file'); if (!(file instanceof File) || !file.size) return; await mutations.upload.mutateAsync({ file, type: String(data.get('attachment_type')) }); event.currentTarget.reset(); setMessage('La pièce jointe a été ajoutée.') }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !op) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Opération introuvable
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/operations"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux opérations
      </Link>

      <PageHeader
        title={op.title}
        description={
          <span className="flex items-center gap-2">
            <span className="font-mono text-xs">{op.operation_number}</span>
            <StatusBadge status={op.status} />
            <PriorityBadge priority={op.priority} />
          </span>
        }
      />
      {message && <p role="status" className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}

      <section aria-labelledby="workflow-title" className="mb-6 rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 id="workflow-title" className="font-semibold">Pilotage du workflow</h2><p className="text-sm text-muted-foreground">Les changements sont historisés automatiquement.</p></div><div className="flex flex-wrap gap-2">{op.status === 'CREATED' && <Button size="sm" onClick={() => mutations.start.mutate()} disabled={mutations.start.isPending}><Play />Démarrer</Button>}{op.status === 'IN_PROGRESS' && <Button size="sm" onClick={() => mutations.complete.mutate({ notes: 'Intervention terminée depuis le centre de contrôle' })} disabled={mutations.complete.isPending}><CheckCircle2 />Terminer</Button>}</div></div>
        <form onSubmit={submitAssign} className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><div className="space-y-2"><Label htmlFor="assigned-to">Identifiant de l’intervenant</Label><Input id="assigned-to" name="assigned_to" required /></div><div className="space-y-2"><Label htmlFor="supervisor">Identifiant du superviseur</Label><Input id="supervisor" name="supervisor" /></div><Button variant="outline" disabled={mutations.assign.isPending}><UserRoundCheck />Affecter</Button></form>
      </section>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" /> Demandeur
          </div>
          <p className="mt-1 font-medium">{op.requester_name}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" /> Assigné à
          </div>
          <p className="mt-1 font-medium">{op.assigned_to_name || '-'}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /> Échéance
          </div>
          <p className={`mt-1 font-medium ${op.is_overdue ? 'text-red-600' : ''}`}>
            {op.due_date ? new Date(op.due_date).toLocaleDateString('fr-FR') : '-'}
            {op.is_overdue && ' (en retard)'}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> Créée le
          </div>
          <p className="mt-1 font-medium">
            {new Date(op.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Description</h3>
          <div className="rounded-lg border bg-card p-4 text-sm whitespace-pre-wrap">
            {op.description || 'Aucune description'}
          </div>

          {op.managed_unit_details && (
            <div className="mt-4">
              <h3 className="mb-2 font-semibold">Unité concernée</h3>
              <div className="rounded-lg border bg-card p-4 text-sm">
                <p>{op.managed_unit_details.identifier}</p>
                <p className="text-muted-foreground">
                  {op.managed_unit_details.building_name} - {op.managed_unit_details.floor_code}
                </p>
                <Link
                  to={`/units/${op.managed_unit_details.id}`}
                  className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                >
                  Voir l'unité
                </Link>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 font-semibold">
            <MessageSquare className="h-4 w-4" />
            Commentaires
          </h3>
          {comments && comments.length > 0 ? (
            <div className="space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg border bg-card p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {c.author_details?.first_name} {c.author_details?.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap">{c.content}</p>
                  {c.is_internal && (
                    <span className="mt-1 inline-block text-xs text-yellow-600">Interne</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun commentaire</p>
          )}

          <h3 className="mb-2 mt-4 flex items-center gap-2 font-semibold">
            <History className="h-4 w-4" />
            Historique
          </h3>
          {history && history.length > 0 ? (
            <div className="space-y-1">
              {history.map((h) => (
                <div key={h.id} className="rounded-lg border bg-card p-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{h.action_type_display}</span>
                    <span className="text-muted-foreground">
                      {new Date(h.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="mt-0.5 text-muted-foreground">{h.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun historique</p>
          )}
        </div>
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label="Contribution et pièces jointes">
        <form onSubmit={submitComment} className="space-y-4 rounded-xl border bg-card p-4"><h2 className="font-semibold">Ajouter un commentaire</h2><div className="space-y-2"><Label htmlFor="operation-comment">Commentaire</Label><textarea id="operation-comment" name="content" required className="min-h-28 w-full rounded-lg border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div><label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" name="is_internal" />Commentaire interne</label><Button disabled={mutations.comment.isPending}><MessageSquare />Publier</Button></form>
        <form onSubmit={submitUpload} className="space-y-4 rounded-xl border bg-card p-4"><div><h2 className="font-semibold">Pièces jointes</h2><p className="text-sm text-muted-foreground">{attachments?.length ?? 0} fichier(s) rattaché(s)</p></div><div className="space-y-2"><Label htmlFor="operation-file">Fichier</Label><Input id="operation-file" name="file" type="file" required /></div><div className="space-y-2"><Label htmlFor="attachment-type">Nature</Label><select id="attachment-type" name="attachment_type" className="h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="photo_evidence">Photo du signalement</option><option value="photo_before">Photo avant intervention</option><option value="photo_after">Photo après intervention</option><option value="document">Document</option><option value="invoice">Facture</option></select></div><Button disabled={mutations.upload.isPending}><Upload />Ajouter</Button></form>
      </section>
    </div>
  )
}
