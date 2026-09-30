import { useState, type FormEvent } from 'react'
import { Download, Plus, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { downloadCsv } from '@/lib/utils'
import type { Asset } from '@/types'

const statusClasses = {
  'En service': 'bg-emerald-100 text-emerald-700',
  'En maintenance': 'bg-amber-100 text-amber-700',
  'À reformer': 'bg-red-100 text-red-700',
  'Hors service': 'bg-slate-200 text-slate-700',
  'Occupé': 'bg-emerald-100 text-emerald-700',
  'Disponible': 'bg-sky-100 text-sky-700',
  Maintenance: 'bg-amber-100 text-amber-700',
}

const standardTypes = ['Équipement informatique', 'Parc automobile', 'Matériel bureautique', 'Mobilier de bureau', 'Infrastructure IT', 'Équipement de sécurité', 'Immeuble', 'Terrain', 'Appartement']

export function AssetsPage({ assets: assetRows, onAddAsset, searchTerm, onSearchChange, onNavigate }: { assets: Asset[]; onAddAsset: (asset: Asset) => void; searchTerm: string; onSearchChange: (value: string) => void; onNavigate: (path: string) => void }) {
  const [typeFilter, setTypeFilter] = useState('Tous les types')
  const [statusFilter, setStatusFilter] = useState('Tous les statuts')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newAssetType, setNewAssetType] = useState('Équipement informatique')
  const buildings = assetRows.filter((asset) => asset.type === 'Immeuble')
  const typeOptions = [...new Set([...standardTypes, ...assetRows.map((asset) => asset.type)])]

  const filteredAssets = assetRows.filter((asset) => {
    const parentBuilding = asset.apartmentDetails && assetRows.find((building) => building.id === asset.apartmentDetails?.buildingId)
    const searchable = `${asset.code} ${asset.name} ${asset.type} ${asset.department} ${asset.location} ${asset.region ?? ''} ${asset.buildingDetails?.address ?? ''} ${asset.landDetails?.address ?? ''} ${asset.apartmentDetails?.number ?? ''} ${asset.apartmentDetails?.occupant ?? ''} ${parentBuilding?.name ?? ''}`.toLocaleLowerCase('fr')
    return searchable.includes(searchTerm.toLocaleLowerCase('fr'))
      && (typeFilter === 'Tous les types' || asset.type === typeFilter)
      && (statusFilter === 'Tous les statuts' || asset.status === statusFilter)
  })

  const exportAssets = () => {
    const columns = ['Code', 'Libellé', 'Type', 'Service', 'Localisation', 'Valeur FCFA', 'Statut', 'Mise à jour']
    const rows = filteredAssets.map((asset) => [asset.code, asset.name, asset.type, asset.department, asset.location, asset.value, asset.status, asset.lastUpdated])
    downloadCsv('registre-patrimoine.csv', [columns, ...rows])
  }

  const addAsset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const selectedType = String(values.get('type'))
    const parent = assetRows.find((asset) => asset.id === String(values.get('buildingId')))
    const apartmentNumber = String(values.get('number') ?? '')
    const buildingDetails = selectedType === 'Immeuble' ? {
      address: String(values.get('address')),
      floorCount: Number(values.get('floorCount')),
      apartmentCount: Number(values.get('apartmentCount')),
      areaM2: Number(values.get('areaM2')),
      latitude: Number(values.get('latitude')),
      longitude: Number(values.get('longitude')),
    } : undefined
    const apartmentDetails = selectedType === 'Appartement' ? {
      buildingId: String(values.get('buildingId')),
      number: apartmentNumber,
      floor: Number(values.get('floor')),
      areaM2: Number(values.get('areaM2')),
      roomCount: Number(values.get('roomCount')),
      occupant: String(values.get('occupant') ?? '').trim() || undefined,
    } : undefined
    const landDetails = selectedType === 'Terrain' ? {
      address: String(values.get('address')),
      areaM2: Number(values.get('areaM2')),
      latitude: Number(values.get('latitude')),
      longitude: Number(values.get('longitude')),
    } : undefined
    const prefix = selectedType === 'Immeuble' ? 'PAT-IMM' : selectedType === 'Terrain' ? 'PAT-TER' : selectedType === 'Appartement' ? 'PAT-APP' : `PAT-${new Date().getFullYear()}`
    const nextNumber = assetRows.filter((asset) => asset.type === selectedType).length + 1
    const newAsset: Asset = {
      id: crypto.randomUUID(),
      code: `${prefix}-${String(nextNumber).padStart(3, '0')}`,
      name: selectedType === 'Appartement' ? `Appartement administratif ${apartmentNumber}` : String(values.get('name')),
      type: selectedType,
      department: parent?.department ?? String(values.get('department')),
      location: parent?.location ?? String(values.get('location')),
      region: parent?.region ?? String(values.get('region') ?? ''),
      value: Number(values.get('value')),
      status: selectedType === 'Appartement' ? String(values.get('status')) as Asset['status'] : 'En service',
      lastUpdated: new Date().toISOString().slice(0, 10),
      condition: 100,
      assignedTo: apartmentDetails?.occupant ?? 'À affecter',
      buildingDetails,
      apartmentDetails,
      landDetails,
    }
    onAddAsset(newAsset)
    onSearchChange('')
    setTypeFilter('Tous les types')
    setStatusFilter('Tous les statuts')
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Référentiel central des biens publics</p>
          <p className="mt-1 text-sm font-medium text-slate-700">{filteredAssets.length} actif{filteredAssets.length > 1 ? 's' : ''} affiché{filteredAssets.length > 1 ? 's' : ''}</p>
        </div>
      </div>
      <Card className="p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 md:flex-row">
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" aria-label="Rechercher dans le patrimoine" placeholder="Code, libellé, service ou ville" value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} />
            </div>
            <select aria-label="Filtrer par type" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option>Tous les types</option>
              {typeOptions.map((type) => <option key={type}>{type}</option>)}
            </select>
            <select aria-label="Filtrer par statut" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>Tous les statuts</option>
              <option>En service</option>
              <option>En maintenance</option>
              <option>À reformer</option>
              <option>Hors service</option>
              <option>Occupé</option>
              <option>Disponible</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" className="gap-2" onClick={exportAssets}>
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Libellé</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Localisation</th>
                <th className="px-4 py-3 font-medium">Région</th>
                <th className="px-4 py-3 font-medium">Valeur</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Mise à jour</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-t border-slate-200 transition-colors hover:bg-emerald-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{asset.code}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => onNavigate(`/assets/${asset.id}`)} className="text-left font-medium text-slate-800 decoration-emerald-700 underline-offset-4 hover:text-emerald-800 hover:underline">{asset.name}</button>
                  </td>
                  <td className="px-4 py-3">{asset.type}</td>
                  <td className="px-4 py-3">{asset.department}</td>
                  <td className="px-4 py-3">{asset.location}</td>
                  <td className="px-4 py-3">{asset.region ?? '—'}</td>
                  <td className="px-4 py-3">{asset.value.toLocaleString('fr-FR')} FCFA</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-medium ${statusClasses[asset.status]}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">{asset.lastUpdated}</td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">Aucun actif ne correspond à cette recherche.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="add-asset-title" onKeyDown={(event) => { if (event.key === 'Escape') setIsAddOpen(false) }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl md:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Nouveau patrimoine</p><h2 id="add-asset-title" className="mt-1 text-xl font-semibold text-slate-900">Enregistrer un actif</h2></div>
              <Button variant="ghost" size="icon" aria-label="Fermer" onClick={() => setIsAddOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <form onSubmit={addAsset} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Type d’actif<select name="type" value={newAssetType} onChange={(event) => setNewAssetType(event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">
                <option value="Équipement informatique">Équipement informatique</option>
                <option value="Parc automobile">Véhicule</option>
                <option value="Matériel bureautique">Matériel bureautique</option>
                <option value="Mobilier de bureau">Mobilier</option>
                <option value="Infrastructure IT">Infrastructure IT</option>
                <option value="Équipement de sécurité">Équipement de sécurité</option>
                <option value="Immeuble">Immeuble</option>
                <option value="Terrain">Terrain</option>
                <option value="Appartement">Appartement</option>
              </select></label>
              {newAssetType !== 'Appartement' && <label className="block text-sm font-medium text-slate-700">{newAssetType === 'Immeuble' ? 'Nom de l’immeuble' : newAssetType === 'Terrain' ? 'Nom du terrain' : 'Libellé'}<Input autoFocus className="mt-1.5" name="name" required placeholder={newAssetType === 'Immeuble' ? 'Ex. Immeuble administratif Akanda' : newAssetType === 'Terrain' ? 'Ex. Terrain administratif' : 'Ex. Ordinateur portable'} /></label>}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">Valeur (FCFA)<Input className="mt-1.5" name="value" type="number" min="0" required placeholder="0" /></label>
                {newAssetType !== 'Appartement' && <label className="block text-sm font-medium text-slate-700">Service / ministère<Input className="mt-1.5" name="department" required placeholder="Ministère ou direction" /></label>}
                {newAssetType !== 'Appartement' && <label className="block text-sm font-medium text-slate-700">Ville<Input className="mt-1.5" name="location" required placeholder="Libreville" /></label>}
                {newAssetType !== 'Appartement' && <label className="block text-sm font-medium text-slate-700">Région<Input className="mt-1.5" name="region" required placeholder="Estuaire" /></label>}
                {newAssetType === 'Immeuble' && <>
                  <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Adresse complète<Input className="mt-1.5" name="address" required placeholder="Rue, quartier, repère" /></label>
                  <label className="block text-sm font-medium text-slate-700">Nombre d’étages<Input className="mt-1.5" name="floorCount" type="number" min="0" required placeholder="4" /></label>
                  <label className="block text-sm font-medium text-slate-700">Nombre d’appartements<Input className="mt-1.5" name="apartmentCount" type="number" min="0" required placeholder="0" /></label>
                  <label className="block text-sm font-medium text-slate-700">Superficie (m²)<Input className="mt-1.5" name="areaM2" type="number" min="1" required placeholder="1 200" /></label>
                  <label className="block text-sm font-medium text-slate-700">Latitude GPS<Input className="mt-1.5" name="latitude" type="number" step="any" required defaultValue="0.5124" /></label>
                  <label className="block text-sm font-medium text-slate-700">Longitude GPS<Input className="mt-1.5" name="longitude" type="number" step="any" required defaultValue="9.4561" /></label>
                </>}
                {newAssetType === 'Terrain' && <>
                  <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Adresse complète<Input className="mt-1.5" name="address" required placeholder="Quartier, ville, repère" /></label>
                  <label className="block text-sm font-medium text-slate-700">Superficie (m²)<Input className="mt-1.5" name="areaM2" type="number" min="1" required placeholder="5 200" /></label>
                  <label className="block text-sm font-medium text-slate-700">Latitude GPS<Input className="mt-1.5" name="latitude" type="number" step="any" required placeholder="0.3921" /></label>
                  <label className="block text-sm font-medium text-slate-700">Longitude GPS<Input className="mt-1.5" name="longitude" type="number" step="any" required placeholder="9.4536" /></label>
                </>}
                {newAssetType === 'Appartement' && <>
                  <label className="block text-sm font-medium text-slate-700 sm:col-span-2">Immeuble parent<select name="buildingId" required className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">{buildings.map((building) => <option key={building.id} value={building.id}>{building.name}</option>)}</select></label>
                  <label className="block text-sm font-medium text-slate-700">Numéro<Input autoFocus className="mt-1.5" name="number" required placeholder="A301" /></label>
                  <label className="block text-sm font-medium text-slate-700">Étage<Input className="mt-1.5" name="floor" type="number" min="0" required placeholder="3" /></label>
                  <label className="block text-sm font-medium text-slate-700">Superficie (m²)<Input className="mt-1.5" name="areaM2" type="number" min="1" required placeholder="90" /></label>
                  <label className="block text-sm font-medium text-slate-700">Nombre de pièces<Input className="mt-1.5" name="roomCount" type="number" min="1" required placeholder="4" /></label>
                  <label className="block text-sm font-medium text-slate-700">Statut<select name="status" className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"><option>Disponible</option><option>Occupé</option><option>Maintenance</option></select></label>
                  <label className="block text-sm font-medium text-slate-700">Occupant (facultatif)<Input className="mt-1.5" name="occupant" placeholder="Nom du service ou de l’occupant" /></label>
                </>}
              </div>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <Button variant="secondary" onClick={() => setIsAddOpen(false)}>Annuler</Button>
                <Button type="submit">Enregistrer l’actif</Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
