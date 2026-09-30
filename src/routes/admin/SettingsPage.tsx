import { useConfigurations, useUpdateConfiguration } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Save, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export function SettingsPage() {
  const { data, isLoading } = useConfigurations()
  const updateConfig = useUpdateConfiguration()
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  const configs = data?.results || []

  const categories: string[] = Array.from(new Set(configs.map((c) => c.category)))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuration Système"
        description="Paramètres et variables d'environnement"
      />

      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base capitalize">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {configs
                .filter((c) => c.category === category)
                .map((config) => (
                  <div key={config.id} className="grid grid-cols-[1fr_2fr_auto] items-center gap-4">
                    <div>
                      <p className="text-sm font-medium">{config.key}</p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                    <div className="relative">
                      <Input
                        type={config.is_sensitive && !showSecrets[config.id] ? 'password' : 'text'}
                        value={editValues[config.id] ?? config.value}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, [config.id]: e.target.value }))
                        }
                        className="pr-10"
                      />
                      {config.is_sensitive && (
                        <button
                          className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            setShowSecrets((prev) => ({ ...prev, [config.id]: !prev[config.id] }))
                          }
                        >
                          {showSecrets[config.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        const val = editValues[config.id]
                        if (val !== undefined && val !== config.value) {
                          updateConfig.mutate({ id: config.id, value: val })
                        }
                      }}
                      disabled={updateConfig.isPending}
                    >
                      <Save className="mr-2 h-3 w-3" />
                      Sauver
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
