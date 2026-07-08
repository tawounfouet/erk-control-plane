import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOperations, useOperationStats } from '@/hooks/useOperations'
import { PageHeader } from '@/components/common/PageHeader'
import { OperationTable } from '@/components/operations/OperationTable'
import { StatusBadge } from '@/components/operations/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import type { OperationStatus } from '@/lib/types/operations.types'

const STATUS_FILTERS: Array<{ value: OperationStatus | ''; label: string }> = [
  { value: '', label: 'Tous' },
  { value: 'CREATED', label: 'Créée' },
  { value: 'PENDING_VALIDATION', label: 'En attente' },
  { value: 'APPROVED', label: 'Approuvée' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminée' },
  { value: 'CANCELLED', label: 'Annulée' },
]

export function OperationsPage() {
  const [statusFilter, setStatusFilter] = useState<OperationStatus | ''>('')
  const [search, setSearch] = useState('')

  const params: Record<string, string> = {}
  if (statusFilter) params.status = statusFilter
  if (search) params.search = search

  const { data, isLoading, error } = useOperations(params)
  const { data: stats } = useOperationStats()

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Maintenance"
          description="Gestion des opérations de maintenance"
        />
        <Link
          to="/operations/kanban"
          className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:bg-foreground/90"
        >
          Vue Kanban
        </Link>
      </div>

      {stats && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(stats.by_status).map(([status, count]) => (
            <span key={status} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              <StatusBadge status={status as OperationStatus} />
              <span className="font-mono">{count}</span>
            </span>
          ))}
          {stats.overdue > 0 && (
            <span className="flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {stats.overdue} en retard
            </span>
          )}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value as OperationStatus | '')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.label}
          </button>
        ))}
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto h-8 rounded-md border bg-background px-3 text-xs outline-none focus:border-foreground"
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Erreur lors du chargement des opérations
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <OperationTable operations={data?.results ?? []} />
      )}
    </div>
  )
}
