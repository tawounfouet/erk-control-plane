import { Link } from 'react-router-dom'
import { Building as BuildingIcon, Layers, Hash } from 'lucide-react'
import type { Building } from '@/lib/types/patrimoine.types'

interface BuildingCardProps {
  building: Building
}

export function BuildingCard({ building }: BuildingCardProps) {
  return (
    <Link
      to={`/buildings/${building.id}`}
      className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <div className="flex items-start gap-3">
        {building.main_image_thumbnail_url ? (
          <img
            src={building.main_image_thumbnail_url}
            alt={building.name}
            className="h-14 w-14 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-muted">
            <BuildingIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{building.name}</h3>
          <p className="text-xs text-muted-foreground">{building.code}</p>
          {building.address && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{building.address}</p>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Layers className="h-3 w-3" />
          {building.floors_count_actual} étages
        </span>
        <span className="flex items-center gap-1">
          <Hash className="h-3 w-3" />
          {building.units_count} unités
        </span>
        {building.manager_name && (
          <span className="truncate">{building.manager_name}</span>
        )}
      </div>
    </Link>
  )
}
