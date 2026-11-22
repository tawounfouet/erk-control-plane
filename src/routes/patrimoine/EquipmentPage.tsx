import { useState } from 'react'
import { Boxes, CheckCircle2, Link2, PackagePlus, RotateCcw, ShieldCheck, Trash2 } from 'lucide-react'
import {
  useAssignEquipment,
  useCreateEquipment,
  useDeleteEquipment,
  useEquipments,
  useInspectEquipmentExit,
  useUnassignEquipment,
} from '@/hooks/usePatrimoineAdmin'
import { useInventoryItems } from '@/hooks/useInventory'
import { useAvailableUnits } from '@/hooks/useUnits'
import type { EquipmentCondition } from '@/lib/types/patrimoine.types'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

const conditions: Array<{ value: EquipmentCondition; label: string }> = [
  { value: 'TB', label: 'Très bon' }, { value: 'B', label: 'Bon' },
  { value: 'M', label: 'Moyen' }, { value: 'D', label: 'Dégradé' },
  { value: 'HS', label: 'Hors service' },
]

export function EquipmentPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [targetUnits, setTargetUnits] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState('')
  const equipments = useEquipments({ ...(search ? { search } : {}), ...(status ? { status } : {}) })
  const templates = useInventoryItems()
  const units = useAvailableUnits()
  const create = useCreateEquipment()
  const assign = useAssignEquipment()
  const unassign = useUnassignEquipment()
  const inspect = useInspectEquipmentExit()
  const remove = useDeleteEquipment()

  async function submitCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setFeedback('')
    try {
      await create.mutateAsync({
        template: String(form.get('template')),
        designation: String(form.get('designation') || ''),
        brand: String(form.get('brand') || ''),
        serial_number: String(form.get('serial_number') || ''),
        condition: String(form.get('condition') || 'B') as EquipmentCondition,
      })
      event.currentTarget.reset()
      setFeedback('Équipement ajouté au stock.')
    } catch { setFeedback("L'équipement n'a pas pu être créé. Vérifiez vos droits et les données.") }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Stock atomique" description="Chaque ligne représente un équipement physique traçable, distinct du catalogue de modèles." />
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <Card><CardContent className="flex flex-col gap-3 p-4 sm:flex-row"><Input aria-label="Rechercher dans le stock" placeholder="Référence, désignation, marque…" value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filtrer par statut" className="h-10 rounded-lg border bg-background px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tous les statuts</option><option value="IN_STOCK">En stock</option><option value="ASSIGNED">Affectés</option><option value="OUT_OF_INVENTORY">Sortis</option></select></CardContent></Card>
        <Card><CardContent className="flex h-full items-center gap-3 p-4"><Boxes aria-hidden="true" className="text-primary" /><div><p className="text-2xl font-semibold tabular-nums">{equipments.data?.count ?? '-'}</p><p className="text-xs text-muted-foreground">unités physiques</p></div></CardContent></Card>
      </div>

      <details className="rounded-xl border bg-card p-5">
        <summary className="cursor-pointer font-semibold">Ajouter une unité physique au stock</summary>
        <form className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={submitCreate}>
          <div className="space-y-2"><Label htmlFor="equipment-template">Modèle du catalogue</Label><select id="equipment-template" name="template" required className="h-10 w-full rounded-lg border bg-background px-3 text-sm"><option value="">Sélectionner</option>{templates.data?.results.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <div className="space-y-2"><Label htmlFor="equipment-designation">Désignation</Label><Input id="equipment-designation" name="designation" /></div>
          <div className="space-y-2"><Label htmlFor="equipment-brand">Marque</Label><Input id="equipment-brand" name="brand" /></div>
          <div className="space-y-2"><Label htmlFor="equipment-serial">N° de série</Label><Input id="equipment-serial" name="serial_number" /></div>
          <div className="space-y-2"><Label htmlFor="equipment-condition">État initial</Label><select id="equipment-condition" name="condition" className="h-10 w-full rounded-lg border bg-background px-3 text-sm">{conditions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          <Button className="md:col-span-2 xl:col-span-5" disabled={create.isPending}><PackagePlus aria-hidden="true" />{create.isPending ? 'Création…' : 'Créer l’équipement'}</Button>
        </form>
      </details>
      {feedback && <p role="status" aria-live="polite" className="rounded-lg border bg-muted/40 p-3 text-sm">{feedback}</p>}

      <Card>
        <CardHeader><CardTitle>Registre du stock</CardTitle></CardHeader>
        <CardContent className="p-0">
          {equipments.isLoading ? <div className="space-y-2 p-5">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-20" />)}</div> : equipments.error ? <p role="alert" className="p-5 text-destructive">Le stock est inaccessible.</p> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-sm"><thead><tr className="border-b bg-muted/40"><th className="p-4 text-left">Référence</th><th className="p-4 text-left">Désignation</th><th className="p-4 text-left">État</th><th className="p-4 text-left">Statut</th><th className="p-4 text-left">Affectation</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{equipments.data?.results.map((item) => <tr key={item.id} className="border-b align-top last:border-0"><td className="p-4 font-mono text-xs">{item.technical_reference}</td><td className="p-4"><p className="font-medium">{item.designation}</p><p className="text-xs text-muted-foreground">{item.template_name} · {item.brand || 'Sans marque'}</p></td><td className="p-4">{item.condition_display}</td><td className="p-4"><Badge variant={item.status === 'IN_STOCK' ? 'default' : 'secondary'}>{item.status_display}</Badge></td><td className="p-4">{item.status === 'IN_STOCK' ? <select aria-label={`Unité cible pour ${item.technical_reference}`} className="h-9 min-w-44 rounded-lg border bg-background px-2 text-xs" value={targetUnits[item.id] || ''} onChange={(event) => setTargetUnits((current) => ({ ...current, [item.id]: event.target.value }))}><option value="">Choisir une unité</option>{units.data?.map((unit) => <option key={unit.id} value={unit.id}>{unit.identifier}</option>)}</select> : <span className="text-xs text-muted-foreground">Affectation active</span>}</td><td className="p-4"><div className="flex justify-end gap-1">{item.status === 'IN_STOCK' && <Button size="sm" variant="outline" disabled={!targetUnits[item.id] || assign.isPending} onClick={() => assign.mutate({ id: item.id, data: { managed_unit: targetUnits[item.id], entry_condition: item.condition } }, { onSuccess: () => setFeedback('Équipement affecté.'), onError: () => setFeedback("L'affectation a échoué.") })}><Link2 aria-hidden="true" />Affecter</Button>}{item.status === 'ASSIGNED' && <><Button size="sm" variant="outline" onClick={() => inspect.mutate({ id: item.id, condition: item.condition }, { onSuccess: () => setFeedback('État de sortie enregistré.') })}><ShieldCheck aria-hidden="true" />Contrôler</Button><Button size="sm" variant="outline" onClick={() => unassign.mutate({ id: item.id, condition: item.condition }, { onSuccess: () => setFeedback('Équipement retourné au stock.') })}><RotateCcw aria-hidden="true" />Retour</Button></>}<Button size="icon" variant="ghost" aria-label={`Supprimer ${item.technical_reference}`} disabled={item.is_assigned || remove.isPending} onClick={() => remove.mutate(item.id, { onSuccess: () => setFeedback('Équipement supprimé du stock.') })}><Trash2 aria-hidden="true" /></Button></div></td></tr>)}</tbody></table></div>
          )}
        </CardContent>
      </Card>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-primary" />Les actions visibles restent contrôlées par les micro-droits D1 à D6 du backend.</p>
    </div>
  )
}
