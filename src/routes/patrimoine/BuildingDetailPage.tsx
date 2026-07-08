import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building, Layers, Percent, Hash } from 'lucide-react'
import { useBuilding, useBuildingStats } from '@/hooks/useBuildings'
import { PageHeader } from '@/components/common/PageHeader'
import { UnitStatusBadge } from '@/components/patrimoine/UnitStatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import type { UnitStatus } from '@/lib/types/patrimoine.types'

export function BuildingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: building, isLoading, error } = useBuilding(id!)
  const { data: stats } = useBuildingStats(id!)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !building) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Bâtiment introuvable
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/buildings"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux bâtiments
      </Link>

      <PageHeader title={building.name} description={`Code: ${building.code}`} />

      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" /> Unités totales
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.total_units}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Layers className="h-4 w-4" /> Étages
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.floors_count}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Percent className="h-4 w-4" /> Occupation
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.occupancy_rate.toFixed(0)}%</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-4 w-4" /> Occupées
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.occupied_units}</p>
          </div>
        </div>
      )}

      {stats?.units_by_status && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(stats.units_by_status).map(([status, count]) => (
            <Badge key={status} variant="outline" className="gap-1">
              <UnitStatusBadge status={status as UnitStatus} />
              <span className="ml-1 font-mono text-xs">{count}</span>
            </Badge>
          ))}
        </div>
      )}

      <h3 className="mb-3 font-semibold">Étages</h3>
      <div className="space-y-2">
        {building.floors.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun étage</p>
        ) : (
          building.floors.map((floor) => (
            <Link
              key={floor.id}
              to={`/floors/${floor.id}`}
              className="block rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{floor.chemical_code}</span>
                  {floor.name && (
                    <span className="ml-2 text-sm text-muted-foreground">{floor.name}</span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {floor.units_count} unités
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
