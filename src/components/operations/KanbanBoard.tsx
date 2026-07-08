import { Link } from 'react-router-dom'
import { PriorityBadge } from './StatusBadge'
import type { Operation, OperationStatus } from '@/lib/types/operations.types'

const COLUMNS: Array<{ status: OperationStatus; title: string }> = [
  { status: 'CREATED', title: 'Créée' },
  { status: 'PENDING_VALIDATION', title: 'En attente' },
  { status: 'APPROVED', title: 'Approuvée' },
  { status: 'IN_PROGRESS', title: 'En cours' },
  { status: 'COMPLETED', title: 'Terminée' },
]

interface KanbanBoardProps {
  operations: Operation[]
}

export function KanbanBoard({ operations }: KanbanBoardProps) {
  const grouped = COLUMNS.map((col) => ({
    ...col,
    items: operations.filter((op) => op.status === col.status),
  }))

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {grouped.map((col) => (
        <div key={col.status} className="min-w-[250px] flex-1">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">{col.title}</h3>
            <span className="text-xs text-muted-foreground">{col.items.length}</span>
          </div>
          <div className="space-y-2 rounded-lg bg-muted/50 p-2 min-h-[200px]">
            {col.items.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">Aucune</p>
            ) : (
              col.items.map((op) => (
                <Link
                  key={op.id}
                  to={`/operations/${op.id}`}
                  className="block rounded-md border bg-card p-3 text-sm transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate font-medium">{op.title}</span>
                    <PriorityBadge priority={op.priority} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {op.operation_number}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{op.assigned_to_name || 'Non assigné'}</span>
                    {op.due_date && (
                      <span className={op.is_overdue ? 'text-red-600' : ''}>
                        {new Date(op.due_date).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
