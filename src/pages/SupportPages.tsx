import { Fragment, useMemo, useState, type FormEvent } from 'react'
import { Download, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { accessRecords, assetMovements, financialEntries, intraPosts, purchaseRequests, staffMembers, stockItems, suppliers } from '@/data/mockData'
import { downloadCsv } from '@/lib/utils'

type Row = Record<string, string | number>
interface Column { key: string; label: string }
interface Field { key: string; label: string; type?: 'text' | 'number' | 'date'; placeholder?: string }
interface ModuleConfig {
  title: string
  eyebrow: string
  description: string
  columns: Column[]
  rows: Row[]
  fields: Field[]
  filterKey?: string
}

function DataModulePage({ config }: { config: ModuleConfig }) {
  const [rows, setRows] = useState(config.rows)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Tous')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const filterOptions = [...new Set(rows.map((row) => String(row[config.filterKey ?? 'status'] ?? '')).filter(Boolean))]
  const visibleRows = useMemo(() => rows.filter((row) => {
    const matchesSearch = Object.values(row).join(' ').toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr'))
    const matchesFilter = filter === 'Tous' || String(row[config.filterKey ?? 'status'] ?? '') === filter
    return matchesSearch && matchesFilter
  }), [config.filterKey, filter, rows, search])

  const addRow = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    const row: Row = { id: `${config.title.slice(0, 3).toLocaleUpperCase()}-${String(Date.now()).slice(-5)}` }
    for (const field of config.fields) row[field.key] = String(values.get(field.key) ?? '')
    if (!row.status && filterOptions.length) row.status = filterOptions[0]
    setRows((current) => [row, ...current])
    setIsAdding(false)
  }

  const adjustStock = (id: string, delta: number) => {
    setRows((current) => current.map((row) => {
      if (String(row.id) !== id) return row
      const quantity = Math.max(0, Number(row.quantity ?? 0) + delta)
      const threshold = Number(row.threshold ?? 0)
      return { ...row, quantity, status: quantity === 0 ? 'Rupture' : quantity <= threshold ? 'Stock faible' : 'Disponible' }
    }))
  }

  const exportRows = () => downloadCsv(`${config.title.toLocaleLowerCase('fr').replaceAll(' ', '-')}.csv`, [config.columns.map((column) => column.label), ...visibleRows.map((row) => config.columns.map((column) => row[column.key] ?? ''))])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{config.eyebrow}</p><h2 className="mt-1 text-2xl font-semibold text-slate-900">{config.title}</h2><p className="mt-1 text-sm text-slate-500">{config.description}</p></div>
        <div className="flex gap-2"><Button variant="secondary" className="gap-2" onClick={exportRows}><Download className="h-4 w-4" />Exporter</Button><Button className="gap-2" onClick={() => setIsAdding(true)}><Plus className="h-4 w-4" />Ajouter</Button></div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card><p className="text-xs text-slate-500">Enregistrements</p><p className="mt-2 text-2xl font-semibold text-slate-900">{rows.length}</p></Card>
        <Card><p className="text-xs text-slate-500">Résultats affichés</p><p className="mt-2 text-2xl font-semibold text-slate-900">{visibleRows.length}</p></Card>
        <Card><p className="text-xs text-slate-500">Valeur / quantité</p><p className="mt-2 text-2xl font-semibold text-slate-900">{rows.reduce((sum, row) => sum + Number(row.amount ?? row.quantity ?? 0), 0).toLocaleString('fr-FR')}</p></Card>
      </div>

      <Card className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input aria-label={`Rechercher ${config.title}`} className="pl-9" placeholder="Rechercher dans les enregistrements" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
          <select aria-label="Filtrer les résultats" className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Tous</option>{filterOptions.map((option) => <option key={option}>{option}</option>)}</select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto"><table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600"><tr>{config.columns.map((column) => <th key={column.key} className="whitespace-nowrap px-4 py-3 font-medium">{column.label}</th>)}</tr></thead>
          <tbody>{visibleRows.map((row) => <Fragment key={String(row.id)}><tr onClick={() => setExpandedId((current) => current === String(row.id) ? null : String(row.id))} className="cursor-pointer border-t border-slate-200 hover:bg-emerald-50/50">{config.columns.map((column) => <td key={column.key} className="whitespace-nowrap px-4 py-3 text-slate-700">{column.key === 'amount' ? `${Number(row[column.key]).toLocaleString('fr-FR')} FCFA` : String(row[column.key] ?? '—')}</td>)}</tr>{expandedId === String(row.id) && <tr className="border-t border-slate-100 bg-slate-50"><td colSpan={config.columns.length} className="px-4 py-3"><dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(row).map(([key, value]) => <div key={key}><dt className="text-xs uppercase text-slate-400">{key}</dt><dd className="mt-1 text-sm text-slate-700">{String(value)}</dd></div>)}</dl>{config.title === 'Stocks' && <div className="mt-3 flex gap-2"><Button size="sm" variant="secondary" onClick={() => adjustStock(String(row.id), 1)}>Enregistrer une entrée</Button><Button size="sm" variant="secondary" disabled={Number(row.quantity) === 0} onClick={() => adjustStock(String(row.id), -1)}>Enregistrer une sortie</Button></div>}</td></tr>}</Fragment>)}
            {visibleRows.length === 0 && <tr><td colSpan={config.columns.length} className="px-4 py-10 text-center text-slate-500">Aucun résultat</td></tr>}
          </tbody>
        </table></div>
      </Card>

      {isAdding && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsAdding(false) }}><section role="dialog" aria-modal="true" aria-labelledby="module-create-title" onKeyDown={(event) => { if (event.key === 'Escape') setIsAdding(false) }} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-5 shadow-2xl"><h3 id="module-create-title" className="text-xl font-semibold text-slate-900">Ajouter · {config.title}</h3><form onSubmit={addRow} className="mt-5 space-y-4">{config.fields.map((field) => <label key={field.key} className="block text-sm font-medium text-slate-700">{field.label}<Input className="mt-1.5" name={field.key} type={field.type ?? 'text'} required placeholder={field.placeholder} /></label>)}<div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="secondary" onClick={() => setIsAdding(false)}>Annuler</Button><Button type="submit">Enregistrer</Button></div></form></section></div>}
      <p className="text-xs text-slate-400">Données de démonstration · saisies conservées uniquement dans cette session.</p>
    </div>
  )
}

const movementRows: Row[] = assetMovements as unknown as Row[]
export function MovementsPage() { return <DataModulePage config={{ title: 'Mouvements des biens', eyebrow: 'Traçabilité', description: 'Affectations, transferts et changements de localisation des actifs.', columns: [{ key: 'assetId', label: 'Référence' }, { key: 'assetName', label: 'Bien' }, { key: 'type', label: 'Mouvement' }, { key: 'fromLocation', label: 'Origine' }, { key: 'toLocation', label: 'Destination' }, { key: 'user', label: 'Utilisateur' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Statut' }], rows: movementRows, filterKey: 'status', fields: [{ key: 'assetId', label: 'Référence du bien' }, { key: 'assetName', label: 'Bien' }, { key: 'type', label: 'Type de mouvement' }, { key: 'fromLocation', label: 'Ancienne localisation' }, { key: 'toLocation', label: 'Nouvelle localisation' }, { key: 'user', label: 'Utilisateur' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'comment', label: 'Commentaire' }] }} /> }

const staffRows: Row[] = staffMembers as unknown as Row[]
export function HrPage() { return <DataModulePage config={{ title: 'Ressources humaines', eyebrow: 'Ressources', description: 'Répertoire de démonstration des collaborateurs de la DGP.', columns: [{ key: 'id', label: 'Matricule' }, { key: 'name', label: 'Collaborateur' }, { key: 'function', label: 'Fonction' }, { key: 'service', label: 'Service' }, { key: 'direction', label: 'Direction' }, { key: 'region', label: 'Région' }, { key: 'status', label: 'Statut' }], rows: staffRows, fields: [{ key: 'name', label: 'Nom complet' }, { key: 'function', label: 'Fonction' }, { key: 'service', label: 'Service' }, { key: 'direction', label: 'Direction' }, { key: 'region', label: 'Région' }, { key: 'email', label: 'E-mail' }, { key: 'phone', label: 'Téléphone' }, { key: 'status', label: 'Statut' }] }} /> }

const accessRows: Row[] = accessRecords as unknown as Row[]
export function AccessPage() { return <DataModulePage config={{ title: 'Accès & absences', eyebrow: 'Ressources', description: 'Registre mocké des entrées, sorties et absences.', columns: [{ key: 'employee', label: 'Collaborateur' }, { key: 'type', label: 'Événement' }, { key: 'date', label: 'Date' }, { key: 'time', label: 'Heure' }, { key: 'reason', label: 'Motif' }, { key: 'status', label: 'Statut' }], rows: accessRows, fields: [{ key: 'employee', label: 'Collaborateur' }, { key: 'type', label: 'Entrée, sortie ou absence' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'time', label: 'Heure' }, { key: 'reason', label: 'Motif' }, { key: 'status', label: 'Statut' }] }} /> }

const purchaseRows: Row[] = purchaseRequests as unknown as Row[]
export function PurchasesPage() { return <DataModulePage config={{ title: 'Achats', eyebrow: 'Gestion', description: 'Vue de démonstration des demandes et commandes.', columns: [{ key: 'id', label: 'Référence' }, { key: 'subject', label: 'Objet' }, { key: 'supplier', label: 'Fournisseur' }, { key: 'requester', label: 'Demandeur' }, { key: 'date', label: 'Date' }, { key: 'amount', label: 'Montant' }, { key: 'status', label: 'Statut' }], rows: purchaseRows, fields: [{ key: 'subject', label: 'Objet' }, { key: 'supplier', label: 'Fournisseur' }, { key: 'requester', label: 'Demandeur' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'amount', label: 'Montant FCFA', type: 'number' }, { key: 'status', label: 'Statut' }] }} /> }

const stockRows: Row[] = stockItems as unknown as Row[]
export function StocksPage() { return <DataModulePage config={{ title: 'Stocks', eyebrow: 'Gestion', description: 'Articles et niveaux de stock de démonstration.', columns: [{ key: 'id', label: 'Référence' }, { key: 'name', label: 'Article' }, { key: 'category', label: 'Catégorie' }, { key: 'quantity', label: 'Quantité' }, { key: 'threshold', label: 'Seuil' }, { key: 'location', label: 'Emplacement' }, { key: 'status', label: 'État' }], rows: stockRows, fields: [{ key: 'name', label: 'Article' }, { key: 'category', label: 'Catégorie' }, { key: 'quantity', label: 'Quantité', type: 'number' }, { key: 'threshold', label: 'Seuil', type: 'number' }, { key: 'location', label: 'Emplacement' }, { key: 'status', label: 'Statut' }] }} /> }

const financialRows: Row[] = financialEntries as unknown as Row[]
export function FinancePage() { return <DataModulePage config={{ title: 'Finance & comptabilité', eyebrow: 'Gestion', description: 'Suivi financier de démonstration, sans comptabilité réglementaire.', columns: [{ key: 'id', label: 'Référence' }, { key: 'label', label: 'Dépense' }, { key: 'category', label: 'Catégorie' }, { key: 'center', label: 'Centre de coût' }, { key: 'amount', label: 'Montant' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Statut' }], rows: financialRows, fields: [{ key: 'label', label: 'Dépense' }, { key: 'category', label: 'Catégorie' }, { key: 'center', label: 'Centre de coût' }, { key: 'amount', label: 'Montant FCFA', type: 'number' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'status', label: 'Statut' }] }} /> }

const supplierRows: Row[] = suppliers as unknown as Row[]
export function SuppliersPage() { return <DataModulePage config={{ title: 'Fournisseurs', eyebrow: 'Gestion', description: 'Répertoire mocké avec références aux demandes d’achat.', columns: [{ key: 'id', label: 'Référence' }, { key: 'company', label: 'Entreprise' }, { key: 'category', label: 'Catégorie' }, { key: 'contact', label: 'Contact' }, { key: 'phone', label: 'Téléphone' }, { key: 'email', label: 'E-mail' }, { key: 'status', label: 'Statut' }, { key: 'orders', label: 'Commandes' }, { key: 'amount', label: 'Montant cumulé' }], rows: supplierRows, fields: [{ key: 'company', label: 'Entreprise' }, { key: 'category', label: 'Catégorie' }, { key: 'contact', label: 'Contact' }, { key: 'phone', label: 'Téléphone' }, { key: 'email', label: 'E-mail' }, { key: 'status', label: 'Statut' }] }} /> }

const intraRows: Row[] = intraPosts as unknown as Row[]
export function IntraPage() { return <DataModulePage config={{ title: 'Intra', eyebrow: 'Ressources', description: 'Actualités, annonces, documents et ressources internes.', columns: [{ key: 'category', label: 'Type' }, { key: 'title', label: 'Publication' }, { key: 'summary', label: 'Résumé' }, { key: 'author', label: 'Auteur' }, { key: 'date', label: 'Date' }], rows: intraRows, filterKey: 'category', fields: [{ key: 'title', label: 'Titre' }, { key: 'category', label: 'Type' }, { key: 'summary', label: 'Résumé' }, { key: 'author', label: 'Auteur' }, { key: 'date', label: 'Date', type: 'date' }] }} /> }