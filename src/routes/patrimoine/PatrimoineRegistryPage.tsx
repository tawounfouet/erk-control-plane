import { useState } from 'react'
import { Boxes, History, Layers3, ListTree, PanelTop } from 'lucide-react'
import {
  useFloors,
  useRoomAssets,
  useStatusHistory,
  useUnitFeatures,
  useUnitTypes,
} from '@/hooks/usePatrimoineAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'types', label: 'Types d’unités', icon: ListTree },
  { id: 'floors', label: 'Étages', icon: Layers3 },
  { id: 'features', label: 'Caractéristiques', icon: PanelTop },
  { id: 'assets', label: 'Éléments fixes', icon: Boxes },
  { id: 'history', label: 'Historique', icon: History },
] as const

type TabId = (typeof tabs)[number]['id']

function TableShell({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm">{children}</table></div>
}

export function PatrimoineRegistryPage() {
  const [tab, setTab] = useState<TabId>('types')
  const unitTypes = useUnitTypes()
  const floors = useFloors()
  const features = useUnitFeatures()
  const assets = useRoomAssets()
  const history = useStatusHistory()
  const activeQuery = { types: unitTypes, floors, features, assets, history }[tab]

  return (
    <div className="space-y-6">
      <PageHeader title="Registre patrimonial" description="Référentiels, structure immobilière et traçabilité technique du parc." />
      <div role="tablist" aria-label="Rubriques du registre" className="flex gap-2 overflow-x-auto border-b pb-3">
        {tabs.map((item) => <button key={item.id} role="tab" aria-selected={tab === item.id} aria-controls={`registry-${item.id}`} onClick={() => setTab(item.id)} className={cn('inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', tab === item.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground')}><item.icon aria-hidden="true" className="h-4 w-4" />{item.label}</button>)}
      </div>
      <Card id={`registry-${tab}`} role="tabpanel">
        <CardContent className="p-0">
          {activeQuery.isLoading ? <div className="space-y-2 p-5">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-12" />)}</div> : activeQuery.error ? <div role="alert" className="p-6 text-destructive">Le registre n’a pas pu être chargé.</div> : null}
          {!activeQuery.isLoading && !activeQuery.error && tab === 'types' && <TableShell><thead><tr className="border-b bg-muted/40"><th className="p-4 text-left">Code</th><th className="p-4 text-left">Libellé</th><th className="p-4 text-left">Nature</th><th className="p-4 text-right">Unités</th></tr></thead><tbody>{unitTypes.data?.results.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-4 font-mono">{item.code}</td><td className="p-4"><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.description || 'Sans description'}</p></td><td className="p-4"><div className="flex gap-2">{item.is_rentable && <Badge>Louable</Badge>}{item.is_composite && <Badge variant="secondary">Composite</Badge>}</div></td><td className="p-4 text-right tabular-nums">{item.units_count}</td></tr>)}</tbody></TableShell>}
          {!activeQuery.isLoading && !activeQuery.error && tab === 'floors' && <TableShell><thead><tr className="border-b bg-muted/40"><th className="p-4 text-left">Bâtiment</th><th className="p-4 text-left">Code</th><th className="p-4 text-left">Nom</th><th className="p-4 text-right">Unités</th></tr></thead><tbody>{floors.data?.results.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-4">{item.building_name}</td><td className="p-4 font-mono">{item.chemical_code}</td><td className="p-4">{item.name || `Niveau ${item.number}`}</td><td className="p-4 text-right">{item.units_count}</td></tr>)}</tbody></TableShell>}
          {!activeQuery.isLoading && !activeQuery.error && tab === 'features' && <TableShell><thead><tr className="border-b bg-muted/40"><th className="p-4 text-left">Caractéristique</th><th className="p-4 text-left">Type</th><th className="p-4 text-left">Valeur</th><th className="p-4 text-left">Unité</th></tr></thead><tbody>{features.data?.results.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-4 font-medium">{item.feature_name}</td><td className="p-4">{item.feature_type}</td><td className="p-4">{item.formatted_value || item.feature_value}</td><td className="p-4 font-mono text-xs">{item.unit}</td></tr>)}</tbody></TableShell>}
          {!activeQuery.isLoading && !activeQuery.error && tab === 'assets' && <TableShell><thead><tr className="border-b bg-muted/40"><th className="p-4 text-left">Unité</th><th className="p-4 text-left">Code</th><th className="p-4 text-left">Élément</th><th className="p-4 text-left">Catégorie</th></tr></thead><tbody>{assets.data?.results.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-4 font-mono">{item.unit_identifier}</td><td className="p-4 font-mono text-xs">{item.code}</td><td className="p-4"><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.description}</p></td><td className="p-4">{item.asset_type_display}</td></tr>)}</tbody></TableShell>}
          {!activeQuery.isLoading && !activeQuery.error && tab === 'history' && <TableShell><thead><tr className="border-b bg-muted/40"><th className="p-4 text-left">Date</th><th className="p-4 text-left">Unité</th><th className="p-4 text-left">Transition</th><th className="p-4 text-left">Auteur</th></tr></thead><tbody>{history.data?.results.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="p-4">{new Date(item.change_date).toLocaleString('fr-FR')}</td><td className="p-4">{item.unit_name}</td><td className="p-4"><Badge variant="outline">{item.old_status} → {item.new_status}</Badge><p className="mt-1 text-xs text-muted-foreground">{item.notes}</p></td><td className="p-4">{item.changed_by_name || 'Système'}</td></tr>)}</tbody></TableShell>}
        </CardContent>
      </Card>
    </div>
  )
}
