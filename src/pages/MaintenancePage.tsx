import { useState, type FormEvent } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { assets as mockAssets, maintenanceRequests } from '@/data/mockData'
import type { Asset, MaintenanceRequest } from '@/types'

const statusStyles = {
  Ouverte: 'bg-sky-100 text-sky-700',
  'En cours': 'bg-amber-100 text-amber-700',
  Clôturée: 'bg-emerald-100 text-emerald-700',
  Urgente: 'bg-red-100 text-red-700',
}

const priorityStyles = {
  Faible: 'bg-slate-200 text-slate-700',
  Moyenne: 'bg-blue-100 text-blue-700',
  Haute: 'bg-amber-100 text-amber-700',
  Urgente: 'bg-red-100 text-red-700',
}

export function MaintenancePage({ assets = mockAssets }: { assets?: Asset[] }) {
  const [requests, setRequests] = useState(maintenanceRequests)
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const visibleRequests = requests.filter((request) => `${request.id} ${request.title} ${request.assetId} ${request.assignedTo} ${request.status}`.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')))

  const createRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const request: MaintenanceRequest = {
      id: `M-${String(Date.now()).slice(-4)}`,
      assetId: String(values.get('assetId')),
      title: String(values.get('title')),
      priority: values.get('priority') as MaintenanceRequest['priority'],
      status: 'Ouverte',
      date: new Date().toISOString().slice(0, 10),
      assignedTo: String(values.get('technician') || 'À affecter'),
      dueDate: String(values.get('dueDate') || ''),
      cost: Number(values.get('cost') || 0),
      history: ['Demande créée'],
    }
    setRequests((current) => [request, ...current])
    setSearch('')
    setIsCreateOpen(false)
  }

  const advanceRequest = (id: string) => {
    setRequests((current) => current.map((request) => {
      if (request.id !== id || request.status === 'Clôturée') return request
      const status = request.status === 'Ouverte' || request.status === 'Urgente' ? 'En cours' : 'Clôturée'
      const event = status === 'Clôturée' ? 'Intervention clôturée' : 'Intervention démarrée'
      return { ...request, status, history: [...(request.history ?? ['Demande créée']), event] }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" aria-label="Rechercher une demande" placeholder="Référence, actif ou description" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Nouvelle demande
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleRequests.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium text-slate-900">{request.id}</div>
              <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${priorityStyles[request.priority]}`}>
                {request.priority}
              </span>
            </div>

            <div className="mt-4 text-lg font-semibold text-slate-900">{request.title}</div>
            <div className="mt-2 text-sm text-slate-500">Actif {request.assetId}</div>

            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <div className="flex items-center justify-between"><span>Date</span><span>{request.date}</span></div>
              <div className="flex items-center justify-between"><span>Assigné</span><span>{request.assignedTo}</span></div>
              <div className="flex items-center justify-between"><span>Échéance</span><span>{request.dueDate || 'À définir'}</span></div>
              <div className="flex items-center justify-between"><span>Coût estimé</span><span>{(request.cost ?? 0).toLocaleString('fr-FR')} FCFA</span></div>
            </div>

            <div className="mt-4">
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[request.status]}`}>
                {request.status}
              </span>
            </div>
            <div className="mt-3 flex items-start justify-between gap-2 border-t border-slate-100 pt-3"><span className="text-xs text-slate-500">{(request.history ?? ['Demande enregistrée']).join(' · ')}</span><Button size="sm" variant={request.status === 'Clôturée' ? 'secondary' : 'primary'} disabled={request.status === 'Clôturée'} onClick={() => advanceRequest(request.id)}>{request.status === 'Ouverte' || request.status === 'Urgente' ? 'Démarrer' : request.status === 'En cours' ? 'Clôturer' : 'Clôturée'}</Button></div>
          </Card>
        ))}
      </div>
      {visibleRequests.length === 0 && <Card className="p-10 text-center text-sm text-slate-500">Aucune demande ne correspond à cette recherche.</Card>}

      {isCreateOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsCreateOpen(false) }}>
        <section role="dialog" aria-modal="true" aria-labelledby="maintenance-title" onKeyDown={(event) => { if (event.key === 'Escape') setIsCreateOpen(false) }} className="w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl md:p-6">
          <div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Intervention</p><h2 id="maintenance-title" className="mt-1 text-xl font-semibold text-slate-900">Nouvelle demande</h2></div><Button variant="ghost" size="icon" aria-label="Fermer" onClick={() => setIsCreateOpen(false)}><X className="h-4 w-4" /></Button></div>
          <form onSubmit={createRequest} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">Description<Input autoFocus className="mt-1.5" name="title" required placeholder="Décrire le problème constaté" /></label>
            <label className="block text-sm font-medium text-slate-700">Actif<select name="assetId" className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm" required>{assets.map((asset) => <option key={asset.id} value={asset.code}>{asset.code} · {asset.name}</option>)}</select></label>
            <label className="block text-sm font-medium text-slate-700">Priorité<select name="priority" className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Faible</option><option>Moyenne</option><option>Haute</option><option>Urgente</option></select></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Technicien / équipe<Input className="mt-1.5" name="technician" placeholder="À affecter" /></label><label className="block text-sm font-medium text-slate-700">Échéance<Input className="mt-1.5" name="dueDate" type="date" /></label><label className="block text-sm font-medium text-slate-700 sm:col-span-2">Coût estimé (FCFA)<Input className="mt-1.5" name="cost" type="number" min="0" placeholder="0" /></label></div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Annuler</Button><Button type="submit">Créer la demande</Button></div>
          </form>
        </section>
      </div>}
    </div>
  )
}
