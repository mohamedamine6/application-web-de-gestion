import { ArrowLeft } from 'lucide-react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Asset } from '@/types'

interface PropertyMapPageProps {
  asset: Asset
  onNavigate: (path: string) => void
}

export function PropertyMapPage({ asset, onNavigate }: PropertyMapPageProps) {
  const details = asset.buildingDetails

  if (!details) {
    return <Card className="p-6 text-sm text-slate-600">Les coordonnées de cet immeuble ne sont pas renseignées.</Card>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="shrink-0 gap-2" onClick={() => onNavigate(`/assets/${asset.id}`)}>
            <ArrowLeft className="h-4 w-4" />
            Fiche immeuble
          </Button>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Localisation</p>
            <h2 className="truncate text-xl font-semibold text-slate-900">{asset.name}</h2>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div role="group" aria-label={`Carte géographique de ${asset.name}, ${details.address}`} className="h-[min(460px,65vh)] min-h-[300px] w-full">
          <MapContainer center={[details.latitude, details.longitude]} zoom={16} scrollWheelZoom className="h-full w-full" aria-label={`Carte de ${asset.name}`}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker
              center={[details.latitude, details.longitude]}
              radius={10}
              pathOptions={{ color: '#064e3b', fillColor: '#10b981', fillOpacity: 0.95, weight: 3 }}
            >
              <Tooltip permanent direction="top" opacity={1} offset={[0, -10]}>
                <span className="font-semibold">{asset.name}</span><br />{details.address}
              </Tooltip>
              <Popup>
                <strong>{asset.name}</strong><br />{details.address}, {asset.location}
              </Popup>
            </CircleMarker>
          </MapContainer>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-xs text-slate-500">Adresse</p><p className="mt-1 text-sm font-medium text-slate-800">{details.address}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Ville</p><p className="mt-1 text-sm font-medium text-slate-800">{asset.location}</p></Card>
        <Card className="p-4"><p className="text-xs text-slate-500">Coordonnées GPS · démonstration</p><p className="mt-1 text-sm font-medium text-slate-800">{details.latitude.toFixed(4)}, {details.longitude.toFixed(4)}</p></Card>
      </div>
    </div>
  )
}