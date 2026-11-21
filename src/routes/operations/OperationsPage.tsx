import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCreateOperation, useOperations, useOperationStats, useOperationTypes } from '@/hooks/useOperations'
import { PageHeader } from '@/components/common/PageHeader'
import { OperationTable } from '@/components/operations/OperationTable'
import { StatusBadge } from '@/components/operations/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import type { OperationStatus } from '@/lib/types/operations.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  const { data: operationTypes } = useOperationTypes()
  const createOperation = useCreateOperation()

  async function submitOperation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    await createOperation.mutateAsync({ title: String(data.get('title')), description: String(data.get('description')), operation_type: String(data.get('operation_type')), priority: String(data.get('priority')) as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT', due_date: String(data.get('due_date') || '') || null, managed_unit: String(data.get('managed_unit') || '') || null })
    event.currentTarget.reset()
  }

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

      <details className="mb-6 rounded-xl border bg-card p-4">
        <summary className="cursor-pointer font-semibold">Créer une opération</summary>
        <form onSubmit={submitOperation} className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="operation-title">Titre</Label><Input id="operation-title" name="title" required /></div>
          <div className="space-y-2"><Label htmlFor="operation-type">Type</Label><select id="operation-type" name="operation_type" required className="h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="">Sélectionner</option>{operationTypes?.results.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="operation-description">Description</Label><textarea id="operation-description" name="description" required className="min-h-24 w-full rounded-lg border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
          <div className="space-y-2"><Label htmlFor="operation-priority">Priorité</Label><select id="operation-priority" name="priority" className="h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="NORMAL">Normale</option><option value="LOW">Faible</option><option value="HIGH">Haute</option><option value="URGENT">Urgente</option></select></div>
          <div className="space-y-2"><Label htmlFor="operation-due-date">Échéance</Label><Input id="operation-due-date" name="due_date" type="datetime-local" /></div>
          <div className="space-y-2"><Label htmlFor="operation-unit">Identifiant du logement</Label><Input id="operation-unit" name="managed_unit" /></div>
          <Button className="self-end" disabled={createOperation.isPending}><Plus />Créer</Button>
        </form>
      </details>

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
