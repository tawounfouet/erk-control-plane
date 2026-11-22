import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Boxes, Euro, History, Network, Ruler, User } from 'lucide-react'
import {
  useChangeUnitStatus,
  useUnit,
  useUnitHierarchy,
  useUnitRoomAssets,
  useUnitStatusHistory,
} from '@/hooks/useUnits'
import { useAssignmentsByUnit } from '@/hooks/useInventory'
import { PageHeader } from '@/components/common/PageHeader'
import { UnitStatusBadge } from '@/components/patrimoine/UnitStatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function UnitDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: unit, isLoading, error } = useUnit(id!)
  const { data: assignments } = useAssignmentsByUnit(id!)
  const { data: hierarchy } = useUnitHierarchy(id!)
  const { data: history } = useUnitStatusHistory(id!)
  const { data: roomAssets } = useUnitRoomAssets(id!)
  const changeStatus = useChangeUnitStatus(id!)
  const [targetStatus, setTargetStatus] = useState('AVAILABLE')
  const [feedback, setFeedback] = useState('')

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
        description={`${unit.building_name} - ${unit.floor_code}`}
      />
      <div className="mb-4">
        <UnitStatusBadge status={unit.current_status} />
      </div>

      <Card className="mb-6 border-primary/20">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <div className="space-y-2"><label htmlFor="unit-status" className="text-sm font-medium">Statut opérationnel</label><select id="unit-status" className="h-10 rounded-lg border bg-background px-3 text-sm" value={targetStatus} onChange={(event) => setTargetStatus(event.target.value)}><option value="AVAILABLE">Disponible</option><option value="RESERVED">Réservée</option><option value="MAINTENANCE">Maintenance</option><option value="OUT_OF_SERVICE">Hors service</option></select></div>
          <Button disabled={changeStatus.isPending || targetStatus === unit.current_status} onClick={() => changeStatus.mutate({ status: targetStatus, notes: 'Modification depuis le centre de contrôle.' }, { onSuccess: () => setFeedback('Statut mis à jour et historisé.'), onError: () => setFeedback('Le statut n’a pas pu être modifié.') })}>{changeStatus.isPending ? 'Mise à jour…' : 'Appliquer le statut'}</Button>
          {feedback && <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{feedback}</p>}
        </CardContent>
      </Card>

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

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Network aria-hidden="true" className="h-4 w-4 text-primary" />Hiérarchie</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Chemin patrimonial</p><p className="mt-2 font-medium">{hierarchy?.path || unit.full_name}</p><p className="mt-4 text-sm text-muted-foreground">{hierarchy?.children.length ?? unit.children_count} sous-unité(s)</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Boxes aria-hidden="true" className="h-4 w-4 text-primary" />Éléments fixes</CardTitle></CardHeader><CardContent><ul className="max-h-64 space-y-2 overflow-auto">{roomAssets?.results.map((asset) => <li key={asset.id} className="rounded-lg border p-2 text-sm"><span className="font-medium">{asset.name}</span><span className="ml-2 text-xs text-muted-foreground">{asset.asset_type_display}</span></li>)}</ul>{!roomAssets?.results.length && <p className="text-sm text-muted-foreground">Aucun élément fixe.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History aria-hidden="true" className="h-4 w-4 text-primary" />Historique des statuts</CardTitle></CardHeader><CardContent><ol className="max-h-64 space-y-3 overflow-auto">{history?.map((entry) => <li key={entry.id} className="border-l-2 pl-3 text-sm"><p className="font-medium">{entry.old_status} → {entry.new_status}</p><p className="text-xs text-muted-foreground">{new Date(entry.change_date).toLocaleString('fr-FR')} · {entry.changed_by_name || 'Système'}</p>{entry.notes && <p className="mt-1 text-xs">{entry.notes}</p>}</li>)}</ol>{!history?.length && <p className="text-sm text-muted-foreground">Aucun changement enregistré.</p>}</CardContent></Card>
      </div>
    </div>
  )
}
