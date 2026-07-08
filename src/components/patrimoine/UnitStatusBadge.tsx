import type { UnitStatus } from '@/lib/types/patrimoine.types'

const statusConfig: Record<UnitStatus, { label: string; className: string }> = {
  AVAILABLE: { label: 'Disponible', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  OCCUPIED: { label: 'Occupé', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  RESERVED: { label: 'Réservé', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  MAINTENANCE: { label: 'En maintenance', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  OUT_OF_SERVICE: { label: 'Hors service', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

interface UnitStatusBadgeProps {
  status: UnitStatus
}

export function UnitStatusBadge({ status }: UnitStatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' }
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
