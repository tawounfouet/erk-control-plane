import { useState } from 'react'
import { CircleDollarSign, FileCheck2, FileX2, Plus } from 'lucide-react'
import { useCreateInvoice, useEquipments, useInvoices, useVoidInvoice } from '@/hooks/usePatrimoineAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

function money(value: string | number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(Number(value))
}

export function InvoicesPage() {
  const [search, setSearch] = useState('')
  const [feedback, setFeedback] = useState('')
  const [voidReasons, setVoidReasons] = useState<Record<string, string>>({})
  const invoices = useInvoices(search ? { search } : undefined)
  const equipment = useEquipments({ status: 'IN_STOCK' })
  const create = useCreateInvoice()
  const voidMutation = useVoidInvoice()

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    setFeedback('')
    try {
      await create.mutateAsync({
        invoice_number: String(form.get('invoice_number')),
        supplier_name: String(form.get('supplier_name')),
        invoice_date: String(form.get('invoice_date')),
        total_amount: String(form.get('unit_purchase_price')),
        lines: [{ equipment: String(form.get('equipment')), unit_purchase_price: String(form.get('unit_purchase_price')) }],
      })
      formElement.reset()
      setFeedback('Facture enregistrée et rapprochée avec l’équipement.')
    } catch { setFeedback('La facture n’a pas pu être enregistrée. Vérifiez les montants et votre droit D8.') }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Factures fournisseur" description="Registre financier cloisonné : accès exclusivement réservé aux profils disposant du micro-droit D8." />
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/[0.04]">
        <CardHeader><CardTitle className="flex items-center gap-2"><CircleDollarSign aria-hidden="true" className="text-primary" />Nouvelle facture</CardTitle></CardHeader>
        <CardContent><form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5" onSubmit={submit}><div className="space-y-2"><Label htmlFor="invoice-number">Numéro</Label><Input id="invoice-number" name="invoice_number" required /></div><div className="space-y-2"><Label htmlFor="invoice-supplier">Fournisseur</Label><Input id="invoice-supplier" name="supplier_name" required /></div><div className="space-y-2"><Label htmlFor="invoice-date">Date</Label><Input id="invoice-date" name="invoice_date" type="date" required /></div><div className="space-y-2"><Label htmlFor="invoice-equipment">Équipement</Label><select id="invoice-equipment" name="equipment" required className="h-10 w-full rounded-lg border bg-background px-3 text-sm"><option value="">Sélectionner</option>{equipment.data?.results.map((item) => <option key={item.id} value={item.id}>{item.technical_reference} · {item.designation}</option>)}</select></div><div className="space-y-2"><Label htmlFor="invoice-price">Prix TTC (FCFA)</Label><Input id="invoice-price" name="unit_purchase_price" type="number" min="0" step="1" required /></div><Button className="md:col-span-2 xl:col-span-5" disabled={create.isPending}><Plus aria-hidden="true" />{create.isPending ? 'Enregistrement…' : 'Enregistrer la facture'}</Button></form></CardContent>
      </Card>
      {feedback && <p role="status" aria-live="polite" className="rounded-lg border bg-muted/40 p-3 text-sm">{feedback}</p>}
      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between"><CardTitle>Pièces comptables</CardTitle><Input className="sm:max-w-xs" aria-label="Rechercher une facture" placeholder="Numéro ou fournisseur…" value={search} onChange={(event) => setSearch(event.target.value)} /></CardHeader>
        <CardContent className="p-0">{invoices.isLoading ? <div className="space-y-2 p-5">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-20" />)}</div> : invoices.error ? <p role="alert" className="p-5 text-destructive">Accès refusé ou registre indisponible.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-sm"><thead><tr className="border-b bg-muted/40"><th className="p-4 text-left">Facture</th><th className="p-4 text-left">Fournisseur</th><th className="p-4 text-left">Date</th><th className="p-4 text-right">Montant</th><th className="p-4 text-left">Équipements</th><th className="p-4 text-left">Statut / action</th></tr></thead><tbody>{invoices.data?.results.map((invoice) => <tr key={invoice.id} className="border-b align-top last:border-0"><td className="p-4"><p className="font-mono font-semibold">{invoice.invoice_number}</p><p className="text-xs text-muted-foreground">Déposée par {invoice.uploaded_by_name || '-'}</p></td><td className="p-4">{invoice.supplier_name}</td><td className="p-4">{new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}</td><td className="p-4 text-right font-semibold tabular-nums">{money(invoice.total_amount)}</td><td className="p-4"><details><summary className="cursor-pointer font-medium">{invoice.equipment_lines.length} ligne(s)</summary><ul className="mt-2 space-y-1 text-xs text-muted-foreground">{invoice.equipment_lines.map((line) => <li key={line.id}>{line.technical_reference} · {money(line.unit_purchase_price)}</li>)}</ul></details></td><td className="p-4"><Badge variant={invoice.status === 'ACTIVE' ? 'default' : 'secondary'}>{invoice.status}</Badge>{invoice.status === 'ACTIVE' ? <div className="mt-2 flex gap-2"><Input className="h-8 min-w-44 text-xs" aria-label={`Motif d'annulation de ${invoice.invoice_number}`} placeholder="Motif obligatoire" value={voidReasons[invoice.id] || ''} onChange={(event) => setVoidReasons((current) => ({ ...current, [invoice.id]: event.target.value }))} /><Button size="icon" variant="ghost" aria-label={`Annuler ${invoice.invoice_number}`} disabled={!voidReasons[invoice.id] || voidMutation.isPending} onClick={() => voidMutation.mutate({ id: invoice.id, reason: voidReasons[invoice.id] }, { onSuccess: () => setFeedback('Facture annulée avec traçabilité.'), onError: () => setFeedback("L'annulation a échoué.") })}><FileX2 aria-hidden="true" /></Button></div> : <p className="mt-2 text-xs text-muted-foreground">{invoice.void_reason}</p>}</td></tr>)}</tbody></table></div>}</CardContent>
      </Card>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><FileCheck2 aria-hidden="true" className="h-4 w-4 text-primary" />Une facture enregistrée est immuable ; toute correction passe par une annulation auditée.</p>
    </div>
  )
}
