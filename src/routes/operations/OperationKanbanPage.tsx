import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useOperations } from '@/hooks/useOperations'
import { KanbanBoard } from '@/components/operations/KanbanBoard'
import { Skeleton } from '@/components/ui/skeleton'

export function OperationKanbanPage() {
  const [search, setSearch] = useState('')

  const params: Record<string, string> = {}
  if (search) params.search = search

  const { data, isLoading, error } = useOperations(params)

  return (
    <div>
      <Link
        to="/operations"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Vue liste
      </Link>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 rounded-md border bg-background px-3 text-xs outline-none focus:border-foreground max-w-xs"
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Erreur lors du chargement
        </div>
      )}

      {isLoading ? (
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-[250px] rounded-lg" />
          ))}
        </div>
      ) : (
        <KanbanBoard operations={data?.results ?? []} />
      )}
    </div>
  )
}
