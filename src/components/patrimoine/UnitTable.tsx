import { Link } from 'react-router-dom'
import { UnitStatusBadge } from './UnitStatusBadge'
import type { Unit } from '@/lib/types/patrimoine.types'

interface UnitTableProps {
  units: Unit[]
}

export function UnitTable({ units }: UnitTableProps) {
  if (units.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">Aucune unité trouvée</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 font-medium">Identifiant</th>
            <th className="pb-2 font-medium">Bâtiment</th>
            <th className="pb-2 font-medium">Type</th>
            <th className="pb-2 font-medium">Surface</th>
            <th className="pb-2 font-medium">Statut</th>
            <th className="pb-2 font-medium">Loyer</th>
            <th className="pb-2 font-medium">Occupant</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="py-2">
                <Link to={`/units/${unit.id}`} className="font-medium hover:underline">
                  {unit.identifier}
                </Link>
              </td>
              <td className="py-2 text-muted-foreground">{unit.building_name}</td>
              <td className="py-2 text-muted-foreground">{unit.unit_type_name}</td>
              <td className="py-2 text-muted-foreground">
                {unit.area_m2 ? `${unit.area_m2} m²` : '-'}
              </td>
              <td className="py-2">
                <UnitStatusBadge status={unit.current_status} />
              </td>
              <td className="py-2 text-muted-foreground">
                {unit.total_monthly_cost ? `${unit.total_monthly_cost} €` : '-'}
              </td>
              <td className="py-2 text-muted-foreground">
                {unit.occupant_name ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
