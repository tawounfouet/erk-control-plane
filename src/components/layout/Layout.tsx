import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Bell, Menu, Search } from 'lucide-react'
import { AppSidebar } from './AppSidebar'
import { getNavigationItem } from './navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export function Layout() {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('eurekanet-sidebar-collapsed') === 'true')
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentItem = getNavigationItem(location.pathname)

  useEffect(() => {
    localStorage.setItem('eurekanet-sidebar-collapsed', String(collapsed))
  }, [collapsed])

  useEffect(() => {
    if (!mobileOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileOpen])

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        window.location.hash = '#/search'
      }
    }
    document.addEventListener('keydown', handleSearchShortcut)
    return () => document.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  return (
    <div className="min-h-screen bg-background lg:flex">
      <a className="skip-link" href="#main-content">Aller au contenu principal</a>
      <AppSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapsedChange={setCollapsed}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-[4.5rem] items-center gap-3 border-b bg-background/88 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-controls="main-navigation" aria-expanded={mobileOpen} aria-label="Ouvrir le menu">
            <Menu aria-hidden="true" />
          </Button>
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted-foreground">Espace gestionnaire</p>
            <p className="truncate text-sm font-semibold">{currentItem?.title ?? 'Eurekanet'}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Link to="/search" className={cn(buttonVariants({ variant: 'outline' }), 'hidden min-w-56 justify-start text-muted-foreground md:inline-flex')}>
              <Search aria-hidden="true" />
              <span>Rechercher…</span>
              <kbd className="ml-auto rounded border bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium">⌘ K</kbd>
            </Link>
            <Link to="/admin/notifications" className={buttonVariants({ variant: 'ghost', size: 'icon' })} aria-label="Ouvrir les notifications">
              <Bell aria-hidden="true" />
            </Link>
            <div className="ml-1 hidden border-l pl-3 text-right sm:block">
              <p className="max-w-40 truncate text-sm font-semibold">{user?.first_name || 'Gestionnaire'}</p>
              <p className="max-w-40 truncate text-xs text-muted-foreground">{user?.role_display || 'Eurekanet'}</p>
            </div>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[96rem] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
