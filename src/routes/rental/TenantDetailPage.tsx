import { useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, CheckCircle, AlertCircle, Building2, Upload } from 'lucide-react'
import { useTenant, useTenantDocuments } from '@/hooks/useTenants'
import { useRentalMutations } from '@/hooks/useRentalControl'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: tenant, isLoading, error } = useTenant(id!)
  const { data: docData } = useTenantDocuments({ tenant: id! })
  const mutations = useRentalMutations()
  const [message, setMessage] = useState('')

  async function assignUnit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    await mutations.assignUnit.mutateAsync({ tenantId: id!, unitId: String(data.get('unit_id')), moveInDate: String(data.get('move_in_date') || '') || undefined })
    setMessage('Le logement a été affecté.')
  }

  async function uploadDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const file = data.get('file')
    if (!(file instanceof File) || file.size === 0) return
    await mutations.uploadDocument.mutateAsync({ tenantId: id!, payload: { document_type: String(data.get('document_type')), title: String(data.get('title')), file, expires_at: String(data.get('expires_at') || '') || undefined, notes: String(data.get('notes') || '') || undefined } })
    event.currentTarget.reset()
    setMessage('Le document a été ajouté au dossier.')
  }

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

  if (error || !tenant) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Locataire introuvable
      </div>
    )
  }

  const documents = docData?.results ?? tenant.tenant_documents ?? []

  return (
    <div>
      <Link
        to="/tenants"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux locataires
      </Link>

      <PageHeader
        title={`${tenant.user.first_name} ${tenant.user.last_name}`}
        description={tenant.user.email}
      />

      {message && <p role="status" className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" /> Statut
          </div>
          <p className="mt-1">
            {tenant.is_currently_renting ? (
              <span className="text-green-600 font-medium">Actif</span>
            ) : (
              <span className="text-muted-foreground">Inactif</span>
            )}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" /> Entrée
          </div>
          <p className="mt-1 font-medium">
            {tenant.move_in_date
              ? new Date(tenant.move_in_date).toLocaleDateString('fr-FR')
              : '-'}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" /> Documents
          </div>
          <p className="mt-1 font-medium">
            {tenant.verified_documents_count}/{tenant.documents_count} vérifiés
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" /> Dossier complet
          </div>
          <p className="mt-1 font-medium">
            {tenant.has_complete_documentation ? (
              <span className="text-green-600">Oui</span>
            ) : (
              <span className="text-orange-600">Non</span>
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold">Informations</h3>
          <div className="space-y-3 rounded-lg border bg-card p-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{tenant.user.email}</span>
            </div>
            {tenant.emergency_contact_name && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Contact d'urgence</p>
                <p>{tenant.emergency_contact_name}</p>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-3 w-3" /> {tenant.emergency_contact_phone}
                </p>
              </div>
            )}
            {tenant.rental_unit_info && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Unité</p>
                <p>{tenant.rental_unit_info}</p>
              </div>
            )}
            {tenant.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="whitespace-pre-wrap">{tenant.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Documents</h3>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun document</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="rounded-lg border bg-card p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {doc.document.title || doc.document_type_display}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.document_type_display}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {doc.is_verified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                      )}
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        .{doc.file_extension}
                      </a>
                      {!doc.is_verified && <Button size="sm" variant="outline" aria-label={`Vérifier ${doc.document.title || doc.document_type_display}`} disabled={mutations.verifyDocument.isPending} onClick={() => mutations.verifyDocument.mutate(doc.id)}>Vérifier</Button>}
                    </div>
                  </div>
                  {doc.expires_at && (
                    <p className={`mt-1 text-xs ${doc.is_expired ? 'text-red-600' : 'text-muted-foreground'}`}>
                      Expire le {new Date(doc.expires_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-8" aria-labelledby="rental-actions-title">
        <h2 id="rental-actions-title" className="mb-3 text-lg font-semibold">Actions de gestion</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {tenant.current_unit ? (
            <div className="rounded-xl border bg-card p-4">
              <div className="mb-4 flex items-center gap-3"><Building2 className="h-5 w-5 text-primary" /><div><h3 className="font-semibold">Libérer le logement</h3><p className="text-sm text-muted-foreground">{tenant.rental_unit_info}</p></div></div>
              <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); await mutations.releaseUnit.mutateAsync({ tenantId: id!, moveOutDate: String(data.get('move_out_date') || '') || undefined }); setMessage('Le logement a été libéré.') }}>
                <div className="flex-1 space-y-2"><Label htmlFor="move-out-date">Date de sortie</Label><Input id="move-out-date" name="move_out_date" type="date" /></div>
                <Button variant="outline" disabled={mutations.releaseUnit.isPending}>Libérer</Button>
              </form>
            </div>
          ) : (
            <form className="space-y-4 rounded-xl border bg-card p-4" onSubmit={assignUnit}>
              <div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-primary" /><div><h3 className="font-semibold">Affecter un logement</h3><p className="text-sm text-muted-foreground">Saisissez l’identifiant d’une unité disponible.</p></div></div>
              <div className="space-y-2"><Label htmlFor="unit-id">Identifiant de l’unité</Label><Input id="unit-id" name="unit_id" required /></div>
              <div className="space-y-2"><Label htmlFor="move-in-date">Date d’entrée</Label><Input id="move-in-date" name="move_in_date" type="date" /></div>
              <Button disabled={mutations.assignUnit.isPending}>Affecter</Button>
            </form>
          )}
          <form className="space-y-4 rounded-xl border bg-card p-4" onSubmit={uploadDocument}>
            <div className="flex items-center gap-3"><Upload className="h-5 w-5 text-primary" /><div><h3 className="font-semibold">Ajouter un document</h3><p className="text-sm text-muted-foreground">PDF, image ou document bureautique, 10 Mo maximum.</p></div></div>
            <div className="space-y-2"><Label htmlFor="document-title">Titre</Label><Input id="document-title" name="title" required /></div>
            <div className="grid gap-3 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="document-type">Type</Label><select id="document-type" name="document_type" className="h-11 w-full rounded-lg border bg-background px-3 text-sm"><option value="ID_CARD">Carte d’identité</option><option value="PASSPORT">Passeport</option><option value="INCOME_PROOF">Justificatif de revenus</option><option value="EMPLOYMENT_CONTRACT">Contrat de travail</option><option value="BANK_RIB">RIB</option><option value="INSURANCE">Assurance habitation</option><option value="GUARANTOR_INFO">Informations garant</option><option value="LEASE_CONTRACT">Contrat de bail</option><option value="INVENTORY">État des lieux</option><option value="OTHER">Autre</option></select></div><div className="space-y-2"><Label htmlFor="expires-at">Date d’expiration</Label><Input id="expires-at" name="expires_at" type="date" /></div></div>
            <div className="space-y-2"><Label htmlFor="document-file">Fichier</Label><Input id="document-file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" required /></div>
            <Button disabled={mutations.uploadDocument.isPending}><Upload />Téléverser</Button>
          </form>
        </div>
      </section>
    </div>
  )
}
