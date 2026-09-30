import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, GraduationCap, AlertCircle } from 'lucide-react'
import { useStudentProfiles } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'

export function StudentProfilesPage() {
  const [search, setSearch] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const { data, isLoading } = useStudentProfiles({ search, school: schoolFilter })

  const profiles = data?.results || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profils étudiants"
        description="Gestion des profils étudiants et suivi de complétion"
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
            >
              <option value="">Toutes les écoles</option>
              <option value="prepavogt">PrepaVogt</option>
              <option value="ucac">UCAC</option>
              <option value="uy1">UY1</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))
        ) : (
          profiles.map((profile) => (
            <Card key={profile.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/admin/users/${profile.user.id}`} className="font-medium hover:underline">
                      {profile.user.full_name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{profile.user.email}</p>
                  </div>
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p><span className="text-muted-foreground">École :</span> {profile.school}</p>
                  <p><span className="text-muted-foreground">Niveau :</span> {profile.level}</p>
                  <p><span className="text-muted-foreground">Tuteur :</span> {profile.tutor_name} ({profile.tutor_phone})</p>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>Complétion</span>
                    <span className={profile.completion_rate < 50 ? 'text-red-500' : profile.completion_rate < 80 ? 'text-yellow-500' : 'text-green-500'}>
                      {profile.completion_rate}%
                    </span>
                  </div>
                  <Progress value={profile.completion_rate} className="h-2" />
                </div>
                {profile.completion_rate < 50 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    Profil incomplet
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
