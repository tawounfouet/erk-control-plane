import { useState, useRef } from 'react'
import { Search, ExternalLink, User, Home, Building2, Phone, Lightbulb, Package } from 'lucide-react'
import { useGlobalSearch } from '@/hooks/useManager'
import { PageHeader } from '@/components/common/PageHeader'
import type { SearchResult } from '@/lib/types/manager.types'

const TYPE_ICONS: Record<string, React.ElementType> = {
  user: User,
  unit: Home,
  building: Building2,
  tenant: User,
  contact: Phone,
  suggestion: Lightbulb,
  inventory: Package,
}

const TYPE_LABELS: Record<string, string> = {
  user: 'Utilisateur',
  unit: 'Logement',
  building: 'Bâtiment',
  tenant: 'Locataire',
  contact: 'Contact',
  suggestion: 'Suggestion',
  inventory: 'Inventaire',
}

function ResultCard({ result }: { result: SearchResult }) {
  const Icon = TYPE_ICONS[result.type] ?? ExternalLink

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{result.label}</p>
            <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {TYPE_LABELS[result.type] ?? result.type}
            </span>
          </div>
          {result.detail && (
            <p className="mt-0.5 text-xs text-muted-foreground">{result.detail}</p>
          )}
        </div>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1" />
      </div>
    </a>
  )
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { data, isLoading } = useGlobalSearch(query)

  return (
    <div>
      <PageHeader
        title="Recherche globale"
        description="Rechercher dans tous les modules"
      />

      <div className="relative mb-6 max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher par nom, email, référence..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none focus:border-foreground"
          autoFocus
        />
      </div>

      {query.length === 1 && (
        <p className="text-sm text-muted-foreground">
          Saisissez au moins 2 caractères pour lancer la recherche.
        </p>
      )}

      {isLoading && (
        <p className="text-sm text-muted-foreground">Recherche en cours...</p>
      )}

      {data && data.count === 0 && (
        <p className="text-sm text-muted-foreground">
          Aucun résultat pour "{query}".
        </p>
      )}

      {data && data.count > 0 && (
        <div>
          <p className="mb-3 text-xs text-muted-foreground">
            {data.count} résultat{data.count > 1 ? 's' : ''} pour "{query}"
          </p>
          <div className="space-y-2">
            {data.results.map((result, i) => (
              <ResultCard key={`${result.type}-${result.id}-${i}`} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
