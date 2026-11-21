import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { resendActivation } from '@/lib/api/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ResendActivationPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resendActivation(email)
      setSent(true)
    } catch {
      setError("Le lien n'a pas pu être envoyé. Réessayez dans quelques instants.")
      requestAnimationFrame(() => errorRef.current?.focus())
    } finally { setLoading(false) }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-5">
      <Card className="w-full max-w-lg">
        <CardHeader><CardTitle>Renvoyer le lien d'activation</CardTitle><CardDescription>Si un compte en attente correspond à cette adresse, un nouveau lien sera envoyé.</CardDescription></CardHeader>
        <CardContent>
          {sent ? <div className="space-y-5" role="status"><p className="text-sm leading-relaxed">Vérifiez votre boîte de réception et vos courriers indésirables.</p><Link className={buttonVariants({ variant: 'outline' })} to="/login">Retour à la connexion</Link></div> : (
            <form className="space-y-5" onSubmit={submit}>
              <div className="space-y-2"><Label htmlFor="activation-email">Adresse e-mail</Label><Input id="activation-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
              {error && <div ref={errorRef} tabIndex={-1} role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <Button className="w-full" disabled={loading} aria-busy={loading}>{loading ? 'Envoi en cours…' : 'Envoyer le lien'}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
