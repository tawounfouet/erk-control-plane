import type { InventoryItem } from '@/lib/types/patrimoine.types'

interface InventoryTableProps {
  items: InventoryItem[]
}

export function InventoryTable({ items }: InventoryTableProps) {
  if (items.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">Aucun élément trouvé</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 font-medium">Nom</th>
            <th className="pb-2 font-medium">Catégorie</th>
            <th className="pb-2 font-medium">Marque</th>
            <th className="pb-2 font-medium">Référence</th>
            <th className="pb-2 font-medium">Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="py-2 font-medium">{item.name}</td>
              <td className="py-2 text-muted-foreground">{item.category_display}</td>
              <td className="py-2 text-muted-foreground">{item.brand || '-'}</td>
              <td className="py-2 text-xs text-muted-foreground">{item.reference}</td>
              <td className="py-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.stock_quantity > 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {item.stock_quantity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
