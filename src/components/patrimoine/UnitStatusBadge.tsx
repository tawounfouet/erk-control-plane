import type { UnitStatus } from '@/lib/types/patrimoine.types'

const statusConfig: Record<UnitStatus, { label: string; className: string }> = {
  AVAILABLE: { label: 'Disponible', className: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' },
  OCCUPIED: { label: 'Occupé', className: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' },
  RESERVED: { label: 'Réservé', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300' },
  MAINTENANCE: { label: 'En maintenance', className: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' },
  OUT_OF_SERVICE: { label: 'Hors service', className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' },
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
