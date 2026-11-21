import { useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, User, Calendar, Tag, Send, UserRoundCheck, Upload } from 'lucide-react'
import { useSuggestion, useSuggestionMutations } from '@/hooks/useSuggestions'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SuggestionStatus } from '@/lib/types/suggestions.types'

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Soumise',
  under_review: 'En cours d\'examen',
  in_progress: 'En cours de mise en œuvre',
  implemented: 'Mise en œuvre',
  rejected: 'Non retenue',
}

const STATUS_STYLES: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  implemented: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const CATEGORY_LABELS: Record<string, string> = {
  common_spaces: 'Espaces communs',
  services_equipment: 'Services & équipements',
  activities_events: 'Activités & événements',
  security_comfort: 'Sécurité & confort',
  communication: 'Communication',
  environment_sustainability: 'Environnement',
  other: 'Autre',
}

export function SuggestionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: suggestion, isLoading, error } = useSuggestion(id!)
  const mutations = useSuggestionMutations(id!)
  const [message, setMessage] = useState('')

  async function submitResponse(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); await mutations.respond.mutateAsync({ text: String(data.get('response_text')), official: data.get('is_official') === 'on' }); event.currentTarget.reset(); setMessage('La réponse a été enregistrée.') }
  async function submitComment(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); await mutations.comment.mutateAsync({ text: String(data.get('comment')), internal: data.get('is_internal') === 'on' }); event.currentTarget.reset(); setMessage('Le commentaire a été ajouté.') }
  async function submitAttachment(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); const file = data.get('file'); if (!(file instanceof File) || !file.size) return; await mutations.attach.mutateAsync({ title: String(data.get('title')), file, fileType: String(data.get('file_type')) }); event.currentTarget.reset(); setMessage('La pièce jointe a été ajoutée.') }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (error || !suggestion) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
        Erreur lors du chargement de la suggestion
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/suggestions"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux suggestions
      </Link>

      <PageHeader
        title={suggestion.titre}
        description={
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[suggestion.status]}`}>
              {STATUS_LABELS[suggestion.status]}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Tag className="h-3 w-3" />
              {CATEGORY_LABELS[suggestion.categorie] ?? suggestion.categorie}
            </span>
            {!suggestion.anonyme && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {suggestion.author_display}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(suggestion.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        }
      />
      {message && <p role="status" className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}

      <section className="mb-6 grid gap-4 rounded-xl border bg-card p-4 lg:grid-cols-[1fr_1fr]" aria-labelledby="suggestion-processing-title">
        <div><h2 id="suggestion-processing-title" className="font-semibold">Traitement administratif</h2><p className="mb-4 text-sm text-muted-foreground">Pilotez l’avancement et l’affectation de la demande.</p><div className="space-y-2"><Label htmlFor="suggestion-status">Statut</Label><select id="suggestion-status" value={suggestion.status} onChange={(event) => mutations.changeStatus.mutate(event.target.value as SuggestionStatus)} className="h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="submitted">Soumise</option><option value="under_review">En examen</option><option value="in_progress">En cours</option><option value="implemented">Réalisée</option><option value="rejected">Non retenue</option></select></div></div>
        <form className="space-y-3 lg:border-l lg:pl-4" onSubmit={async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); await mutations.assign.mutateAsync(String(data.get('assigned_to'))); setMessage('La suggestion a été affectée.') }}><div><h3 className="font-semibold">Responsable</h3><p className="text-sm text-muted-foreground">Actuellement : {suggestion.assigned_to_name || 'Non affectée'}</p></div><div className="space-y-2"><Label htmlFor="assigned-to">Identifiant du membre du personnel</Label><Input id="assigned-to" name="assigned_to" required /></div><Button variant="outline" disabled={mutations.assign.isPending}><UserRoundCheck />Affecter</Button></form>
      </section>

      {suggestion.description && (
        <div className="mb-6 rounded-lg border bg-card p-4">
          <p className="whitespace-pre-wrap text-sm">{suggestion.description}</p>
        </div>
      )}

      {suggestion.responses.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Réponses ({suggestion.responses.length})
          </h3>
          <div className="space-y-3">
            {suggestion.responses.map((response) => (
              <div
                key={response.id}
                className="rounded-lg border bg-card p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium">{response.responder_name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {response.is_official && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-[10px] font-medium">
                        Officielle
                      </span>
                    )}
                    <span>{new Date(response.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm">{response.response_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestion.comments.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Commentaires internes ({suggestion.comments.length})
          </h3>
          <div className="space-y-3">
            {suggestion.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border bg-muted/30 p-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium">{comment.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{comment.comment}</p>
                {comment.is_internal && (
                  <span className="mt-1 inline-block rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Interne
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-3" aria-label="Actions sur la suggestion">
        <form onSubmit={submitResponse} className="space-y-3 rounded-xl border bg-card p-4"><h2 className="font-semibold">Répondre au résident</h2><div className="space-y-2"><Label htmlFor="response-text">Réponse</Label><textarea id="response-text" name="response_text" required className="min-h-28 w-full rounded-lg border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div><label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" name="is_official" defaultChecked />Réponse officielle</label><Button disabled={mutations.respond.isPending}><Send />Envoyer</Button></form>
        <form onSubmit={submitComment} className="space-y-3 rounded-xl border bg-card p-4"><h2 className="font-semibold">Note de suivi</h2><div className="space-y-2"><Label htmlFor="suggestion-comment">Commentaire</Label><textarea id="suggestion-comment" name="comment" required className="min-h-28 w-full rounded-lg border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div><label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" name="is_internal" defaultChecked />Note interne</label><Button variant="outline" disabled={mutations.comment.isPending}><MessageSquare />Ajouter</Button></form>
        <form onSubmit={submitAttachment} className="space-y-3 rounded-xl border bg-card p-4"><h2 className="font-semibold">Ajouter une pièce</h2><div className="space-y-2"><Label htmlFor="attachment-title">Titre</Label><Input id="attachment-title" name="title" required /></div><div className="space-y-2"><Label htmlFor="suggestion-file">Fichier</Label><Input id="suggestion-file" name="file" type="file" required /></div><div className="space-y-2"><Label htmlFor="suggestion-file-type">Type</Label><select id="suggestion-file-type" name="file_type" className="h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="image">Image</option><option value="document">Document</option><option value="video">Vidéo</option><option value="other">Autre</option></select></div><Button variant="outline" disabled={mutations.attach.isPending}><Upload />Téléverser</Button></form>
      </section>
    </div>
  )
}
