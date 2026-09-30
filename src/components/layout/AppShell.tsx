import type { ReactNode } from 'react'
import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import type { UserProfile } from '@/types'

interface AppShellProps {
  children: ReactNode
  currentPath: string
  onNavigate: (path: string) => void
  user: UserProfile
  assetSearchTerm: string
  onSearchChange: (value: string) => void
  onSearch: () => void
  onLogout: () => void
}

export function AppShell({ children, currentPath, onNavigate, user, assetSearchTerm, onSearchChange, onSearch, onLogout }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {isMobileNavOpen && (
          <button type="button" aria-label="Fermer le menu" onClick={() => setIsMobileNavOpen(false)} className="fixed inset-0 z-40 bg-slate-950/45 md:hidden" />
        )}
        <Sidebar currentPath={currentPath} onNavigate={(path) => { onNavigate(path); setIsMobileNavOpen(false) }} isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} user={user} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header currentPath={currentPath} onNavigate={onNavigate} onMenuClick={() => setIsMobileNavOpen(true)} user={user} assetSearchTerm={assetSearchTerm} onSearchChange={onSearchChange} onSearch={onSearch} onLogout={onLogout} />
          <main className="min-w-0 flex-1 bg-[#f4f7f5] p-4 md:p-6 xl:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
