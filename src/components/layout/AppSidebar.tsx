import { Link, useLocation } from 'react-router-dom'
import {
  Building2, Users, Wrench, Phone, MessageSquare, LayoutDashboard,
  PanelLeftClose, PanelLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'

const navGroups = [
  {
    label: 'Gestion',
    items: [
      { title: 'Dashboard', path: '/', icon: LayoutDashboard },
      { title: 'Bâtiments', path: '/buildings', icon: Building2 },
      { title: 'Unités', path: '/units', icon: Building2 },
      { title: 'Inventaire', path: '/inventory', icon: Building2 },
    ],
  },
  {
    label: 'Locations',
    items: [
      { title: 'Locataires', path: '/tenants', icon: Users },
    ],
  },
  {
    label: 'Opérations',
    items: [
      { title: 'Maintenance', path: '/operations', icon: Wrench },
      { title: 'Contacts', path: '/contacts', icon: Phone },
      { title: 'Suggestions', path: '/suggestions', icon: MessageSquare },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        {!collapsed && (
          <span className="font-semibold text-sidebar-primary text-lg tracking-tight">
            Eurekanet
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn('ml-auto', collapsed && 'mx-auto')}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                      collapsed && 'justify-center px-0',
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2 space-y-1">
        <div className={cn('flex items-center', collapsed ? 'justify-center' : 'px-2')}>
          <ThemeToggle />
          {!collapsed && user && (
            <span className="ml-2 text-xs text-sidebar-foreground/70 truncate">
              {user.first_name} {user.last_name}
            </span>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            Déconnexion
          </Button>
        )}
      </div>
    </aside>
  )
}
