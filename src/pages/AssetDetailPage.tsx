import { AlertTriangle, ArrowLeft, BedDouble, CheckCircle2, ClipboardList, MapPin, MapPinned, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { maintenanceRequests } from '@/data/mockData'
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

export function AssetDetailPage({ assetId, assets, onNavigate }: { assetId?: string; assets: Asset[]; onNavigate: (path: string) => void }) {
  const asset = assets.find((item) => item.id === assetId) ?? assets[0]
  const maintenance = maintenanceRequests.find((request) => request.assetId === asset.code && request.status !== 'Clôturée')
  const needsAttention = asset.condition < 50 || asset.status === 'À reformer' || asset.status === 'Hors service'
  const linkedApartments = assets.filter((item) => item.type === 'Appartement' && item.apartmentDetails?.buildingId === asset.id)
  const parentBuilding = asset.apartmentDetails ? assets.find((item) => item.id === asset.apartmentDetails?.buildingId) : undefined
  const facts = asset.type === 'Immeuble' && asset.buildingDetails
    ? [
        ['Code', asset.code],
        ['Nom de l’immeuble', asset.name],
        ['Adresse complète', asset.buildingDetails.address],
        ['Ville', asset.location],
        ['Service / ministère', asset.department],
        ['Nombre d’étages', String(asset.buildingDetails.floorCount)],
        ['Nombre d’appartements', String(asset.buildingDetails.apartmentCount)],
        ['Superficie', `${asset.buildingDetails.areaM2.toLocaleString('fr-FR')} m²`],
        ['Valeur', `${asset.value.toLocaleString('fr-FR')} FCFA`],
        ['Statut', asset.status],
        ['Date de mise à jour', asset.lastUpdated],
      ]
    : asset.type === 'Appartement' && asset.apartmentDetails
      ? [
          ['Code', asset.code],
          ['Numéro', asset.apartmentDetails.number],
          ['Immeuble parent', parentBuilding?.name ?? 'Immeuble non renseigné'],
          ['Étage', String(asset.apartmentDetails.floor)],
          ['Superficie', `${asset.apartmentDetails.areaM2.toLocaleString('fr-FR')} m²`],
          ['Nombre de pièces', String(asset.apartmentDetails.roomCount)],
          ['Service / ministère', asset.department],
          ['Occupant', asset.apartmentDetails.occupant ?? 'Disponible'],
          ['Valeur', `${asset.value.toLocaleString('fr-FR')} FCFA`],
          ['Statut', asset.status],
          ['Date de mise à jour', asset.lastUpdated],
        ]
      : [
          ['Code', asset.code],
          ['Type', asset.type],
          ['Service', asset.department],
          ['Localisation', asset.location],
          ['Valeur', `${asset.value.toLocaleString('fr-FR')} FCFA`],
          ['État', `${asset.condition}%`],
        ]
  const trackingRows = [
    { label: 'Statut actuel', detail: asset.status },
    { label: 'Dernière mise à jour', detail: asset.lastUpdated },
    { label: 'Affectation', detail: `${asset.assignedTo} · ${asset.department}` },
    ...(maintenance ? [{ label: 'Maintenance', detail: `${maintenance.title} · ${maintenance.date}` }] : []),
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="gap-2 rounded-xl border border-slate-200 bg-white" onClick={() => onNavigate('/assets')}>
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{asset.type === 'Immeuble' ? 'Fiche immobilière' : asset.type === 'Appartement' ? 'Lot immobilier' : 'Fiche patrimoine'}</div>
            <h2 className="text-2xl font-semibold text-slate-900">{asset.name}</h2>
          </div>
        </div>

        <div className="flex gap-2">
          {asset.type === 'Immeuble' && <>
            <Button variant="secondary" className="gap-2" onClick={() => onNavigate(`/assets/${asset.id}/map`)}><MapPinned className="h-4 w-4" />Voir sur la carte</Button>
            <Button className="gap-2" onClick={() => onNavigate(`/assets/${asset.id}/apartments`)}><BedDouble className="h-4 w-4" />Voir les appartements ({linkedApartments.length})</Button>
          </>}
          {asset.type === 'Appartement' && parentBuilding && <Button variant="secondary" onClick={() => onNavigate(`/assets/${parentBuilding.id}`)}>Voir l’immeuble</Button>}
          {asset.type !== 'Immeuble' && asset.type !== 'Appartement' && <>
            <Button variant="secondary" onClick={() => onNavigate('/maintenance')}>Créer une demande</Button>
            <Button onClick={() => onNavigate('/reform')}>Préparer une réforme</Button>
          </>}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-500">Fiche technique</div>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusClasses[asset.status]}`}>
                {asset.status}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {facts.map(([label, value]) => <div key={label} className={label === 'Adresse complète' ? 'sm:col-span-2' : ''}><div className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</div><div className="mt-1 break-words text-sm font-medium text-slate-900">{value}</div></div>)}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-700" />
              <h3 className="text-lg font-semibold text-slate-900">Suivi du bien</h3>
            </div>

            <div className="space-y-3">
              {trackingRows.map((row) => (
                <div key={row.label} className="flex flex-col justify-between gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:flex-row sm:items-center">
                  <div className="text-sm font-medium text-slate-700">{row.label}</div>
                  <div className="text-sm text-slate-500 sm:text-right">{row.detail}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Affectation</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div><span className="font-medium text-slate-800">Ministère :</span> {asset.department}</div>
              <div><span className="font-medium text-slate-800">Responsable :</span> {asset.assignedTo}</div>
              <div><span className="font-medium text-slate-800">Dernière mise à jour :</span> {asset.lastUpdated}</div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-600" />
              <h3 className="text-lg font-semibold text-slate-900">Maintenance</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              {maintenance ? <>
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">{maintenance.title}</div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">Priorité : {maintenance.priority}</div>
                <div className="rounded-lg bg-slate-50 px-3 py-2">Assignée à : {maintenance.assignedTo}</div>
              </> : <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">Aucune demande en cours pour cet actif.</div>}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              {needsAttention ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
              <h3 className="text-lg font-semibold text-slate-900">{needsAttention ? 'Point de vigilance' : 'État du bien'}</h3>
            </div>
            <div className={`rounded-lg p-3 text-sm ${needsAttention ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-900'}`}>
              {needsAttention ? 'L’état du bien appelle une expertise. Une réforme ou un renouvellement peut être envisagé.' : `Le bien est déclaré « ${asset.status.toLocaleLowerCase('fr')} » avec un état estimé à ${asset.condition} %.`}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
