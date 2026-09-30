import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Building2, ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme'
import { useAuthStore } from '@/stores/auth-store'
import { getNavigationItem, navigationGroups } from './navigation'

interface AppSidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onCollapsedChange: (collapsed: boolean) => void
  onMobileClose: () => void
}

export function AppSidebar({ collapsed, mobileOpen, onCollapsedChange, onMobileClose }: AppSidebarProps) {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const activeItem = getNavigationItem(location.pathname)
  const visibleGroups = useMemo(
    () => navigationGroups.filter((group) => !group.staffOnly || user?.is_staff),
    [user?.is_staff],
  )
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navigationGroups.map((group) => [group.label, group.label !== 'Administration'])),
  )

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || 'EU'
    : 'EU'

  return (
    <>
      {mobileOpen && (
        <button type="button" aria-label="Fermer le menu" className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden" onClick={onMobileClose} />
      )}
      <aside
        id="main-navigation"
        aria-label="Navigation principale"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none',
          collapsed ? 'lg:w-[5.25rem]' : 'lg:w-72',
          mobileOpen ? 'w-[min(19rem,calc(100vw-2rem))] translate-x-0' : 'w-72 -translate-x-full',
        )}
      >
        <div className="flex h-[4.5rem] shrink-0 items-center border-b border-sidebar-border px-4">
          <Link to="/" onClick={onMobileClose} className={cn('flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring', collapsed && 'lg:mx-auto')} aria-label="Eurekanet — accueil">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <Building2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className={cn('min-w-0', collapsed && 'lg:hidden')}>
              <span className="font-display block text-xl font-semibold leading-none text-sidebar-primary">Eurekanet</span>
              <span className="mt-1 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/60">Gestion résidentielle</span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onMobileClose} className="ml-auto lg:hidden" aria-label="Fermer le menu">
            <X aria-hidden="true" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4" aria-label="Rubriques">
          <div className="space-y-2">
            {visibleGroups.map((group) => {
              const containsActive = group.items.some((item) => item.path === activeItem?.path)
              const isOpen = openGroups[group.label] || containsActive
              return (
                <section key={group.label} aria-label={group.label}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenGroups((current) => ({ ...current, [group.label]: !isOpen }))}
                    className={cn('flex min-h-9 w-full items-center rounded-lg px-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-sidebar-foreground/55 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring', collapsed && 'lg:hidden')}
                  >
                    <span>{group.label}</span>
                    <ChevronDown aria-hidden="true" className={cn('ml-auto h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  <div className={cn('mt-1 space-y-1', !isOpen && !collapsed && 'hidden', !isOpen && collapsed && !containsActive && 'lg:hidden')}>
                    {group.items.map((item) => {
                      const isActive = activeItem?.path === item.path
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={onMobileClose}
                          aria-current={isActive ? 'page' : undefined}
                          aria-label={collapsed ? item.title : undefined}
                          title={collapsed ? item.title : undefined}
                          className={cn(
                            'group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                            isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm' : 'text-sidebar-foreground/78 hover:bg-sidebar-accent/65 hover:text-sidebar-accent-foreground',
                            collapsed && 'lg:justify-center lg:px-0',
                          )}
                        >
                          {isActive && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-sidebar-primary" />}
                          <item.icon aria-hidden="true" className={cn('h-[1.1rem] w-[1.1rem] shrink-0', isActive && 'text-sidebar-primary')} />
                          <span className={cn(collapsed && 'lg:hidden')}>{item.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </nav>

        <div className="shrink-0 border-t border-sidebar-border p-3">
          <div className={cn('mb-2 flex items-center gap-2', collapsed && 'lg:flex-col')}>
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => onCollapsedChange(!collapsed)} className="hidden lg:inline-flex" aria-label={collapsed ? 'Déployer la navigation' : 'Réduire la navigation'}>
              {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
            </Button>
          </div>
          <div className={cn('flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-2', collapsed && 'lg:justify-center')}>
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">{initials}</span>
            <div className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
              <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">{user?.full_name || `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || 'Utilisateur'}</p>
              <p className="truncate text-xs text-sidebar-foreground/65">{user?.role_display || 'Gestionnaire'}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className={cn('shrink-0 text-sidebar-foreground/65 hover:text-destructive', collapsed && 'lg:hidden')} aria-label="Se déconnecter" title="Se déconnecter">
              <LogOut aria-hidden="true" />
            </Button>
          </div>
          {collapsed && (
            <Button variant="ghost" size="icon" onClick={logout} className="mx-auto mt-2 hidden text-sidebar-foreground/65 hover:text-destructive lg:inline-flex" aria-label="Se déconnecter" title="Se déconnecter">
              <LogOut aria-hidden="true" />
            </Button>
          )}
        </div>
      </aside>
    </>
  )
}
