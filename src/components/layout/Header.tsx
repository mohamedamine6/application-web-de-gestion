import { useState } from 'react'
import { Bell, CalendarDays, ChevronDown, LogOut, Menu, Search, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { alerts } from '@/data/mockData'
import type { UserProfile } from '@/types'

interface HeaderProps {
  currentPath: string
  onNavigate: (path: string) => void
  onMenuClick: () => void
  user: UserProfile
  assetSearchTerm: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  onLogout: () => void
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Tableau de bord',
  '/assets': 'Patrimoine',
  '/assets/1': 'Fiche actif',
  '/inventory': 'Inventaire terrain',
  '/inventory/1': 'Contrôle terrain',
  '/maintenance': 'Maintenance',
  '/reform': 'Réforme / sortie',
  '/reports': 'Rapports',
  '/settings': 'Paramètres',
  '/property-map': 'Cartographie du patrimoine',
  '/movements': 'Mouvements des biens',
  '/hr': 'Ressources humaines',
  '/intra': 'Intra',
  '/access': 'Accès & absences',
  '/purchases': 'Achats',
  '/stocks': 'Stocks',
  '/finance': 'Finance & comptabilité',
  '/suppliers': 'Fournisseurs',
}

export function Header({ currentPath, onNavigate, onMenuClick, user, assetSearchTerm, onSearchChange, onSearch, onLogout }: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pageTitle = currentPath.startsWith('/assets/')
    ? currentPath.endsWith('/map')
      ? 'Carte de l’immeuble'
      : currentPath.endsWith('/apartments')
        ? 'Appartements de l’immeuble'
        : 'Fiche actif'
    : currentPath === '/inventory/1'
      ? 'Détail inventaire'
      : pageTitles[currentPath] ?? 'Tableau de bord'

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>

        <form role="search" onSubmit={(event) => { event.preventDefault(); onSearch() }} className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <Input aria-label="Recherche globale" className="h-9 min-w-0 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0" placeholder="Rechercher un actif, ministère, site..." value={assetSearchTerm} onChange={(event) => onSearchChange(event.target.value)} />
          <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Rechercher"><Search className="h-4 w-4" /></Button>
        </form>

        <div className="hidden items-center gap-2 md:flex">
          <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600"><CalendarDays className="h-4 w-4 text-emerald-800" />T3 · 2026</span>
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative rounded-lg border border-slate-200 bg-slate-50" aria-label={`Notifications, ${alerts.length} alertes`} aria-expanded={isNotificationsOpen} onClick={() => { setIsNotificationsOpen((open) => !open); setIsProfileOpen(false) }}>
              <Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
            </Button>
            {isNotificationsOpen && <div className="absolute right-0 top-12 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
              <div className="flex items-center justify-between px-1 pb-2"><h2 className="text-sm font-semibold text-slate-900">Alertes récentes</h2><span className="text-xs text-slate-500">{alerts.length}</span></div>
              <div className="divide-y divide-slate-100">{alerts.map((alert) => <div key={alert.title} className="py-3"><p className="text-sm font-medium text-slate-800">{alert.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{alert.detail}</p></div>)}</div>
              <Button variant="secondary" size="sm" className="mt-2 w-full" onClick={() => { onNavigate('/dashboard'); setIsNotificationsOpen(false) }}>Voir le tableau de bord</Button>
            </div>}
          </div>
        </div>

        <div className="relative">
          <button type="button" aria-expanded={isProfileOpen} onClick={() => { setIsProfileOpen((open) => !open); setIsNotificationsOpen(false) }} className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 shadow-sm hover:bg-slate-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-900">{user.name.split(' ').map((part) => part[0]).join('')}</div>
            <div className="hidden text-left md:block"><div className="max-w-32 truncate text-sm font-medium text-slate-800">{user.name}</div><div className="max-w-32 truncate text-[11px] text-slate-500">{user.role}</div></div>
            <ChevronDown className="hidden h-4 w-4 text-slate-500 md:block" />
          </button>
          {isProfileOpen && <div className="absolute right-0 top-12 z-30 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
            <div className="border-b border-slate-100 px-3 py-2"><p className="truncate text-sm font-semibold text-slate-900">{user.name}</p><p className="mt-0.5 text-xs text-slate-500">{user.email}</p></div>
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500"><ShieldCheck className="h-3.5 w-3.5" />{user.role}</div>
            <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"><LogOut className="h-4 w-4" />Se déconnecter</button>
          </div>}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 md:px-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Module</div>
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">{pageTitle}</h1>
        </div>
        <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">
          <span>Patrimoine public</span>
          <span>•</span>
          <span>Gabon</span>
        </div>
      </div>
    </header>
  )
}
