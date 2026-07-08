import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, Calendar, FileText } from 'lucide-react'
import { useTenants } from '@/hooks/useTenants'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'

export function TenantsPage() {
  const [search, setSearch] = useState('')
  const params: Record<string, string> = {}
  if (search) params.search = search

  const { data, isLoading, error } = useTenants(params)

  return (
    <div>
      <PageHeader
        title="Locataires"
        description="Gestion des locataires des résidences Eureka"
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un locataire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-xs outline-none focus:border-foreground"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Erreur lors du chargement des locataires
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : data?.results.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun locataire trouvé</p>
      ) : (
        <div className="space-y-2">
          {data?.results.map((tenant) => (
            <Link
              key={tenant.id}
              to={`/tenants/${tenant.id}`}
              className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {tenant.user.first_name} {tenant.user.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{tenant.user.email}</p>
                  </div>
                </div>
                {tenant.is_currently_renting ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Actif
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                    Inactif
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {tenant.current_unit_identifier && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {tenant.current_unit_identifier}
                  </span>
                )}
                {tenant.move_in_date && (
                  <span>
                    Entrée: {new Date(tenant.move_in_date).toLocaleDateString('fr-FR')}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {tenant.verified_documents_count}/{tenant.documents_count} documents
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
