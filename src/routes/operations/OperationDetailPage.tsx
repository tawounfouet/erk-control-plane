import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Calendar, Clock, MessageSquare, History } from 'lucide-react'
import { useOperation, useOperationComments, useOperationHistory } from '@/hooks/useOperations'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge, PriorityBadge } from '@/components/operations/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'

export function OperationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: op, isLoading, error } = useOperation(id!)
  const { data: comments } = useOperationComments(id!)
  const { data: history } = useOperationHistory(id!)

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
                  {op.managed_unit_details.building_name} — {op.managed_unit_details.floor_code}
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
    </div>
  )
}
