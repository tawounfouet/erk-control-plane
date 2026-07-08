import { useState } from 'react'
import { useUnits } from '@/hooks/useUnits'
import { PageHeader } from '@/components/common/PageHeader'
import { UnitTable } from '@/components/patrimoine/UnitTable'
import { UnitStatusBadge } from '@/components/patrimoine/UnitStatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import type { UnitStatus } from '@/lib/types/patrimoine.types'

const STATUS_FILTERS: Array<{ value: UnitStatus | ''; label: string }> = [
  { value: '', label: 'Tous' },
  { value: 'AVAILABLE', label: 'Disponible' },
  { value: 'OCCUPIED', label: 'Occupé' },
  { value: 'RESERVED', label: 'Réservé' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUT_OF_SERVICE', label: 'Hors service' },
]

export function UnitsPage() {
  const [statusFilter, setStatusFilter] = useState<UnitStatus | ''>('')
  const [search, setSearch] = useState('')

  const params: Record<string, string> = {}
  if (statusFilter) params.current_status = statusFilter
  if (search) params.search = search

  const { data, isLoading, error } = useUnits(params)

  return (
    <div>
      <PageHeader
        title="Unités"
        description="Gestion des unités des résidences"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value as UnitStatus | '')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.value ? <UnitStatusBadge status={f.value} /> : f.label}
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
          Erreur lors du chargement des unités
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <>
          <UnitTable units={data?.results ?? []} />
          {data && data.count > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {data.count} unité{data.count > 1 ? 's' : ''} trouvée{data.count > 1 ? 's' : ''}
            </p>
          )}
        </>
      )}
    </div>
  )
}
