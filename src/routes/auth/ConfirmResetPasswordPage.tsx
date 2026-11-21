import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { confirmResetPassword } from '@/lib/api/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ConfirmResetPasswordPage() {
  const { uid = '', token = '' } = useParams()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (password !== confirmation) {
      setError('Les deux mots de passe ne correspondent pas.')
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }
    setError('')
    setLoading(true)
    try {
      await confirmResetPassword(uid, token, password)
      setDone(true)
    } catch {
      setError('Ce lien est invalide ou expiré. Demandez un nouveau lien de réinitialisation.')
      requestAnimationFrame(() => errorRef.current?.focus())
    } finally { setLoading(false) }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-5">
      <Card className="w-full max-w-lg">
        <CardHeader><CardTitle>{done ? 'Mot de passe modifié' : 'Choisir un nouveau mot de passe'}</CardTitle><CardDescription>{done ? 'Vos nouvelles informations de connexion sont actives.' : 'Utilisez au moins 8 caractères et évitez un mot de passe déjà employé.'}</CardDescription></CardHeader>
        <CardContent>
          {done ? <Link className={buttonVariants()} to="/login">Se connecter</Link> : (
            <form className="space-y-5" onSubmit={submit}>
              <div className="space-y-2"><Label htmlFor="new-password">Nouveau mot de passe</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} aria-describedby="password-help" required /><p id="password-help" className="text-xs text-muted-foreground">8 caractères minimum.</p></div>
              <div className="space-y-2"><Label htmlFor="confirm-password">Confirmer le mot de passe</Label><Input id="confirm-password" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></div>
              {error && <div ref={errorRef} tabIndex={-1} role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <Button className="w-full" disabled={loading} aria-busy={loading}>{loading ? 'Modification en cours…' : 'Modifier le mot de passe'}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
