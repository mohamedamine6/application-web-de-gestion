import { useState } from 'react'
import { ArrowRight, CheckCircle2, CloudUpload, RefreshCw, ScanLine, TriangleAlert, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { assets as mockAssets, inventoryItems } from '@/data/mockData'
import type { Asset, InventoryItem } from '@/types'

const statusClasses = {
  'Validé': 'bg-emerald-100 text-emerald-700',
  'En cours': 'bg-sky-100 text-sky-700',
  'Anomalie': 'bg-red-100 text-red-700',
}

export function InventoryPage({ assets = mockAssets }: { assets?: Asset[] }) {
  const [items, setItems] = useState(inventoryItems)
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  const [scannedAssets, setScannedAssets] = useState<Record<string, string[]>>({})
  const [unsyncedIds, setUnsyncedIds] = useState<string[]>(['inv-2'])
  const [isOffline, setIsOffline] = useState(false)
  const [scanMethod, setScanMethod] = useState('QR Code')
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id ?? '')

  const startInventory = () => {
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      site: 'Libreville',
      date: new Date().toISOString().slice(0, 10),
      agent: 'Agent terrain',
      status: 'En cours',
      scanned: 0,
      total: assets.length,
    }
    setItems((current) => [item, ...current])
    setUnsyncedIds((current) => [item.id, ...current])
    setScannedAssets((current) => ({ ...current, [item.id]: [] }))
    setOpenItemId(item.id)
  }

  const recordScan = (id: string) => {
    const currentIds = scannedAssets[id] ?? []
    if (currentIds.includes(selectedAssetId)) return
    const nextIds = [...currentIds, selectedAssetId]
    setScannedAssets((current) => ({ ...current, [id]: nextIds }))
    setItems((current) => current.map((item) => item.id === id ? { ...item, scanned: Math.max(item.scanned, nextIds.length), status: nextIds.length > item.total ? 'Anomalie' : item.status } : item))
    if (!unsyncedIds.includes(id)) setUnsyncedIds((current) => [...current, id])
  }

  const syncInventories = () => setUnsyncedIds([])

  const validateInventory = (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: item.scanned >= item.total ? 'Validé' : 'Anomalie' } : item))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Contrôle terrain</div>
          <h2 className="text-2xl font-semibold text-slate-900">Inventaires</h2>
        </div>
        <Button className="gap-2" onClick={startInventory}>
          <RefreshCw className="h-4 w-4" />
          Nouveau contrôle
        </Button>
      </div>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3"><div className={`mt-0.5 rounded-lg p-2 ${isOffline ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{isOffline ? <WifiOff className="h-4 w-4" /> : <CloudUpload className="h-4 w-4" />}</div><div><p className="font-medium text-slate-900">Mode terrain · {isOffline ? 'Hors ligne' : 'Connecté'}</p><p className="mt-1 text-xs text-slate-500">{unsyncedIds.length} campagne(s) en attente de synchronisation · fonctionnement simulé</p></div></div>
        <div className="flex flex-wrap gap-2"><Button variant={isOffline ? 'primary' : 'secondary'} size="sm" onClick={() => setIsOffline((value) => !value)}>{isOffline ? 'Activer le mode connecté' : 'Simuler le mode hors ligne'}</Button><Button size="sm" className="gap-2" disabled={isOffline || unsyncedIds.length === 0} onClick={syncInventories}><CloudUpload className="h-4 w-4" />Synchroniser</Button></div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm text-slate-500">Inventaires validés</div>
          <div className="mt-3 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div className="text-2xl font-semibold text-slate-900">{items.filter((item) => item.status === 'Validé').length}</div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-slate-500">En cours</div>
          <div className="mt-3 flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-sky-600" />
            <div className="text-2xl font-semibold text-slate-900">{items.filter((item) => item.status === 'En cours').length}</div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-slate-500">Anomalies</div>
          <div className="mt-3 flex items-center gap-3">
            <TriangleAlert className="h-5 w-5 text-red-600" />
            <div className="text-2xl font-semibold text-slate-900">{items.filter((item) => item.status === 'Anomalie').length}</div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Site</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{item.site}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusClasses[item.status]}`}>
                  {item.status}
                </span>
                <Button variant="secondary" className="gap-2" aria-expanded={openItemId === item.id} onClick={() => setOpenItemId((current) => current === item.id ? null : item.id)}>
                  {openItemId === item.id ? 'Fermer' : 'Ouvrir'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
              <div><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Date</div><div className="mt-1 text-sm text-slate-700">{item.date}</div></div>
              <div><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Agent</div><div className="mt-1 text-sm text-slate-700">{item.agent}</div></div>
              <div><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Contrôlés</div><div className="mt-1 text-sm text-slate-700">{item.scanned}/{item.total}</div></div>
              <div><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Progression</div><div className="mt-1 text-sm text-slate-700">{Math.round((item.scanned / item.total) * 100)}%</div></div>
            </div>
            {openItemId === item.id && <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-800">Contrôle de {item.site}</p><p className="mt-1 text-xs text-slate-500">{item.scanned} élément{item.scanned > 1 ? 's' : ''} vérifié{item.scanned > 1 ? 's' : ''} sur {item.total} · {unsyncedIds.includes(item.id) ? 'En attente de synchronisation' : 'Synchronisé'}</p>
                {item.status !== 'Validé' && <div className="mt-3 flex flex-wrap gap-2"><select aria-label="Actif à inventorier" className="h-9 min-w-52 rounded-lg border border-slate-200 bg-white px-2 text-xs" value={selectedAssetId} onChange={(event) => setSelectedAssetId(event.target.value)}>{assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.code} · {asset.name}</option>)}</select><select aria-label="Mode d’identification" className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs" value={scanMethod} onChange={(event) => setScanMethod(event.target.value)}><option>QR Code</option><option>Code-barres</option><option>RFID</option></select><Button size="sm" className="gap-2" disabled={(scannedAssets[item.id] ?? []).includes(selectedAssetId)} onClick={() => recordScan(item.id)}><ScanLine className="h-4 w-4" />Simuler le scan</Button></div>}
                {(scannedAssets[item.id] ?? []).length > 0 && <p className="mt-2 text-xs text-emerald-800">Identifiés : {(scannedAssets[item.id] ?? []).map((id) => assets.find((asset) => asset.id === id)?.code).filter(Boolean).join(', ')} · {scanMethod} simulé</p>}
                {item.status === 'Anomalie' && <p className="mt-2 text-xs text-red-700">Non inventoriés selon le contrôle : {Math.max(item.total - item.scanned, 0)} actif(s). Poursuivez les scans avant synchronisation.</p>}
              </div>
              <Button size="sm" disabled={item.status === 'Validé' || (scannedAssets[item.id] ?? []).length === 0} onClick={() => validateInventory(item.id)}>{item.status === 'Validé' ? 'Contrôle validé' : 'Valider le contrôle'}</Button>
            </div>}
          </Card>
        ))}
      </div>
    </div>
  )
}
