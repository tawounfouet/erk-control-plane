import { useState } from 'react'
import { useInventoryItems } from '@/hooks/useInventory'
import { PageHeader } from '@/components/common/PageHeader'
import { InventoryTable } from '@/components/patrimoine/InventoryTable'
import { Skeleton } from '@/components/ui/skeleton'
import type { InventoryCategory } from '@/lib/types/patrimoine.types'

const CATEGORIES: Array<{ value: InventoryCategory | ''; label: string }> = [
  { value: '', label: 'Tout' },
  { value: 'FURNITURE', label: 'Mobilier' },
  { value: 'APPLIANCE', label: 'Électroménager' },
  { value: 'PLUMBING', label: 'Sanitaire' },
  { value: 'LIGHTING', label: 'Éclairage' },
  { value: 'HEATING', label: 'Chauffage' },
  { value: 'IT', label: 'Informatique' },
  { value: 'SECURITY', label: 'Sécurité' },
  { value: 'DECORATION', label: 'Décoration' },
]

export function InventoryPage() {
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | ''>('')
  const [search, setSearch] = useState('')

  const params: Record<string, string> = {}
  if (categoryFilter) params.category = categoryFilter
  if (search) params.search = search

  const { data, isLoading, error } = useInventoryItems(params)

  return (
    <div>
      <PageHeader
        title="Inventaire"
        description="Catalogue des éléments d'inventaire des résidences"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value as InventoryCategory | '')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              categoryFilter === cat.value
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.label}
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
          Erreur lors du chargement de l'inventaire
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
          <InventoryTable items={data?.results ?? []} />
          {data && data.count > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {data.count} élément{data.count > 1 ? 's' : ''} trouvé{data.count > 1 ? 's' : ''}
            </p>
          )}
        </>
      )}
    </div>
  )
}
