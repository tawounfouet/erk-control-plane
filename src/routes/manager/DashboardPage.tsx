import { Link } from 'react-router-dom'
import { useDashboardStats, useRevenue } from '@/hooks/useManager'
import { useAuthStore } from '@/stores/auth-store'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ArrowRight, Building2, CheckCircle2, ClipboardCheck, DoorOpen, Euro,
  MessageSquare, Plus, TrendingUp, Users, Wrench,
  type LucideIcon,
} from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  loading?: boolean
  tone?: 'default' | 'success' | 'warning'
}

function StatCard({ label, value, detail, icon: Icon, loading, tone = 'default' }: StatCardProps) {
  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {loading ? (
              <Skeleton className="mt-2 h-9 w-20" aria-label={`Chargement de ${label}`} />
            ) : (
              <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">{value}</p>
            )}
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{detail}</p>
          </div>
          <span className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:-translate-y-0.5',
            tone === 'success' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
            tone === 'warning' && 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
            tone === 'default' && 'bg-accent text-accent-foreground',
          )}>
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

const quickActions = [
  { label: 'Voir les logements', description: 'Disponibilités et occupation', path: '/units', icon: DoorOpen },
  { label: 'Suivre la maintenance', description: 'Prioriser les interventions', path: '/operations/kanban', icon: Wrench },
  { label: 'États des lieux', description: 'Consulter les rapports', path: '/admin/condition-reports', icon: ClipboardCheck },
  { label: 'Gérer les locataires', description: 'Dossiers et documents', path: '/tenants', icon: Users },
]

export function DashboardPage() {
  const { user } = useAuthStore()
  const { data: stats, isLoading, isError } = useDashboardStats()
  const { data: revenue } = useRevenue()
  const availableRate = stats?.total_units ? Math.round((stats.available_units / stats.total_units) * 100) : 0
  const maxRevenue = Math.max(...(revenue?.monthly_revenue.filter((item) => item.revenue !== null).map((item) => item.revenue!) ?? [1]), 1)

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description={`Bonjour${user?.first_name ? `, ${user.first_name}` : ''}. Voici l’essentiel à traiter aujourd’hui dans vos résidences.`}
        actions={(
          <Link to="/operations" className={buttonVariants({ variant: 'default' })}>
            <Plus aria-hidden="true" />
            Nouvelle intervention
          </Link>
        )}
      />

      {isError && (
        <div role="alert" className="mb-6 rounded-xl border border-destructive/35 bg-destructive/10 p-4 text-sm text-destructive">
          Les indicateurs n’ont pas pu être actualisés. Les raccourcis restent disponibles.
        </div>
      )}

      <section aria-labelledby="overview-heading" className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
        <Card className="surface-glow relative overflow-hidden border-primary/15">
          <div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[3rem] border-primary/[0.04]" />
          <CardContent className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Vue d'ensemble</p>
              <h2 id="overview-heading" className="font-display max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                {stats ? `${stats.occupied_units} logements occupés sur ${stats.total_units}` : 'Votre patrimoine, en un coup d’œil'}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {stats
                  ? `${stats.available_units} logements sont disponibles et ${stats.maintenance_units} actuellement en maintenance.`
                  : 'Suivez l’occupation, les demandes et les opérations prioritaires depuis un espace unique.'}
              </p>
            </div>
            <div className="min-w-44 rounded-2xl border border-primary/15 bg-background/75 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <TrendingUp aria-hidden="true" className="h-4 w-4" />
                Taux d'occupation
              </div>
              {isLoading ? <Skeleton className="mt-3 h-10 w-24" /> : <p className="mt-2 text-4xl font-bold tabular-nums">{stats?.occupancy_rate ?? '—'}<span className="text-xl"> %</span></p>}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.min(stats?.occupancy_rate ?? 0, 100)}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-50/70 dark:bg-amber-950/15">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
              <CardTitle className="text-base">À traiter</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/operations" className="flex items-center justify-between gap-3 rounded-xl border bg-background/70 p-3 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span><strong className="block text-2xl tabular-nums">{stats?.maintenance_open ?? '—'}</strong><span className="text-xs text-muted-foreground">interventions ouvertes</span></span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link to="/suggestions" className="flex items-center justify-between gap-3 rounded-xl border bg-background/70 p-3 transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span><strong className="block text-2xl tabular-nums">{stats?.unread_suggestions ?? '—'}</strong><span className="text-xs text-muted-foreground">suggestions non lues</span></span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="key-metrics-heading" className="mt-6">
        <h2 id="key-metrics-heading" className="sr-only">Indicateurs clés</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Logements" value={stats?.total_units?.toString() ?? '—'} detail="Ensemble du parc géré" icon={Building2} loading={isLoading} />
          <StatCard label="Locataires actifs" value={stats?.active_tenants?.toString() ?? '—'} detail="Dossiers en cours" icon={Users} loading={isLoading} tone="success" />
          <StatCard label="Maintenance ouverte" value={stats?.maintenance_open?.toString() ?? '—'} detail={`${stats?.maintenance_in_progress ?? '—'} intervention(s) en cours`} icon={Wrench} loading={isLoading} tone="warning" />
          <StatCard label="Suggestions non lues" value={stats?.unread_suggestions?.toString() ?? '—'} detail="Messages à qualifier" icon={MessageSquare} loading={isLoading} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Revenus {revenue?.year ?? ''}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Évolution mensuelle des loyers encaissés</p>
            </div>
            {revenue && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Cumul annuel</span>}
          </CardHeader>
          <CardContent>
            {revenue ? (
              <>
                <div className="mb-7 flex flex-wrap gap-x-10 gap-y-4">
                  <div><p className="text-xs font-medium text-muted-foreground">Revenu mensuel</p><p className="mt-1 flex items-center text-2xl font-bold tabular-nums"><Euro aria-hidden="true" className="mr-1 h-5 w-5 text-primary" />{revenue.current_mrr.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}</p></div>
                  <div><p className="text-xs font-medium text-muted-foreground">Cumul annuel</p><p className="mt-1 text-2xl font-bold tabular-nums">{revenue.total_revenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</p></div>
                </div>
                <div className="flex h-36 items-end gap-1.5" role="img" aria-label={`Graphique des revenus mensuels pour ${revenue.year}`}>
                  {revenue.monthly_revenue.map((month) => {
                    const height = month.revenue !== null ? Math.round((month.revenue / maxRevenue) * 100) : 4
                    const label = new Date(revenue.year, month.month - 1).toLocaleDateString('fr-FR', { month: 'short' })
                    return (
                      <div key={month.month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <span className="sr-only">{label} : {month.revenue?.toLocaleString('fr-FR') ?? 'non renseigné'} €</span>
                        <div aria-hidden="true" className="w-full max-w-10 rounded-t-md bg-primary/75 transition-colors group-hover:bg-primary" style={{ height: `${Math.max(height, 4)}%` }} />
                        <span aria-hidden="true" className="text-[0.65rem] capitalize text-muted-foreground">{label.replace('.', '')}</span>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-4" aria-label="Chargement des revenus"><Skeleton className="h-8 w-48" /><Skeleton className="h-36 w-full" /></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accès rapides</CardTitle>
            <p className="text-sm text-muted-foreground">Vos tâches les plus fréquentes</p>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path} className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><action.icon aria-hidden="true" className="h-4.5 w-4.5" /></span>
                <span className="min-w-0"><strong className="block text-sm">{action.label}</strong><span className="block truncate text-xs text-muted-foreground">{action.description}</span></span>
                <ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <section aria-label="État du parc" className="mt-6 flex flex-col gap-3 rounded-2xl border bg-card/70 p-5 sm:flex-row sm:items-center">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 aria-hidden="true" className="h-5 w-5" /></span>
        <div><h2 className="text-sm font-bold">Disponibilité du parc</h2><p className="text-sm text-muted-foreground">{stats ? `${stats.available_units} logement(s) disponible(s), soit ${availableRate} % du parc.` : 'Calcul de la disponibilité en cours.'}</p></div>
        <Link to="/units" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'sm:ml-auto')}>Consulter les logements <ArrowRight aria-hidden="true" /></Link>
      </section>
    </div>
  )
}
