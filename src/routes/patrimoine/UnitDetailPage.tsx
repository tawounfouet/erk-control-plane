import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Euro, Ruler, User } from 'lucide-react'
import { useUnit } from '@/hooks/useUnits'
import { useAssignmentsByUnit } from '@/hooks/useInventory'
import { PageHeader } from '@/components/common/PageHeader'
import { UnitStatusBadge } from '@/components/patrimoine/UnitStatusBadge'
import { Skeleton } from '@/components/ui/skeleton'

export function UnitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: unit, isLoading, error } = useUnit(id!)
  const { data: assignments } = useAssignmentsByUnit(id!)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !unit) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Unité introuvable
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/units"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux unités
      </Link>

      <PageHeader
        title={unit.full_name}
        description={`${unit.building_name} — ${unit.floor_code}`}
      />
      <div className="mb-4">
        <UnitStatusBadge status={unit.current_status} />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {unit.area_m2 && (
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Ruler className="h-4 w-4" /> Surface
            </div>
            <p className="mt-1 text-lg font-bold">{unit.area_m2} m²</p>
          </div>
        )}
        {unit.total_monthly_cost && (
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Euro className="h-4 w-4" /> Coût mensuel
            </div>
            <p className="mt-1 text-lg font-bold">{unit.total_monthly_cost} €</p>
          </div>
        )}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" /> Occupant
          </div>
          <p className="mt-1 text-lg font-bold">{unit.occupant_name ?? 'Libre'}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Détails</h3>
          <div className="space-y-2 rounded-lg border bg-card p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bâtiment</span>
              <span>{unit.building_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Étage</span>
              <span>{unit.floor_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span>{unit.unit_type_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Identifiant</span>
              <span className="font-mono text-xs">{unit.identifier}</span>
            </div>
          </div>

          {unit.features && unit.features.length > 0 && (
            <>
              <h3 className="mb-2 mt-4 font-semibold">Caractéristiques</h3>
              <div className="space-y-2 rounded-lg border bg-card p-4 text-sm">
                {unit.features.map((f) => (
                  <div key={f.id} className="flex justify-between">
                    <span className="text-muted-foreground">{f.feature_name}</span>
                    <span>{f.formatted_value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Inventaire affecté</h3>
          {assignments && assignments.length > 0 ? (
            <div className="space-y-2">
              {assignments.map((a) => (
                <div key={a.id} className="rounded-lg border bg-card p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{a.inventory_item_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.serial_number || 'N/C'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>État: {a.current_condition}</span>
                    {a.is_under_warranty && (
                      <span className="text-green-600">Sous garantie</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun inventaire affecté</p>
          )}
        </div>
      </div>
    </div>
  )
}
