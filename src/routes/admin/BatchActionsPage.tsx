import { useState } from 'react'
import { Zap, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const BATCH_ACTIONS = [
  {
    id: 'assign-units',
    label: 'Assigner des unités en masse',
    description: 'Assigner plusieurs locataires à des unités via CSV',
    danger: false,
  },
  {
    id: 'update-status',
    label: 'Mettre à jour les statuts',
    description: 'Changer le statut de plusieurs unités ou opérations',
    danger: false,
  },
  {
    id: 'archive-operations',
    label: 'Archiver les opérations terminées',
    description: 'Archiver toutes les opérations en statut "Terminée" de plus de 90 jours',
    danger: true,
  },
]

export function BatchActionsPage() {
  const [confirming, setConfirming] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Actions groupées"
        description="Opérations en masse sur les données"
      />

      <div className="space-y-4">
        {BATCH_ACTIONS.map((action) => (
          <Card key={action.id} className={action.danger ? 'border-red-200' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                {confirming === action.id ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>
                      Annuler
                    </Button>
                    <Button size="sm" variant={action.danger ? 'destructive' : 'default'}>
                      <Zap className="mr-2 h-3 w-3" />
                      Confirmer
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant={action.danger ? 'outline' : 'default'}
                    onClick={() => setConfirming(action.id)}
                  >
                    {action.danger && <AlertTriangle className="mr-2 h-3 w-3" />}
                    Exécuter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
