import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Lightbulb, Search, MessageSquare, Clock } from 'lucide-react'
import { useCreateSuggestion, useSuggestions, useSuggestionStatistics } from '@/hooks/useSuggestions'
import { PageHeader } from '@/components/common/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import type { SuggestionStatus } from '@/lib/types/suggestions.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const STATUS_LABELS: Record<SuggestionStatus, string> = {
  submitted: 'Soumise',
  under_review: 'En examen',
  in_progress: 'En cours',
  implemented: 'Réalisée',
  rejected: 'Non retenue',
}

const STATUS_STYLES: Record<SuggestionStatus, string> = {
  submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  implemented: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const CATEGORY_LABELS: Record<string, string> = {
  common_spaces: 'Espaces communs',
  services_equipment: 'Services & équipements',
  activities_events: 'Activités & événements',
  security_comfort: 'Sécurité & confort',
  communication: 'Communication',
  environment_sustainability: 'Environnement',
  other: 'Autre',
}

const STATUS_FILTERS: Array<{ value: SuggestionStatus | ''; label: string }> = [
  { value: '', label: 'Toutes' },
  { value: 'submitted', label: 'Soumise' },
  { value: 'under_review', label: 'En examen' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'implemented', label: 'Réalisée' },
  { value: 'rejected', label: 'Non retenue' },
]

export function SuggestionsPage() {
  const [statusFilter, setStatusFilter] = useState<SuggestionStatus | ''>('')
  const [search, setSearch] = useState('')

  const params: Record<string, string> = {}
  if (statusFilter) params.status = statusFilter
  if (search) params.search = search

  const { data, isLoading, error } = useSuggestions(params)
  const { data: stats } = useSuggestionStatistics()
  const createSuggestion = useCreateSuggestion()

  async function submitSuggestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const anonymous = data.get('anonyme') === 'on'
    await createSuggestion.mutateAsync({ titre: String(data.get('titre')), description: String(data.get('description')), categorie: String(data.get('categorie')) as 'other', anonyme: anonymous, ...(!anonymous && { nom: String(data.get('nom')), email: String(data.get('email')) }) })
    event.currentTarget.reset()
  }

  return (
    <div>
      <PageHeader
        title="Boîte à suggestions"
        description="Gestion des suggestions des résidents"
      />

      <details className="mb-6 rounded-xl border bg-card p-4">
        <summary className="cursor-pointer font-semibold">Déposer une suggestion</summary>
        <form onSubmit={submitSuggestion} className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="suggestion-title">Titre</Label><Input id="suggestion-title" name="titre" required /></div>
          <div className="space-y-2"><Label htmlFor="suggestion-category">Catégorie</Label><select id="suggestion-category" name="categorie" className="h-11 w-full rounded-lg border bg-background px-3 text-sm">{Object.entries(CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div className="space-y-2 md:col-span-2"><Label htmlFor="suggestion-description">Description</Label><textarea id="suggestion-description" name="description" required className="min-h-28 w-full rounded-lg border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
          <div className="space-y-2"><Label htmlFor="suggestion-name">Nom</Label><Input id="suggestion-name" name="nom" /></div><div className="space-y-2"><Label htmlFor="suggestion-email">E-mail</Label><Input id="suggestion-email" name="email" type="email" /></div>
          <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" name="anonyme" />Déposer anonymement</label>
          <Button className="self-end" disabled={createSuggestion.isPending}><Lightbulb />Envoyer</Button>
        </form>
      </details>

      {stats && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
            <Lightbulb className="h-3 w-3" />
            <span className="font-mono">{stats.total}</span>
          </span>
          {stats.recent_30_days > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              <Clock className="h-3 w-3" />
              {stats.recent_30_days} récentes
            </span>
          )}
          {Object.entries(stats.by_status).map(([status, count]) => (
            <span
              key={status}
              className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[status as SuggestionStatus]}`}
            >
              {STATUS_LABELS[status as SuggestionStatus]} ({count})
            </span>
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value as SuggestionStatus | '')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {f.label}
          </button>
        ))}
        <div className="relative ml-auto flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-md border bg-background pl-8 pr-3 text-xs outline-none focus:border-foreground"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Erreur lors du chargement des suggestions
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : data?.results.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune suggestion trouvée</p>
      ) : (
        <div className="space-y-2">
          {data?.results.map((suggestion) => (
            <Link
              key={suggestion.id}
              to={`/suggestions/${suggestion.id}`}
              className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{suggestion.titre}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {CATEGORY_LABELS[suggestion.categorie] ?? suggestion.categorie}
                    {suggestion.anonyme ? '' : ` - ${suggestion.author_display}`}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[suggestion.status]}`}>
                  {STATUS_LABELS[suggestion.status]}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {suggestion.response_count} réponses
                </span>
                {suggestion.assigned_to_name && (
                  <span>Assigné à : {suggestion.assigned_to_name}</span>
                )}
                <span>{new Date(suggestion.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
