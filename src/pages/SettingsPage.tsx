import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { settingsRows } from '@/data/mockData'

export function SettingsPage() {
  const [rows, setRows] = useState(settingsRows)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const addReference = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setRows((current) => [...current, { name: String(values.get('name')), count: '0', status: 'À configurer' }])
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Configuration</div>
          <h2 className="text-2xl font-semibold text-slate-900">Paramètres</h2>
        </div>
        <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rows.map((row) => (
          <Card key={row.name} className="p-4">
            <div className="text-sm text-slate-500">{row.name}</div>
            <div className="mt-3 text-2xl font-semibold text-slate-900">{row.count}</div>
            <div className="mt-2 text-xs text-slate-500">{row.status}</div>
          </Card>
        ))}
      </div>
      {isAddOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAddOpen(false) }}>
        <section role="dialog" aria-modal="true" aria-labelledby="reference-title" onKeyDown={(event) => { if (event.key === 'Escape') setIsAddOpen(false) }} className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl md:p-6">
          <h2 id="reference-title" className="text-xl font-semibold text-slate-900">Ajouter un référentiel</h2>
          <p className="mt-1 text-sm text-slate-500">Créez une catégorie à compléter dans la configuration.</p>
          <form onSubmit={addReference} className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">Nom du référentiel<Input autoFocus className="mt-1.5" name="name" required placeholder="Ex. Catégories de biens" /></label>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="secondary" onClick={() => setIsAddOpen(false)}>Annuler</Button><Button type="submit">Ajouter</Button></div>
          </form>
        </section>
      </div>}
    </div>
  )
}
