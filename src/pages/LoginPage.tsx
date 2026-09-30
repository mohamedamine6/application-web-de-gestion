import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { assets, userProfiles } from '@/data/mockData'
import type { UserProfile } from '@/types'

interface LoginPageProps {
  onLogin: (user: UserProfile) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const totalValue = assets.reduce((total, asset) => total + asset.value, 0)
  const obsolescenceRate = Math.round(assets.filter((asset) => asset.condition < 50).length / assets.length * 100)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-slate-950 p-8 text-white lg:p-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold">D</div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Direction générale</div>
                <div className="text-2xl font-semibold">Patrimoine public</div>
              </div>
            </div>

            <div className="mb-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
                Souveraineté des données • Sécurité publique
              </div>
              <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white">Pilotage numérique du patrimoine de l’État</h1>
              <p className="max-w-md text-sm leading-6 text-slate-300">
                Centralisez l’inventaire, la traçabilité, la maintenance et la réforme des actifs publics dans une plateforme dédiée à la direction générale.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="bg-slate-900/80 p-4 text-slate-200 ring-1 ring-slate-700">
                <div className="text-2xl font-semibold text-white">{assets.length}</div>
                <div className="mt-2 text-xs text-slate-300">actifs suivis</div>
              </Card>
              <Card className="bg-slate-900/80 p-4 text-slate-200 ring-1 ring-slate-700">
                <div className="text-2xl font-semibold text-white">{new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(totalValue)}</div>
                <div className="mt-2 text-xs text-slate-300">valeur patrimoniale</div>
              </Card>
              <Card className="bg-slate-900/80 p-4 text-slate-200 ring-1 ring-slate-700">
                <div className="text-2xl font-semibold text-white">{obsolescenceRate}%</div>
                <div className="mt-2 text-xs text-slate-300">taux de vétusté</div>
              </Card>
            </div>
          </div>

          <div className="bg-slate-50 p-8 lg:p-10">
            <div className="mb-8">
              <div className="text-sm font-medium text-slate-500">Accès démonstration</div>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Connexion</h2>
            </div>

            <div className="space-y-4">
              {userProfiles.map((profile) => (
                <button
                  key={profile.email}
                  type="button"
                  onClick={() => onLogin(profile)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{profile.name}</div>
                    <div className="text-xs text-slate-500">{profile.role}</div>
                  </div>
                  <div className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">
                    Choisir
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Button className="w-full gap-2" onClick={() => onLogin(userProfiles[0])}>
                Accéder au prototype
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
