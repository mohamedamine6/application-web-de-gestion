import {
  ArrowRightLeft,
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  Landmark,
  LayoutDashboard,
  ListChecks,
  MapPinned,
  Package,
  ShoppingCart,
  Settings,
  UserRoundCheck,
  Users,
  Warehouse,
  Wrench,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { UserProfile } from '@/types'

const navSections = [
  { label: 'Pilotage', items: [
    { label: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Rapports', path: '/reports', icon: BarChart3 },
  ] },
  { label: 'Patrimoine', items: [
    { label: 'Registre', path: '/assets', icon: Building2 },
    { label: 'Cartographie', path: '/property-map', icon: MapPinned },
    { label: 'Inventaire', path: '/inventory', icon: ListChecks },
    { label: 'Mouvements', path: '/movements', icon: ArrowRightLeft },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'Réforme', path: '/reform', icon: ClipboardList },
  ] },
  { label: 'Ressources', items: [
    { label: 'RH', path: '/hr', icon: Users },
    { label: 'Intra', path: '/intra', icon: FileText },
    { label: 'Accès & absences', path: '/access', icon: UserRoundCheck },
  ] },
  { label: 'Gestion', items: [
    { label: 'Achats', path: '/purchases', icon: ShoppingCart },
    { label: 'Stocks', path: '/stocks', icon: Package },
    { label: 'Finance & comptabilité', path: '/finance', icon: Landmark },
    { label: 'Fournisseurs', path: '/suppliers', icon: Warehouse },
  ] },
  { label: 'Configuration', items: [
    { label: 'Paramètres', path: '/settings', icon: Settings },
  ] },
]

interface SidebarProps {
  currentPath: string
  onNavigate: (path: string) => void
  isOpen: boolean
  onClose: () => void
  user: UserProfile
}

export function Sidebar({ currentPath, onNavigate, isOpen, onClose, user }: SidebarProps) {
  return (
    <aside className={cn('w-72 shrink-0 border-r border-slate-800 bg-slate-950 text-slate-100', isOpen ? 'fixed inset-y-0 left-0 z-50 flex flex-col md:sticky md:top-0 md:h-screen' : 'hidden md:sticky md:top-0 md:flex md:h-screen md:flex-col')}>
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">D</div>
        <div>
          <div className="text-sm font-medium text-slate-300">DGP</div>
          <div className="text-lg font-semibold">Patrimoine</div>
        </div>
        <button type="button" aria-label="Fermer le menu" onClick={onClose} className="ml-auto rounded-md p-2 text-slate-300 hover:bg-slate-800 md:hidden"><X className="h-4 w-4" /></button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-5">
        {navSections.map((section) => <div key={section.label}>
          <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{section.label}</div>
          <div className="space-y-1">{section.items.map(({ label, path, icon: Icon }) => {
            const active = currentPath === path || ((path === '/assets' || path === '/inventory') && currentPath.startsWith(`${path}/`))
            return <button key={path} type="button" onClick={() => { onNavigate(path); onClose() }} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors', active ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-950/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white')}><Icon className="h-4 w-4 shrink-0" />{label}</button>
          })}</div>
        </div>)}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-200">
            {user.name.split(' ').map((part) => part[0]).join('')}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-white">{user.name}</div>
            <div className="truncate text-xs text-slate-400">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
