import { useState, type FormEvent } from 'react'
import { CheckCheck, FileCheck2, Plus, Trash2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { assets as mockAssets, reformItems } from '@/data/mockData'
import type { Asset, ReformItem } from '@/types'

const statusStyles = {
  'À valider': 'bg-amber-100 text-amber-700',
  Validée: 'bg-emerald-100 text-emerald-700',
  Recyclage: 'bg-blue-100 text-blue-700',
  Destruction: 'bg-red-100 text-red-700',
}

export function ReformPage({ assets = mockAssets }: { assets?: Asset[] }) {
  const [items, setItems] = useState(reformItems)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isProposalOpen, setIsProposalOpen] = useState(false)
  const validateSelected = () => {
    setItems((current) => current.map((item) => selectedIds.includes(item.id) ? { ...item, status: 'Validée', history: [...(item.history ?? ['Proposition enregistrée']), 'Proposition validée'] } : item))
    setSelectedIds([])
  }

  const proposeReform = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const assetId = String(values.get('assetId'))
    const item: ReformItem = { id: `r-${Date.now()}`, assetId, reason: String(values.get('reason')), status: 'À valider', date: new Date().toISOString().slice(0, 10), history: ['Proposition enregistrée'] }
    setItems((current) => [item, ...current])
    setIsProposalOpen(false)
  }

  const setDestination = (id: string, status: 'Recyclage' | 'Destruction') => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status, proof: status === 'Destruction' ? 'Document / certificat simulé' : undefined, history: [...(item.history ?? []), status === 'Destruction' ? 'Destruction enregistrée · preuve simulée' : 'Destination recyclage enregistrée'] } : item))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Fin de vie</div>
          <h2 className="text-2xl font-semibold text-slate-900">Réforme / sortie</h2>
        </div>
        <div className="flex flex-wrap gap-2"><Button variant="secondary" className="gap-2" onClick={() => setIsProposalOpen(true)}><Plus className="h-4 w-4" />Proposer une réforme</Button><Button className="gap-2" disabled={selectedIds.length === 0} onClick={validateSelected}><CheckCheck className="h-4 w-4" />Valider la sélection{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}</Button></div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4"><div className="text-sm text-slate-500">À valider</div><div className="mt-2 text-2xl font-semibold text-slate-900">{items.filter((item) => item.status === 'À valider').length}</div></Card>
        <Card className="p-4"><div className="text-sm text-slate-500">Recyclage</div><div className="mt-2 text-2xl font-semibold text-slate-900">{items.filter((item) => item.status === 'Recyclage').length}</div></Card>
        <Card className="p-4"><div className="text-sm text-slate-500">Destruction</div><div className="mt-2 text-2xl font-semibold text-slate-900">{items.filter((item) => item.status === 'Destruction').length}</div></Card>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Actif</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{item.assetId}</div>
                <div className="mt-1 text-xs text-slate-500">{assets.find((asset) => asset.code === item.assetId)?.name ?? 'Actif non trouvé'} · {(assets.find((asset) => asset.code === item.assetId)?.value ?? 0).toLocaleString('fr-FR')} FCFA</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[item.status]}`}>
                  {item.status}
                </span>
                {item.status === 'À valider' && <label className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-600"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} className="h-4 w-4 accent-emerald-700" />Sélectionner</label>}
                {item.status === 'Recyclage' && <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Truck className="h-4 w-4" />Filière définie</span>}
                {item.status === 'Destruction' && <span className="inline-flex items-center gap-1 text-xs text-slate-500"><Trash2 className="h-4 w-4" />Sortie enregistrée</span>}
                {item.status === 'Validée' && <><Button size="sm" variant="secondary" onClick={() => setDestination(item.id, 'Recyclage')}>Orienter recyclage</Button><Button size="sm" variant="danger" onClick={() => setDestination(item.id, 'Destruction')}>Enregistrer destruction</Button></>}
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-600">{item.reason}</div>
            <div className="mt-2 text-xs text-slate-500">Date : {item.date}</div>
            {item.proof && <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><FileCheck2 className="h-4 w-4 shrink-0" />{item.proof} · démonstration sans valeur juridique</div>}
            {item.history && <div className="mt-2 text-xs text-slate-500">Historique : {item.history.join(' · ')}</div>}
          </Card>
        ))}
      </div>
      {isProposalOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsProposalOpen(false) }}><section role="dialog" aria-modal="true" aria-labelledby="reform-proposal-title" onKeyDown={(event) => { if (event.key === 'Escape') setIsProposalOpen(false) }} className="w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl"><h2 id="reform-proposal-title" className="text-xl font-semibold text-slate-900">Proposer un actif à la réforme</h2><form onSubmit={proposeReform} className="mt-5 space-y-4"><label className="block text-sm font-medium text-slate-700">Bien<select name="assetId" className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3" required>{assets.map((asset) => <option key={asset.id} value={asset.code}>{asset.code} · {asset.name}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">Motif<Input name="reason" className="mt-1.5" required placeholder="Justification de la proposition" /></label><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="secondary" onClick={() => setIsProposalOpen(false)}>Annuler</Button><Button type="submit">Enregistrer la proposition</Button></div></form></section></div>}
    </div>
  )
}
