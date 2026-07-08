import { useTenantDocuments, useExpiredDocuments } from '@/hooks/useTenants'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle, AlertCircle, FileText } from 'lucide-react'

export function DocumentsPage() {
  const { data: allDocs, isLoading: loadingAll, error: errorAll } = useTenantDocuments()
  const { data: expiredDocs, isLoading: loadingExpired } = useExpiredDocuments()

  const activeDocs = allDocs?.results ?? []
  const expired = expiredDocs ?? []

  return (
    <div>
      <PageHeader
        title="Gestion des documents"
        description="Documents des locataires (expirés, en cours)"
      />

      {expired.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-red-600">
            <AlertCircle className="h-4 w-4" />
            Documents expirés ({expired.length})
          </h3>
          {loadingExpired ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="space-y-2">
              {expired.slice(0, 10).map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg border border-red-200 bg-card p-3 text-sm dark:border-red-900"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{doc.document.title || doc.document_type_display}</p>
                      <p className="text-xs text-muted-foreground">{doc.document_type_display}</p>
                    </div>
                    <div className="text-right text-xs text-red-600">
                      Expiré le {new Date(doc.expires_at!).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="mb-2 font-semibold">Tous les documents</h3>
        {errorAll && (
          <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            Erreur lors du chargement des documents
          </div>
        )}
        {loadingAll ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : activeDocs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun document trouvé</p>
        ) : (
          <div className="space-y-2">
            {activeDocs.map((doc) => (
              <div
                key={doc.id}
                className="rounded-lg border bg-card p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {doc.document.title || doc.document_type_display}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.document_type_display}
                        {doc.tenant && ` — Locataire #${doc.tenant}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {doc.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3 w-3" /> Vérifié
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                        <AlertCircle className="h-3 w-3" /> En attente
                      </span>
                    )}
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {doc.file_extension}
                    </a>
                  </div>
                </div>
                {doc.expires_at && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Expire le {new Date(doc.expires_at).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
