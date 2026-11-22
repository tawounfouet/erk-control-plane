import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, DoorOpen, Layers3, Ruler } from 'lucide-react'
import { useFloor } from '@/hooks/usePatrimoineAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FloorDetailPage() {
  const { id = '' } = useParams()
  const { data: floor, isLoading, error } = useFloor(id)

  if (isLoading) return <Skeleton className="h-80 w-full" />
  if (error || !floor) return <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">Étage introuvable ou inaccessible.</div>

  return (
    <div className="space-y-6">
      <Link to={`/buildings/${floor.building}`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
        <ArrowLeft aria-hidden="true" /> Retour au bâtiment
      </Link>
      <PageHeader title={floor.full_name || floor.name || floor.chemical_code} description={`${floor.building_name} · code ${floor.chemical_code}`} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-5"><Layers3 aria-hidden="true" className="text-primary" /><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Niveau</p><p className="text-xl font-semibold">{floor.number}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><DoorOpen aria-hidden="true" className="text-primary" /><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Unités</p><p className="text-xl font-semibold">{floor.units_count}</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-5"><Ruler aria-hidden="true" className="text-primary" /><div><p className="text-xs uppercase tracking-wider text-muted-foreground">Surface</p><p className="text-xl font-semibold">{floor.area_m2 ? `${floor.area_m2} m²` : '-'}</p></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Unités de l’étage</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {floor.units.length === 0 ? <p className="text-sm text-muted-foreground">Aucune unité rattachée.</p> : floor.units.map((unit) => (
            <Link key={unit.id} to={`/units/${unit.id}`} className="rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <p className="font-semibold">{unit.identifier}</p>
              <p className="text-sm text-muted-foreground">{unit.name || unit.unit_type_name}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{unit.current_status}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
