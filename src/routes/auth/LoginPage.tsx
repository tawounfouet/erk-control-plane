import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Building2, CheckCircle2, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { login, getMe } from '@/lib/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  const { isAuthenticated, setUser } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      setUser(await getMe())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(22rem,0.8fr)_minmax(32rem,1.2fr)]">
      <section className="relative hidden overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex lg:flex-col" aria-label="Présentation d’Eurekanet">
        <div aria-hidden="true" className="absolute -right-40 top-1/4 h-[34rem] w-[34rem] rounded-full border-[7rem] border-sidebar-primary/10" />
        <div aria-hidden="true" className="absolute -bottom-36 -left-36 h-96 w-96 rounded-full bg-sidebar-accent/50 blur-3xl" />
        <Link to="/login" className="relative flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><Building2 aria-hidden="true" className="h-5 w-5" /></span>
          <span><span className="font-display block text-2xl font-semibold text-white">Eurekanet</span><span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/60">Gestion résidentielle</span></span>
        </Link>
        <div className="relative my-auto max-w-lg">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-sidebar-primary">Votre résidence, simplement</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.08] text-white xl:text-6xl">Pilotez chaque détail, sans perdre la vue d’ensemble.</h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-sidebar-foreground/75">Patrimoine, locataires et interventions réunis dans un espace de travail clair et sécurisé.</p>
          <ul className="mt-10 space-y-4 text-sm" aria-label="Fonctionnalités principales">
            {['Suivi du parc en temps réel', 'Opérations centralisées', 'Données accessibles et sécurisées'].map((item) => (
              <li key={item} className="flex items-center gap-3"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-sidebar-primary" />{item}</li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-sidebar-foreground/45">© {new Date().getFullYear()} Eureka Résidences</p>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Building2 aria-hidden="true" className="h-5 w-5" /></span>
            <span className="font-display text-2xl font-semibold">Eurekanet</span>
          </div>
          <div className="mb-8">
            <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><LockKeyhole aria-hidden="true" className="h-5 w-5" /></span>
            <h1 className="font-display text-4xl font-semibold tracking-tight">Ravi de vous revoir</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Connectez-vous pour accéder à votre espace de gestion.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" name="email" type="email" inputMode="email" autoComplete="username" placeholder="prenom@eureka-residences.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Mot de passe</Label>
                <Link to="/reset-password" className="rounded text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Mot de passe oublié ?</Link>
              </div>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="pr-12" placeholder="Votre mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} required />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                  {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <div role="alert" aria-live="assertive" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <Button type="submit" size="lg" className="w-full" disabled={loading} aria-busy={loading}>
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </Button>
          </form>
          <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">Accès réservé aux équipes autorisées d’Eureka Résidences.</p>
        </div>
      </section>
    </main>
  )
}
