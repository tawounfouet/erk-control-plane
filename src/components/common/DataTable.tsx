interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  caption?: string
  emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  caption = 'Liste des résultats',
  emptyMessage = 'Aucune donnée disponible',
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card/70">
      <table className="w-full min-w-[40rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={item.id as string ?? i}
              className={`border-b last:border-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-muted/50 focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring' : ''}`}
              onClick={() => onRowClick?.(item)}
              onKeyDown={(event) => {
                if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  onRowClick(item)
                }
              }}
              tabIndex={onRowClick ? 0 : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-sm ${col.className ?? ''}`}>
                  {col.render ? col.render(item) : String(item[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
