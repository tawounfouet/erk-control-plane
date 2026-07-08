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
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-sm font-medium text-muted-foreground ${col.className ?? ''}`}
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
              className={`border-b last:border-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
              onClick={() => onRowClick?.(item)}
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
                Aucune donnée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
