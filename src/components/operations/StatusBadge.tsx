import type { OperationStatus } from '@/lib/types/operations.types'

const statusConfig: Record<OperationStatus, { label: string; className: string }> = {
  CREATED: { label: 'Créée', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  PENDING_VALIDATION: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' },
  APPROVED: { label: 'Approuvée', className: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  REJECTED: { label: 'Rejetée', className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
  IN_PROGRESS: { label: 'En cours', className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
  COMPLETED: { label: 'Terminée', className: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' },
  CANCELLED: { label: 'Annulée', className: 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-500' },
}

interface StatusBadgeProps {
  status: OperationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  if (!config) return <span className="text-xs">{status}</span>
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: { label: 'Basse', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  NORMAL: { label: 'Normale', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  HIGH: { label: 'Haute', className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
  URGENT: { label: 'Urgente', className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse' },
}

export function PriorityBadge({ priority }: { priority: string }) {
  const config = priorityConfig[priority]
  if (!config) return <span className="text-xs">{priority}</span>
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
