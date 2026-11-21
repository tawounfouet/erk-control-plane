import {
  Activity, AlertTriangle, Building2, ClipboardCheck, ClipboardList, DoorOpen,
  Download, FileSearch, FileText, GraduationCap, Image, Kanban, LayoutDashboard,
  ListTree, MessageSquare, Package, PackageCheck, Phone, ReceiptText, Search,
  Settings, Shield, Upload, UserCog, Users, Wrench, type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
  title: string
  shortTitle?: string
  path: string
  icon: LucideIcon
}

interface NavigationGroup {
  label: string
  items: NavigationItem[]
  staffOnly?: boolean
}

export const navigationGroups: NavigationGroup[] = [
  { label: 'Pilotage', items: [
    { title: 'Vue d’ensemble', shortTitle: 'Accueil', path: '/', icon: LayoutDashboard },
    { title: 'Recherche globale', shortTitle: 'Recherche', path: '/search', icon: Search },
  ] },
  { label: 'Patrimoine', items: [
    { title: 'Bâtiments', path: '/buildings', icon: Building2 },
    { title: 'Logements', path: '/units', icon: DoorOpen },
    { title: 'Inventaire', path: '/inventory', icon: Package },
    { title: 'Stock physique', path: '/patrimoine/equipments', icon: PackageCheck },
    { title: 'Affectations', path: '/inventory/assignments', icon: ClipboardList },
    { title: 'Registre technique', path: '/patrimoine/registry', icon: ListTree },
    { title: 'Maintenance historique', path: '/patrimoine/interventions', icon: Wrench },
  ] },
  { label: 'Vie locative', items: [
    { title: 'Locataires', path: '/tenants', icon: Users },
    { title: 'Documents', path: '/documents', icon: FileText },
    { title: 'Registre locatif', path: '/rental/control', icon: ClipboardCheck },
  ] },
  { label: 'Interventions', items: [
    { title: 'Maintenance', path: '/operations', icon: Wrench },
    { title: 'Vue Kanban', path: '/operations/kanban', icon: Kanban },
    { title: 'Contacts', path: '/contacts', icon: Phone },
    { title: 'Suggestions', path: '/suggestions', icon: MessageSquare },
  ] },
  { label: 'Administration', staffOnly: true, items: [
    { title: 'Indicateurs avancés', path: '/admin/dashboard', icon: Activity },
    { title: 'Utilisateurs', path: '/admin/users', icon: UserCog },
    { title: 'Étudiants', path: '/admin/students', icon: GraduationCap },
    { title: 'Groupes', path: '/admin/groups', icon: Users },
    { title: 'Permissions', path: '/admin/permissions', icon: Shield },
    { title: 'Journal d’audit', path: '/admin/audit', icon: FileSearch },
    { title: 'Notifications', path: '/admin/notifications', icon: MessageSquare },
    { title: 'Paramètres', path: '/admin/settings', icon: Settings },
    { title: 'Santé du système', path: '/admin/health', icon: Activity },
    { title: 'Médiathèque', path: '/admin/media', icon: Image },
    { title: 'Importer', path: '/admin/import', icon: Upload },
    { title: 'Exporter', path: '/admin/export', icon: Download },
    { title: 'Actions groupées', path: '/admin/batch', icon: AlertTriangle },
    { title: 'Factures fournisseur', path: '/admin/invoices', icon: ReceiptText },
  ] },
]

export function getNavigationItem(pathname: string) {
  return navigationGroups
    .flatMap((group) => group.items)
    .filter((item) => item.path === pathname || (item.path !== '/' && pathname.startsWith(`${item.path}/`)))
    .sort((a, b) => b.path.length - a.path.length)[0]
}
