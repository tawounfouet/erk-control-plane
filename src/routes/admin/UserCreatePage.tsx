import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useCreateUser } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function UserCreatePage() {
  const navigate = useNavigate()
  const create = useCreateUser()
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    is_staff: false,
    is_superuser: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    create.mutate(form, {
      onSuccess: () => navigate('/admin/users'),
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Nouvel utilisateur" description="Créer un compte utilisateur" />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="flex gap-4 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_staff}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_staff: e.target.checked }))}
                />
                Staff
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_superuser}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_superuser: e.target.checked }))}
                />
                Superuser
              </label>
            </div>
            <Button type="submit" disabled={create.isPending}>
              <UserPlus className="mr-2 h-4 w-4" />
              {create.isPending ? 'Création...' : 'Créer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
