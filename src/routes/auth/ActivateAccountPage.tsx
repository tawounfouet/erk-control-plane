import { useEffect, useState } from 'react'
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { activate } from '@/lib/api/auth'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ActivateAccountPage() {
  const { uid = '', token = '' } = useParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    let active = true
    activate(uid, token)
      .then(() => active && setStatus('success'))
      .catch(() => active && setStatus('error'))
    return () => { active = false }
  }, [token, uid])

  const success = status === 'success'
  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 p-5">
      <Card className="w-full max-w-lg border-border/70 shadow-xl shadow-primary/5">
        <CardHeader className="text-center">
          <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
            {status === 'loading' ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : success ? <CheckCircle2 aria-hidden="true" /> : <CircleAlert aria-hidden="true" />}
          </span>
          <CardTitle>{status === 'loading' ? 'Activation en cours' : success ? 'Compte activé' : 'Lien non valide'}</CardTitle>
          <CardDescription role="status" aria-live="polite">
            {status === 'loading' ? 'Nous vérifions votre lien sécurisé…' : success ? 'Votre compte est prêt. Vous pouvez maintenant vous connecter.' : 'Ce lien a expiré, a déjà été utilisé ou est incorrect.'}
          </CardDescription>
        </CardHeader>
        {status !== 'loading' && (
          <CardContent className="flex justify-center">
            <Link
              className={buttonVariants()}
              to={success ? '/login' : '/resend-activation'}
            >
              {success ? 'Se connecter' : 'Recevoir un nouveau lien'}
            </Link>
          </CardContent>
        )}
      </Card>
    </main>
  )
}
