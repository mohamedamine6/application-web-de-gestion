import { ArrowLeft, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Asset } from '@/types'

const apartmentStatusClasses: Record<string, string> = {
  'Occupé': 'bg-emerald-100 text-emerald-700',
  'Disponible': 'bg-sky-100 text-sky-700',
  'Maintenance': 'bg-amber-100 text-amber-700',
}

interface PropertyApartmentsPageProps {
  building: Asset
  assets: Asset[]
  onNavigate: (path: string) => void
}

export function PropertyApartmentsPage({ building, assets, onNavigate }: PropertyApartmentsPageProps) {
  const apartments = assets.filter((asset) => asset.type === 'Appartement' && asset.apartmentDetails?.buildingId === building.id)

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="shrink-0 gap-2" onClick={() => onNavigate(`/assets/${building.id}`)}>
            <ArrowLeft className="h-4 w-4" />
            Fiche immeuble
          </Button>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Lots immobiliers</p>
            <h2 className="truncate text-xl font-semibold text-slate-900">{building.name}</h2>
          </div>
        </div>
        <span className="text-sm text-slate-500">{apartments.length} appartement{apartments.length === 1 ? '' : 's'}</span>
      </div>

      {apartments.length > 0 ? <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Appartement</th>
                <th className="px-4 py-3 font-medium">Étage</th>
                <th className="px-4 py-3 font-medium">Superficie</th>
                <th className="px-4 py-3 font-medium">Pièces</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Occupant</th>
                <th className="px-4 py-3 font-medium">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((apartment) => <tr key={apartment.id} className="border-t border-slate-200 hover:bg-emerald-50/50">
                <td className="whitespace-nowrap px-4 py-3"><button type="button" className="font-medium text-slate-800 underline-offset-4 hover:text-emerald-800 hover:underline" onClick={() => onNavigate(`/assets/${apartment.id}`)}>{apartment.apartmentDetails?.number}</button></td>
                <td className="px-4 py-3">{apartment.apartmentDetails?.floor}</td>
                <td className="whitespace-nowrap px-4 py-3">{apartment.apartmentDetails?.areaM2.toLocaleString('fr-FR')} m²</td>
                <td className="px-4 py-3">{apartment.apartmentDetails?.roomCount}</td>
                <td className="px-4 py-3"><span className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-medium ${apartmentStatusClasses[apartment.status]}`}>{apartment.status}</span></td>
                <td className="px-4 py-3">{apartment.apartmentDetails?.occupant ?? '—'}</td>
                <td className="whitespace-nowrap px-4 py-3">{apartment.value.toLocaleString('fr-FR')} FCFA</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </Card> : <Card className="flex flex-col items-center p-10 text-center">
        <Building2 className="h-8 w-8 text-slate-400" />
        <p className="mt-3 text-sm font-medium text-slate-800">Aucun appartement rattaché</p>
        <p className="mt-1 text-sm text-slate-500">Ajoutez un appartement depuis le registre Patrimoine.</p>
      </Card>}
    </div>
  )
}