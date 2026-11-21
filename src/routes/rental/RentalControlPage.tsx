import { useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { Activity, ClipboardCheck, Droplets, FileSignature, Gauge, LockKeyhole, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useAcceptanceBatches, useInspections, useMeterReadings, useOccupations, useRentalActions, useRentalMutations } from '@/hooks/useRentalControl'
import type { InspectionType, MeterType, Occupation, ReadingType } from '@/lib/types/rental.types'

type Tab = 'actions' | 'meters' | 'inspections' | 'acceptances'
const tabs: Array<{ id: Tab; label: string; icon: typeof Activity }> = [
  { id: 'actions', label: 'Journal', icon: Activity },
  { id: 'meters', label: 'Compteurs', icon: Gauge },
  { id: 'inspections', label: 'États des lieux', icon: ClipboardCheck },
  { id: 'acceptances', label: 'Acceptations', icon: FileSignature },
]

const date = (value: string) => new Date(value).toLocaleDateString('fr-FR')

function Empty({ children }: { children: string }) {
  return <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">{children}</p>
}

export function RentalControlPage() {
  const [tab, setTab] = useState<Tab>('actions')
  const [message, setMessage] = useState('')
  const actions = useRentalActions()
  const occupations = useOccupations({ current: 'true' })
  const meters = useMeterReadings()
  const inspections = useInspections()
  const acceptances = useAcceptanceBatches()
  const mutations = useRentalMutations()

  async function submitMeter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    await mutations.createMeter.mutateAsync({
      occupation: String(data.get('occupation')),
      meter_type: String(data.get('meter_type')) as MeterType,
      reading_type: String(data.get('reading_type')) as ReadingType,
      value: String(data.get('value')),
      reading_date: String(data.get('reading_date')),
    })
    event.currentTarget.reset()
    setMessage('Le relevé a été enregistré.')
  }

  async function submitInspection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    await mutations.createInspection.mutateAsync({
      occupation: String(data.get('occupation')),
      inspection_type: String(data.get('inspection_type')) as InspectionType,
      inspection_date: String(data.get('inspection_date')),
      general_observations: String(data.get('general_observations') ?? ''),
      lines: data.get('source_id') ? [{
        condition: String(data.get('condition')),
        ...(data.get('source_type') === 'room_asset' ? { room_asset: String(data.get('source_id')) } : { equipment_assignment: String(data.get('source_id')) }),
        imputed_amount: String(data.get('imputed_amount') || '0'),
      }] : [],
    })
    event.currentTarget.reset()
    setMessage("L’état des lieux a été créé. Ajoutez ses lignes depuis sa fiche métier.")
  }

  async function submitAcceptance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    await mutations.createAcceptance.mutateAsync({ occupation: String(data.get('occupation')), batchType: String(data.get('batch_type')) as 'INITIAL' | 'INCREMENTAL' })
    event.currentTarget.reset()
    setMessage("Le lot d’acceptation a été scellé.")
  }

  async function submitSignature(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    await mutations.signAcceptance.mutateAsync({ id, payload: { resident: String(data.get('resident')), signature_svg: String(data.get('signature_svg')), user_agent: navigator.userAgent } })
    setMessage('La signature du résident a été scellée.')
  }

  const loading = actions.isLoading || meters.isLoading || inspections.isLoading || acceptances.isLoading

  return (
    <div className="space-y-6">
      <PageHeader title="Registre locatif" description="Traçabilité des occupations, index, états des lieux et acceptations contradictoires" />
      <div className="flex gap-2 overflow-x-auto border-b" role="tablist" aria-label="Sections du registre locatif">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} aria-controls={`rental-panel-${id}`} id={`rental-tab-${id}`} onClick={() => { setTab(id); setMessage('') }} className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${tab === id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />{label}
          </button>
        ))}
      </div>
      {message && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}
      {loading && <Skeleton className="h-40 w-full" />}

      {tab === 'actions' && <section role="tabpanel" id="rental-panel-actions" aria-labelledby="rental-tab-actions" className="space-y-3">
        <h2 className="text-lg font-semibold">Journal immuable</h2>
        {(actions.data?.results ?? []).length === 0 ? <Empty>Aucune action locative enregistrée.</Empty> : actions.data?.results.map((item) => (
          <article key={item.id} className="grid gap-2 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_auto]">
            <div><p className="font-medium">{item.title}</p><p className="text-sm text-muted-foreground">{item.description || item.action_type_display}</p></div>
            <div className="text-sm sm:text-right"><p>{item.tenant_name || item.unit_identifier || 'Système'}</p><time className="text-muted-foreground" dateTime={item.created_at}>{date(item.created_at)}</time></div>
          </article>
        ))}
      </section>}

      {tab === 'meters' && <section role="tabpanel" id="rental-panel-meters" aria-labelledby="rental-tab-meters" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-3"><h2 className="text-lg font-semibold">Derniers index</h2>{(meters.data?.results ?? []).length === 0 ? <Empty>Aucun relevé de compteur.</Empty> : meters.data?.results.map((item) => <article key={item.id} className="flex items-center justify-between rounded-xl border bg-card p-4"><div className="flex items-center gap-3">{item.meter_type === 'WATER' ? <Droplets className="h-5 w-5 text-blue-600" /> : <Gauge className="h-5 w-5 text-amber-600" />}<div><p className="font-medium">{item.unit_identifier} · {item.meter_type_display}</p><p className="text-sm text-muted-foreground">{item.reading_type_display} · {date(item.reading_date)}</p></div></div><p className="font-mono font-semibold">{item.value}</p></article>)}</div>
        <form onSubmit={submitMeter} className="h-fit space-y-4 rounded-xl border bg-card p-4"><h2 className="font-semibold">Nouveau relevé</h2><OccupationSelect id="meter-occupation" occupations={occupations.data?.results ?? []} /><Select id="meter-type" label="Compteur" name="meter_type" options={[['ELECTRICITY','Électricité'],['WATER','Eau']]} /><Select id="reading-type" label="Type de relevé" name="reading_type" options={[['ENTRY','Entrée'],['INTERMEDIATE','Intermédiaire'],['EXIT','Sortie']]} /><Field id="meter-value" label="Index" name="value" type="number" step="0.01" min="0" required /><Field id="meter-date" label="Date" name="reading_date" type="date" required /><Button className="w-full" disabled={mutations.createMeter.isPending}><Plus />Enregistrer</Button></form>
      </section>}

      {tab === 'inspections' && <section role="tabpanel" id="rental-panel-inspections" aria-labelledby="rental-tab-inspections" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-3"><h2 className="text-lg font-semibold">Sessions d’état des lieux</h2>{(inspections.data?.results ?? []).length === 0 ? <Empty>Aucun état des lieux.</Empty> : inspections.data?.results.map((item) => <article key={item.id} className="rounded-xl border bg-card p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium">{item.unit_identifier} · {item.inspection_type_display}</p><p className="text-sm text-muted-foreground">{date(item.inspection_date)} · {item.lines.length} ligne(s)</p></div>{item.closed_at ? <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><LockKeyhole className="h-3 w-3" />Clôturé</span> : item.inspection_type === 'EXIT' && <Button size="sm" variant="outline" onClick={() => mutations.closeInspection.mutate(item.id)}>Clôturer</Button>}</div>{item.general_observations && <p className="mt-3 text-sm">{item.general_observations}</p>}</article>)}</div>
        <form onSubmit={submitInspection} className="h-fit space-y-4 rounded-xl border bg-card p-4"><h2 className="font-semibold">Nouvelle session</h2><OccupationSelect id="inspection-occupation" occupations={occupations.data?.results ?? []} /><Select id="inspection-type" label="Type" name="inspection_type" options={[['ENTRY','Entrée'],['INTERMEDIATE','Intermédiaire'],['EXIT','Sortie']]} /><Field id="inspection-date" label="Date" name="inspection_date" type="date" required /><div className="border-t pt-4"><p className="mb-3 text-sm font-medium">Première ligne (facultative)</p><div className="space-y-3"><Select id="source-type" label="Source" name="source_type" options={[['equipment','Équipement affecté'],['room_asset','Élément fixe']]} /><Field id="source-id" label="Identifiant de la source" name="source_id" /><Select id="condition" label="État constaté" name="condition" options={[['N','Neuf'],['G','Bon'],['M','Moyen'],['B','Mauvais']]} /><Field id="imputed-amount" label="Montant imputé" name="imputed_amount" type="number" min="0" step="0.01" /></div></div><div className="space-y-2"><Label htmlFor="inspection-notes">Observations générales</Label><textarea id="inspection-notes" name="general_observations" className="min-h-24 w-full rounded-lg border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div><Button className="w-full" disabled={mutations.createInspection.isPending}><Plus />Créer la session</Button></form>
      </section>}

      {tab === 'acceptances' && <section role="tabpanel" id="rental-panel-acceptances" aria-labelledby="rental-tab-acceptances" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-3"><h2 className="text-lg font-semibold">Lots scellés</h2>{(acceptances.data?.results ?? []).length === 0 ? <Empty>Aucun lot d’acceptation.</Empty> : acceptances.data?.results.map((item) => <article key={item.id} className="rounded-xl border bg-card p-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-medium">{item.unit_identifier} · {item.batch_type_display}</p><p className="text-sm text-muted-foreground">{item.items.length} équipement(s) · {item.signatures.length} signature(s)</p></div><span className={`text-xs font-medium ${item.is_fully_accepted ? 'text-emerald-700' : 'text-amber-700'}`}>{item.is_fully_accepted ? 'Accepté par tous' : 'Signatures en attente'}</span></div><p className="mt-3 truncate font-mono text-xs text-muted-foreground" title={item.content_hash}>SHA-256 · {item.content_hash}</p>{!item.is_fully_accepted && <details className="mt-4 border-t pt-3"><summary className="cursor-pointer text-sm font-medium">Ajouter une signature</summary><form className="mt-3 grid gap-3" onSubmit={(event) => submitSignature(event, item.id)}><Field id={`resident-${item.id}`} label="Identifiant du résident d’occupation" name="resident" required /><div className="space-y-2"><Label htmlFor={`signature-${item.id}`}>Signature SVG</Label><textarea id={`signature-${item.id}`} name="signature_svg" required className="min-h-24 w-full rounded-lg border bg-background p-3 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div><Button size="sm" className="justify-self-start" disabled={mutations.signAcceptance.isPending}><FileSignature />Sceller la signature</Button></form></details>}</article>)}</div>
        <form onSubmit={submitAcceptance} className="h-fit space-y-4 rounded-xl border bg-card p-4"><h2 className="font-semibold">Sceller un lot</h2><p className="text-sm text-muted-foreground">Le contenu créé est immuable et devra être signé individuellement par les résidents.</p><OccupationSelect id="acceptance-occupation" occupations={occupations.data?.results ?? []} /><Select id="batch-type" label="Type de lot" name="batch_type" options={[['INITIAL','Initial'],['INCREMENTAL','Incrémental']]} /><Button className="w-full" disabled={mutations.createAcceptance.isPending}><LockKeyhole />Créer et sceller</Button></form>
      </section>}
    </div>
  )
}

function Field({ id, label, ...props }: { id: string; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} {...props} /></div>
}

function Select({ id, label, name, options }: { id: string; label: string; name: string; options: string[][] }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><select id={id} name={name} className="h-11 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></div>
}

function OccupationSelect({ id, occupations }: { id: string; occupations: Occupation[] }) {
  return <div className="space-y-2"><Label htmlFor={id}>Occupation</Label><select id={id} name="occupation" required className="h-11 w-full rounded-lg border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="">Sélectionner une occupation</option>{occupations.map((item) => <option key={item.id} value={item.id}>{item.unit_identifier} · {item.residents.map((resident) => resident.tenant_name).join(', ') || 'Sans résident'}</option>)}</select></div>
}
