import { useBuildings } from '@/hooks/useBuildings'
import { PageHeader } from '@/components/common/PageHeader'
import { BuildingCard } from '@/components/patrimoine/BuildingCard'
import { Skeleton } from '@/components/ui/skeleton'

export function BuildingsPage() {
  const { data, isLoading, error } = useBuildings()

  return (
    <div>
      <PageHeader
        title="Bâtiments"
        description="Gestion des bâtiments des résidences Eureka"
      />
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Erreur lors du chargement des bâtiments
        </div>
      )}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-14 w-14 rounded-md" />
              <Skeleton className="mt-2 h-4 w-32" />
              <Skeleton className="mt-1 h-3 w-20" />
              <Skeleton className="mt-3 h-3 w-48" />
            </div>
          ))}
        </div>
      ) : data?.results.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun bâtiment trouvé</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.results.map((building) => (
            <BuildingCard key={building.id} building={building} />
          ))}
        </div>
      )}
    </div>
  )
}
