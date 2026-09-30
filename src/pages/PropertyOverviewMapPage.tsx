import { useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowUpRight, MapPinned } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Asset } from '@/types'

export function PropertyOverviewMapPage({ assets, onNavigate }: { assets: Asset[]; onNavigate: (path: string) => void }) {
  const [regionFilter, setRegionFilter] = useState('Toutes les régions')
  const locatedProperties = assets.filter((asset) => asset.buildingDetails || asset.landDetails)
  const regions = [...new Set(locatedProperties.map((asset) => asset.region ?? 'Région non renseignée'))]
  const visibleProperties = locatedProperties.filter((asset) => regionFilter === 'Toutes les régions' || (asset.region ?? 'Région non renseignée') === regionFilter)
  const center = visibleProperties[0]
  const initialPosition = center?.buildingDetails
    ? [center.buildingDetails.latitude, center.buildingDetails.longitude] as [number, number]
    : center?.landDetails
      ? [center.landDetails.latitude, center.landDetails.longitude] as [number, number]
      : [0.39, 9.45] as [number, number]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Immobilier d’État</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">Cartographie du patrimoine</h2><p className="mt-1 text-sm text-slate-500">Bâtiments et terrains · coordonnées de démonstration</p></div>
        <label className="text-sm font-medium text-slate-700">Région<select aria-label="Filtrer par région" className="ml-2 h-10 rounded-lg border border-slate-200 bg-white px-3" value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)}><option>Toutes les régions</option>{regions.map((region) => <option key={region}>{region}</option>)}</select></label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-slate-500">Biens localisés</p><p className="mt-2 text-2xl font-semibold text-slate-900">{visibleProperties.length}</p></Card>
        <Card><p className="text-xs text-slate-500">Valeur représentée</p><p className="mt-2 text-xl font-semibold text-slate-900">{visibleProperties.reduce((sum, asset) => sum + asset.value, 0).toLocaleString('fr-FR')} FCFA</p></Card>
        <Card><p className="text-xs text-slate-500">Types</p><p className="mt-2 text-sm font-semibold text-slate-900">{[...new Set(visibleProperties.map((asset) => asset.type))].join(' · ') || 'Aucun'}</p></Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div aria-label="Carte des bâtiments et terrains" className="h-[min(560px,70vh)] min-h-[320px] w-full">
          <MapContainer center={initialPosition} zoom={11} scrollWheelZoom className="h-full w-full">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {visibleProperties.map((asset) => {
              const coordinates = asset.buildingDetails
                ? [asset.buildingDetails.latitude, asset.buildingDetails.longitude] as [number, number]
                : [asset.landDetails!.latitude, asset.landDetails!.longitude] as [number, number]
              const address = asset.buildingDetails?.address ?? asset.landDetails?.address ?? asset.location
              return <CircleMarker key={asset.id} center={coordinates} radius={10} pathOptions={{ color: '#064e3b', fillColor: asset.type === 'Terrain' ? '#f59e0b' : '#10b981', fillOpacity: 0.9, weight: 3 }}>
                <Tooltip direction="top">{asset.name}</Tooltip>
                <Popup><div className="min-w-52 space-y-1"><strong>{asset.name}</strong><div>{asset.type} · {asset.location}, {asset.region ?? 'Région non renseignée'}</div><div>{address}</div><div>Affectataire : {asset.assignedTo}</div><div>Valeur : {asset.value.toLocaleString('fr-FR')} FCFA</div><div>Statut : {asset.status}</div><Button size="sm" className="mt-2 gap-2" onClick={() => onNavigate(`/assets/${asset.id}`)}>Ouvrir la fiche <ArrowUpRight className="h-3.5 w-3.5" /></Button></div></Popup>
              </CircleMarker>
            })}
          </MapContainer>
        </div>
      </Card>
      {visibleProperties.length === 0 && <Card className="flex items-center gap-3 text-sm text-slate-600"><MapPinned className="h-5 w-5 text-emerald-700" />Aucun bâtiment ou terrain n’a de coordonnées dans cette sélection.</Card>}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{visibleProperties.map((asset) => <Card key={asset.id} className="flex min-w-0 items-center justify-between gap-3"><div className="min-w-0"><p className="text-xs text-slate-500">{asset.type} · {asset.region ?? 'Région non renseignée'}</p><p className="mt-1 break-words font-medium text-slate-900">{asset.name}</p><p className="mt-1 break-words text-xs text-slate-500">{asset.assignedTo} · {asset.status}</p></div><Button variant="secondary" size="icon" className="shrink-0" aria-label={`Ouvrir ${asset.name}`} onClick={() => onNavigate(`/assets/${asset.id}`)}><ArrowUpRight className="h-4 w-4" /></Button></Card>)}</div>
    </div>
  )
}