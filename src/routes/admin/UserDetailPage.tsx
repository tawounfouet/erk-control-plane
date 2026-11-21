import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Ban, BookOpen, Building2, CheckCircle2, CircleUserRound,
  Clock3, FileCheck2, Fingerprint, KeyRound, Languages, MapPin, Phone,
  ShieldCheck, UserRoundCog,
} from 'lucide-react'
import {
  useActivateUser, useResetUserPassword, useTerminateSession, useUser,
  useUserSessions,
} from '@/hooks/useAdmin'
import { useAuthStore } from '@/stores/auth-store'
import type { UserGroup, UserPermission } from '@/lib/types/admin.types'
import { RoleBadge } from '@/components/admin/RoleBadge'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function formatDate(value?: string | null, withTime = false) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    ...(withTime ? { timeStyle: 'short' } : {}),
  }).format(new Date(value))
}

function yesNo(value?: boolean) {
  if (value === undefined) return '—'
  return value ? 'Oui' : 'Non'
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 border-l-2 border-border pl-3">
      <dt className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-foreground">{value ?? '—'}</dd>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children, className = '' }: {
  title: string
  icon: typeof CircleUserRound
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={`overflow-hidden border-border/70 ${className}`}>
      <CardHeader className="border-b bg-muted/30 py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon aria-hidden="true" className="h-4 w-4 text-primary" />{title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  )
}

export function UserDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const currentUser = useAuthStore((state) => state.user)
  const { data: user, isLoading, error } = useUser(id)
  const { data: sessionsData, isLoading: sessionsLoading } = useUserSessions(id)
  const terminate = useTerminateSession()
  const statusMutation = useActivateUser()
  const resetPassword = useResetUserPassword()
  const [feedback, setFeedback] = useState('')
  const sessions = sessionsData?.results ?? []

  if (isLoading) {
    return <div className="space-y-6" aria-busy="true"><Skeleton className="h-24 w-full" /><div className="grid gap-5 lg:grid-cols-2">{[...Array(6)].map((_, index) => <Skeleton key={index} className="h-64" />)}</div></div>
  }
  if (error || !user) {
    return <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">Utilisateur introuvable ou inaccessible.</div>
  }

  const groups = user.groups.map((group) => typeof group === 'string' ? { id: group, name: group, permissions: [] } : group)
  const directPermissions = user.user_permissions.filter((permission): permission is UserPermission => typeof permission !== 'string')
  const tenant = user.tenant_profile
  const isSelf = currentUser?.id === user.id

  function changeStatus() {
    setFeedback('')
    statusMutation.mutate({ id: user.id, active: !user.is_active }, {
      onSuccess: (updated) => setFeedback(updated.is_active ? 'Compte activé.' : 'Compte suspendu et sessions révoquées.'),
      onError: () => setFeedback("L'action n'a pas pu être appliquée."),
    })
  }

  function sendReset() {
    setFeedback('')
    resetPassword.mutate(user.email, {
      onSuccess: () => setFeedback('Si le compte est éligible, un e-mail de réinitialisation a été envoyé.'),
      onError: () => setFeedback("L'e-mail de réinitialisation n'a pas pu être envoyé."),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Link
          to="/admin/users"
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          aria-label="Retour aux utilisateurs"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </Link>
        <div className="min-w-0 flex-1">
          <PageHeader title={user.full_name || user.email} description={`Dossier administrateur · ${user.email}`} actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={sendReset} disabled={resetPassword.isPending}><KeyRound aria-hidden="true" className="mr-2 h-4 w-4" />{resetPassword.isPending ? 'Envoi…' : 'Réinitialiser le mot de passe'}</Button><Button variant={user.is_active ? 'destructive' : 'default'} onClick={changeStatus} disabled={statusMutation.isPending || (isSelf && user.is_active)} title={isSelf && user.is_active ? 'Votre propre compte ne peut pas être suspendu' : undefined}>{user.is_active ? <Ban aria-hidden="true" className="mr-2 h-4 w-4" /> : <CheckCircle2 aria-hidden="true" className="mr-2 h-4 w-4" />}{user.is_active ? 'Suspendre' : 'Activer'}</Button></div>} />
        </div>
      </div>

      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm" aria-label="Synthèse utilisateur">
        <div aria-hidden="true" className="absolute -right-12 -top-20 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4"><div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">{(user.first_name?.[0] ?? user.email[0]).toUpperCase()}{user.last_name?.[0]?.toUpperCase()}</div><div><div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-2xl font-semibold">{user.full_name || user.email}</h1><RoleBadge isSuperuser={user.is_superuser} isStaff={user.is_staff} roleDisplay={user.role_display} /><Badge variant={user.is_active ? 'default' : 'destructive'}>{user.is_active ? 'Compte actif' : 'Compte suspendu'}</Badge></div><p className="mt-2 text-sm text-muted-foreground">UUID {user.id}</p></div></div>
          <div className="grid grid-cols-3 gap-6 text-right"><div><p className="text-2xl font-semibold tabular-nums">{user.active_session_count ?? sessions.filter((item) => item.is_active).length}</p><p className="text-xs text-muted-foreground">sessions</p></div><div><p className="text-2xl font-semibold tabular-nums">{groups.length}</p><p className="text-xs text-muted-foreground">groupes</p></div><div><p className="text-2xl font-semibold tabular-nums">{user.effective_permissions?.length ?? 0}</p><p className="text-xs text-muted-foreground">permissions</p></div></div>
        </div>
      </section>
      {feedback && <div role="status" aria-live="polite" className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm font-medium">{feedback}</div>}

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <SectionCard title="Identité et contact" icon={CircleUserRound}><dl className="grid gap-5 sm:grid-cols-2"><InfoItem label="Prénom" value={user.first_name} /><InfoItem label="Nom" value={user.last_name} /><InfoItem label="Adresse e-mail" value={user.email} /><InfoItem label="Téléphone" value={<span className="inline-flex items-center gap-2"><Phone aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />{user.phone || '—'}</span>} /><InfoItem label="Date de naissance" value={formatDate(user.date_of_birth)} /><InfoItem label="Âge" value={user.age != null ? `${user.age} ans` : '—'} /><InfoItem label="Genre" value={user.gender_display || user.gender || '—'} /><InfoItem label="Ville d'origine" value={<span className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />{user.city_of_origin || '—'}</span>} /><InfoItem label="Langue" value={<span className="inline-flex items-center gap-2"><Languages aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />{user.language_preference_display || user.language_preference || '—'}</span>} /><InfoItem label="Identifiant externe" value={user.external_id || '—'} /></dl></SectionCard>

        <SectionCard title="Parcours académique" icon={BookOpen}><dl className="grid gap-5 sm:grid-cols-2"><InfoItem label="Niveau d'études" value={user.education_level_display || user.education_level || '—'} /><InfoItem label="Filière" value={user.field_of_study || '—'} /><InfoItem label="École / université" value={user.school || '—'} /><InfoItem label="Profil locataire" value={yesNo(user.is_tenant)} /></dl></SectionCard>

        <SectionCard title="Accès et rôles" icon={ShieldCheck}><dl className="grid gap-5 sm:grid-cols-2"><InfoItem label="Rôle principal" value={user.role_display} /><InfoItem label="Priorité du rôle" value={user.role_priority ?? '—'} /><InfoItem label="Staff" value={yesNo(user.is_staff)} /><InfoItem label="Superutilisateur" value={yesNo(user.is_superuser)} /><InfoItem label="Locataire" value={yesNo(user.is_tenant)} /><InfoItem label="Hiérarchie automatique" value={yesNo(user.enforce_role_hierarchy)} /></dl><div className="mt-6 space-y-3"><h3 className="text-sm font-semibold">Groupes</h3><div className="flex flex-wrap gap-2">{groups.length ? groups.map((group: UserGroup | { id: string; name: string }) => <Badge key={group.id} variant="secondary">{group.name}</Badge>) : <span className="text-sm text-muted-foreground">Aucun groupe</span>}</div><details className="rounded-lg border p-3"><summary className="cursor-pointer text-sm font-medium">Permissions effectives ({user.effective_permissions?.length ?? 0})</summary><ul className="mt-3 grid max-h-64 gap-1 overflow-auto font-mono text-xs text-muted-foreground sm:grid-cols-2">{user.effective_permissions?.map((permission) => <li key={permission}>{permission}</li>)}</ul></details>{directPermissions.length > 0 && <details className="rounded-lg border p-3"><summary className="cursor-pointer text-sm font-medium">Permissions directes ({directPermissions.length})</summary><ul className="mt-3 space-y-2 text-xs text-muted-foreground">{directPermissions.map((permission) => <li key={permission.id}><span className="font-medium text-foreground">{permission.name}</span><br /><code>{permission.app_label}.{permission.codename}</code> · modèle {permission.model}</li>)}</ul></details>}</div></SectionCard>

        <SectionCard title="Droits fonctionnels" icon={UserRoundCog}><dl className="grid gap-5 sm:grid-cols-2"><InfoItem label="Gérer ses réservations" value={yesNo(user.can_manage_own_reservations)} /><InfoItem label="Accès services résidence" value={yesNo(user.can_access_residence_services)} /><InfoItem label="Réservations mensuelles" value={user.max_reservations_per_month ?? '—'} /><InfoItem label="Compte actif" value={yesNo(user.is_active)} /></dl></SectionCard>

        <SectionCard title="Dossier locataire" icon={Building2} className="xl:col-span-2">{!tenant ? <p className="text-sm text-muted-foreground">Aucun dossier locataire lié à ce compte.</p> : <div className="space-y-6"><dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><InfoItem label="Dossier actif" value={yesNo(tenant.is_active)} /><InfoItem label="Unité active" value={tenant.active_unit ? `${tenant.active_unit.identifier}${tenant.active_unit.building ? ` · ${tenant.active_unit.building}` : ''}` : '—'} /><InfoItem label="Unité historique" value={tenant.current_unit?.identifier || '—'} /><InfoItem label="Entrée" value={formatDate(tenant.move_in_date)} /><InfoItem label="Sortie prévue" value={formatDate(tenant.move_out_date)} /><InfoItem label="Location active" value={yesNo(tenant.is_currently_renting)} /><InfoItem label="Jours depuis l'entrée" value={tenant.days_since_move_in != null ? `${tenant.days_since_move_in} jours` : '—'} /><InfoItem label="Durée du bail" value={tenant.lease_duration != null ? `${tenant.lease_duration} jours` : '—'} /><InfoItem label="Contact d'urgence" value={tenant.emergency_contact_name || '—'} /><InfoItem label="Téléphone urgence" value={tenant.emergency_contact_phone || '—'} /><InfoItem label="Documentation complète" value={yesNo(tenant.has_complete_documentation)} /><InfoItem label="Documents" value={`${tenant.verified_documents_count}/${tenant.documents_count} vérifiés`} /><InfoItem label="Documents en attente" value={tenant.pending_documents_count} /><InfoItem label="Documents expirés" value={tenant.expired_documents_count} /><InfoItem label="Dossier créé le" value={formatDate(tenant.created_at, true)} /><InfoItem label="Dossier modifié le" value={formatDate(tenant.updated_at, true)} /><InfoItem label="Dossier créé par" value={tenant.created_by?.full_name || tenant.created_by?.email || '—'} /><InfoItem label="Dossier modifié par" value={tenant.updated_by?.full_name || tenant.updated_by?.email || '—'} /></dl><div className="rounded-xl bg-muted/40 p-4"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes internes</p><p className="mt-2 whitespace-pre-wrap text-sm">{tenant.notes || 'Aucune note interne.'}</p></div>{tenant.documents.length > 0 && <div><h3 className="mb-3 flex items-center gap-2 text-sm font-semibold"><FileCheck2 aria-hidden="true" className="h-4 w-4" />Documents du dossier</h3><div className="grid gap-3 md:grid-cols-2">{tenant.documents.map((document) => <div key={document.id} className="rounded-xl border p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{document.title || document.document_type_display}</p><p className="text-xs text-muted-foreground">{document.document_type_display} · {document.document_type}</p></div><Badge variant={document.is_verified ? 'default' : 'secondary'}>{document.is_verified ? 'Vérifié' : 'En attente'}</Badge></div><dl className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2"><InfoItem label="Vérifié par" value={document.verified_by || '—'} /><InfoItem label="Vérifié le" value={formatDate(document.verified_at, true)} /><InfoItem label="Expiration" value={`${formatDate(document.expires_at)}${document.is_expired ? ' · Expiré' : ''}`} /><InfoItem label="Ajouté le" value={formatDate(document.created_at, true)} /></dl>{document.notes && <p className="mt-3 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-xs">{document.notes}</p>}</div>)}</div></div>}</div>}</SectionCard>

        <SectionCard title="Sessions JWT" icon={Fingerprint}>{sessionsLoading ? <Skeleton className="h-24" /> : sessions.length === 0 ? <p className="text-sm text-muted-foreground">Aucune session JWT enregistrée.</p> : <ul className="space-y-3">{sessions.map((session) => <li key={session.id} className="flex items-start justify-between gap-4 rounded-xl border p-3"><div className="min-w-0"><p className="font-medium">{session.device_info ? `${session.device_info.browser} · ${session.device_info.os} · ${session.device_info.device_type}` : session.ip_address || 'Appareil inconnu'}</p><p className="text-xs text-muted-foreground">{session.session_type?.toUpperCase() || 'JWT'} · IP {session.ip_address || '—'} · {session.is_active && !session.is_expired ? 'active' : 'inactive'}</p><p className="mt-1 text-xs text-muted-foreground">Créée {formatDate(session.created_at, true)} · activité {formatDate(session.last_activity, true)} · expiration {formatDate(session.expires_at, true)}</p>{session.user_agent && <details className="mt-2"><summary className="cursor-pointer text-xs font-medium">Agent utilisateur</summary><p className="mt-1 break-all font-mono text-[0.68rem] text-muted-foreground">{session.user_agent}</p></details>}</div>{session.is_active && <Button variant="ghost" size="sm" onClick={() => terminate.mutate(session.id)} disabled={terminate.isPending} aria-label="Révoquer cette session"><Ban aria-hidden="true" className="h-4 w-4" /></Button>}</li>)}</ul>}</SectionCard>

        <SectionCard title="Traçabilité" icon={Clock3}><dl className="grid gap-5 sm:grid-cols-2"><InfoItem label="Inscription" value={formatDate(user.date_joined, true)} /><InfoItem label="Dernière connexion" value={formatDate(user.last_login, true)} /><InfoItem label="Création technique" value={formatDate(user.created_at, true)} /><InfoItem label="Dernière modification" value={formatDate(user.updated_at, true)} /><InfoItem label="Créé par" value={user.created_by?.full_name || user.created_by?.email || '—'} /><InfoItem label="Modifié par" value={user.updated_by?.full_name || user.updated_by?.email || '—'} /></dl></SectionCard>
      </div>
    </div>
  )
}
