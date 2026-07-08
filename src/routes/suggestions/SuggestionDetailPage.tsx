import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, User, Calendar, Tag } from 'lucide-react'
import { useSuggestion } from '@/hooks/useSuggestions'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'

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
    </div>
  )
}
