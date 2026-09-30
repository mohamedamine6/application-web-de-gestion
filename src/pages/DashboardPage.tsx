import { Activity, ArrowUpRight, AlertTriangle, BriefcaseBusiness, Gauge, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { assets as mockAssets, dashboardMetrics, inventoryItems, maintenanceRequests, recentActivities, alerts, reformItems, valueTrend } from '@/data/mockData'
import type { Asset } from '@/types'

const toneClasses = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
}

const alertLabels: Record<string, string> = { danger: 'Critique', warning: 'Vigilance', info: 'Information' }

export function DashboardPage({ onNavigate, assets: assetRows = mockAssets }: { onNavigate: (path: string) => void; assets?: Asset[] }) {
  const totalValue = assetRows.reduce((total, asset) => total + asset.value, 0)
  const obsolescenceRate = Math.round(assetRows.filter((asset) => asset.condition < 50).length / assetRows.length * 100)
  const metricValues: Record<string, string> = {
    'Valeur totale': `${new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(totalValue)} FCFA`,
    Actifs: String(assetRows.length),
    'Taux de vétusté': `${obsolescenceRate}%`,
    Maintenance: String(maintenanceRequests.filter((request) => request.status !== 'Clôturée').length),
    Réformes: String(reformItems.filter((item) => item.status !== 'Validée').length),
    'Non affectés': String(assetRows.filter((asset) => asset.assignedTo === 'À affecter').length),
  }
  const metrics = [...dashboardMetrics.map((metric) => ({ ...metric, value: metricValues[metric.label] ?? metric.value, delta: metricValues[metric.label] ? 'Données mockées' : metric.delta })), { label: 'Biens immobiliers', value: String(assetRows.filter((asset) => ['Immeuble', 'Appartement', 'Terrain'].includes(asset.type)).length), delta: 'Registre', trend: 'up' as const, tone: 'green' as const }, { label: 'Campagnes inventaire', value: String(inventoryItems.length), delta: 'Suivi terrain', trend: 'up' as const, tone: 'blue' as const }]
  const ministryBreakdown = [...assetRows.reduce((counts, asset) => counts.set(asset.department, (counts.get(asset.department) ?? 0) + 1), new Map<string, number>())].map(([label, count]) => ({ label, value: Math.round(count / assetRows.length * 100) })).sort((first, second) => second.value - first.value).slice(0, 5)
  const regionalBreakdown = [...assetRows.reduce((counts, asset) => counts.set(asset.region ?? 'Région non renseignée', (counts.get(asset.region ?? 'Région non renseignée') ?? 0) + 1), new Map<string, number>())].map(([label, count]) => ({ label, value: Math.round(count / assetRows.length * 100) })).sort((first, second) => second.value - first.value).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">{metric.label}</div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${toneClasses[metric.tone]}`}>
                {metric.delta}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div className="text-2xl font-semibold text-slate-900">{metric.value}</div>
              <div className="text-slate-400">
                {metric.trend === 'up' ? <ArrowUpRight className="h-4 w-4 text-emerald-600" /> : <TrendingUp className="h-4 w-4 rotate-180 text-amber-600" />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Performance</div>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Évolution de la valeur du patrimoine</h2>
            </div>
            <Button variant="secondary" size="sm" onClick={() => onNavigate('/reports')}>Voir détails</Button>
          </div>

          <div className="flex h-60 items-end gap-3">
            {valueTrend.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-400" style={{ height: `${point.value * 5}px` }} />
                </div>
                <span className="text-xs text-slate-500">{point.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Répartition</div>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Par ministère</h2>
            </div>
          </div>

          <div className="space-y-5">
            <div><h3 className="mb-3 text-sm font-medium text-slate-700">Par ministère</h3><div className="space-y-3">{ministryBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-700" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}</div></div>
            <div><h3 className="mb-3 border-t border-slate-100 pt-4 text-sm font-medium text-slate-700">Par région</h3><div className="space-y-3">{regionalBreakdown.map((item) => <div key={item.label}><div className="mb-1 flex items-center justify-between text-sm text-slate-600"><span>{item.label}</span><span>{item.value}%</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-600" style={{ width: `${item.value}%` }} /></div></div>)}</div></div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Activité</div>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">Événements récents</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/reports')}>Voir tout</Button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-slate-900">{activity.title}</div>
                    <div className="text-xs text-slate-400">{activity.time}</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{activity.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Alerte</div>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Alertes</h2>
              </div>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-slate-800">{alert.title}</div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${alert.level === 'danger' ? 'bg-red-100 text-red-700' : alert.level === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      {alertLabels[alert.level]}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{alert.detail}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Raccourcis</div>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Actions rapides</h2>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start gap-2 bg-slate-100" onClick={() => onNavigate('/assets')}>
                <BriefcaseBusiness className="h-4 w-4" />
                Voir actifs critiques
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2 bg-slate-100" onClick={() => onNavigate('/inventory')}>
                <Gauge className="h-4 w-4" />
                Créer un inventaire
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2 bg-slate-100" onClick={() => onNavigate('/reports')}>
                <TrendingUp className="h-4 w-4" />
                Consulter les rapports
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
