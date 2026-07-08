import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useTenant, useTenantDocuments } from '@/hooks/useTenants'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: tenant, isLoading, error } = useTenant(id!)
  const { data: docData } = useTenantDocuments({ tenant: id! })

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
    </div>
  )
}
