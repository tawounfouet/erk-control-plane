import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAssignments } from '@/hooks/useInventory'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'

const CONDITION_STYLES: Record<string, string> = {
  NEW: 'bg-green-100 text-green-800',
  EXCELLENT: 'bg-emerald-100 text-emerald-800',
  GOOD: 'bg-blue-100 text-blue-800',
  FAIR: 'bg-yellow-100 text-yellow-800',
  POOR: 'bg-orange-100 text-orange-800',
  OUT_OF_SERVICE: 'bg-red-100 text-red-800',
}

export function InventoryAssignmentsPage() {
  const [search, setSearch] = useState('')
  const params: Record<string, string> = {}
  if (search) params.search = search

  const { data, isLoading, error } = useAssignments(params)

  return (
    <div>
      <PageHeader
        title="Affectations d'inventaire"
        description="Éléments d'inventaire affectés aux unités"
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par unité ou élément..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-xs outline-none focus:border-foreground"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Erreur lors du chargement des affectations
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : data?.results.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune affectation trouvée</p>
      ) : (
        <div className="space-y-2">
          {data?.results.map((a) => (
            <div
              key={a.id}
              className="rounded-lg border bg-card p-3 text-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    to={`/units/${a.unit}`}
                    className="font-medium hover:underline"
                  >
                    {a.inventory_item_name}
                  </Link>
                  <span className="ml-2 text-muted-foreground">
                    → {a.unit_identifier}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {a.is_under_warranty && (
                    <span className="text-xs text-green-600">Garantie</span>
                  )}
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      CONDITION_STYLES[a.current_condition] ?? 'bg-gray-100'
                    }`}
                  >
                    {a.current_condition}
                  </span>
                </div>
              </div>
              {a.serial_number && (
                <p className="mt-1 text-xs text-muted-foreground">
                  S/N: {a.serial_number}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
