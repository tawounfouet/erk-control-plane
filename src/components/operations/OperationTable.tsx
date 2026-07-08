import { Link } from 'react-router-dom'
import { StatusBadge, PriorityBadge } from './StatusBadge'
import type { Operation } from '@/lib/types/operations.types'

interface OperationTableProps {
  operations: Operation[]
}

export function OperationTable({ operations }: OperationTableProps) {
  if (operations.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">Aucune opération trouvée</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 font-medium">N°</th>
            <th className="pb-2 font-medium">Titre</th>
            <th className="pb-2 font-medium">Statut</th>
            <th className="pb-2 font-medium">Priorité</th>
            <th className="pb-2 font-medium">Assigné à</th>
            <th className="pb-2 font-medium">Échéance</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((op) => (
            <tr key={op.id} className={`border-b last:border-0 hover:bg-muted/50 ${op.is_overdue ? 'bg-red-50 dark:bg-red-950/10' : ''}`}>
              <td className="py-2 font-mono text-xs text-muted-foreground">
                {op.operation_number}
              </td>
              <td className="py-2">
                <Link to={`/operations/${op.id}`} className="font-medium hover:underline">
                  {op.title}
                </Link>
              </td>
              <td className="py-2">
                <StatusBadge status={op.status} />
              </td>
              <td className="py-2">
                <PriorityBadge priority={op.priority} />
              </td>
              <td className="py-2 text-muted-foreground">
                {op.assigned_to_name || '-'}
              </td>
              <td className="py-2 text-muted-foreground">
                {op.due_date ? new Date(op.due_date).toLocaleDateString('fr-FR') : '-'}
                {op.is_overdue && <span className="ml-1 text-red-600">!</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
