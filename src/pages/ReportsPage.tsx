import { Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { assets as mockAssets, inventoryItems, maintenanceRequests, reformItems, reportsSeries } from '@/data/mockData'
import type { Asset } from '@/types'
import { downloadCsv } from '@/lib/utils'

export function ReportsPage({ assets = mockAssets }: { assets?: Asset[] }) {
  const totalValue = assets.reduce((total, asset) => total + asset.value, 0)
  const obsoleteAssets = assets.filter((asset) => asset.condition < 50).length
  const regions = [...new Set(assets.map((asset) => asset.region ?? 'Région non renseignée'))]
  const exportReport = () => {
    downloadCsv('rapport-patrimoine.csv', [['Indicateur', 'Valeur'], ['Valeur totale des actifs', totalValue], ['Nombre de biens', assets.length], ['Biens en état critique', obsoleteAssets], ['Campagnes inventaire', inventoryItems.length], ['Maintenances ouvertes', maintenanceRequests.filter((request) => request.status !== 'Clôturée').length], ['Dossiers de réforme actifs', reformItems.filter((item) => item.status !== 'Validée').length], ...regions.map((region) => [`Région ${region}`, assets.filter((asset) => (asset.region ?? 'Région non renseignée') === region).length])])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Reporting</div>
          <h2 className="text-2xl font-semibold text-slate-900">Rapports</h2>
        </div>
        <Button className="gap-2" onClick={exportReport}><Download className="h-4 w-4" />Exporter CSV</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4"><div className="text-sm text-slate-500">Valeur du patrimoine mocké</div><div className="mt-2 text-2xl font-semibold text-slate-900">{new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(totalValue)} FCFA</div></Card>
        <Card className="p-4"><div className="text-sm text-slate-500">Biens avec état inférieur à 50 %</div><div className="mt-2 text-2xl font-semibold text-slate-900">{obsoleteAssets} / {assets.length}</div></Card>
        <Card className="p-4"><div className="text-sm text-slate-500">Régions représentées</div><div className="mt-2 text-2xl font-semibold text-slate-900">{regions.length}</div></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-5">
          <div className="mb-4 text-lg font-semibold text-slate-900">Évolution des actifs</div>
          <div className="flex h-60 items-end gap-3">
            {reportsSeries.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex w-full items-end justify-center">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-400" style={{ height: `${point.value * 3}px` }} />
                </div>
                <span className="text-xs text-slate-500">{point.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 text-lg font-semibold text-slate-900">Synthèse</div>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-xl bg-slate-50 p-3">Ministère le plus riche : Finance</div>
            <div className="rounded-xl bg-slate-50 p-3">Zone à risque : Oyem</div>
            <div className="rounded-xl bg-slate-50 p-3">Taux d’écart : 2,3%</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
