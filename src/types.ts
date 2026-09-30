export type Role = 'Direction' | 'Gestionnaire patrimoine' | 'Agent terrain' | 'Comptabilité' | 'Admin'

export type AssetStatus = 'En service' | 'En maintenance' | 'À reformer' | 'Hors service'
export type ApartmentStatus = 'Occupé' | 'Disponible' | 'Maintenance'
export type MaintenanceStatus = 'Ouverte' | 'En cours' | 'Clôturée' | 'Urgente'
export type ReformStatus = 'À valider' | 'Validée' | 'Recyclage' | 'Destruction'

export interface BuildingDetails {
  address: string
  floorCount: number
  apartmentCount: number
  areaM2: number
  latitude: number
  longitude: number
}

export interface ApartmentDetails {
  buildingId: string
  number: string
  floor: number
  areaM2: number
  roomCount: number
  occupant?: string
}

export interface LandDetails {
  address: string
  areaM2: number
  latitude: number
  longitude: number
}

export interface Asset {
  id: string
  code: string
  name: string
  type: string
  department: string
  location: string
  status: AssetStatus | ApartmentStatus
  value: number
  lastUpdated: string
  condition: number
  assignedTo: string
  region?: string
  buildingDetails?: BuildingDetails
  apartmentDetails?: ApartmentDetails
  landDetails?: LandDetails
}

export interface InventoryItem {
  id: string
  site: string
  date: string
  agent: string
  status: 'En cours' | 'Validé' | 'Anomalie'
  scanned: number
  total: number
}

export interface MaintenanceRequest {
  id: string
  assetId: string
  title: string
  priority: 'Faible' | 'Moyenne' | 'Haute' | 'Urgente'
  status: MaintenanceStatus
  date: string
  assignedTo: string
  dueDate?: string
  cost?: number
  history?: string[]
}

export interface ReformItem {
  id: string
  assetId: string
  reason: string
  status: ReformStatus
  date: string
  proof?: string
  history?: string[]
}

export interface DashboardMetric {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down'
  tone: 'blue' | 'green' | 'amber' | 'red'
}

export interface ActivityItem {
  id: string
  title: string
  time: string
  detail: string
}

export interface ChartDataPoint {
  label: string
  value: number
}

export interface UserProfile {
  name: string
  role: Role
  email: string
}

export interface AssetMovement {
  id: string
  assetId: string
  assetName: string
  type: 'Affectation' | 'Transfert' | 'Changement de localisation' | 'Sortie' | 'Retour' | 'Inventaire' | 'Réforme'
  fromLocation: string
  toLocation: string
  user: string
  date: string
  comment: string
  status: 'En attente' | 'Validé' | 'Terminé'
}

export interface StaffMember {
  id: string
  name: string
  function: string
  service: string
  direction: string
  region: string
  status: 'Actif' | 'En congé' | 'Inactif'
  email: string
  phone: string
}

export interface AccessRecord {
  id: string
  employee: string
  type: 'Entrée' | 'Sortie' | 'Absence'
  date: string
  time: string
  reason: string
  status: 'Enregistré' | 'À valider' | 'Validé'
}

export interface PurchaseRequest {
  id: string
  subject: string
  supplier: string
  requester: string
  date: string
  amount: number
  status: 'Brouillon' | 'En validation' | 'Commandé' | 'Reçu'
}

export interface StockItem {
  id: string
  name: string
  category: string
  quantity: number
  threshold: number
  location: string
  status: 'Disponible' | 'Stock faible' | 'Rupture'
}

export interface FinancialEntry {
  id: string
  label: string
  category: string
  center: string
  amount: number
  date: string
  status: 'Prévu' | 'Engagé' | 'Payé'
}

export interface Supplier {
  id: string
  company: string
  category: string
  contact: string
  phone: string
  email: string
  status: 'Actif' | 'En évaluation' | 'Inactif'
  orders: number
  amount: number
}

export interface IntraPost {
  id: string
  title: string
  category: 'Actualité' | 'Annonce' | 'Document' | 'Ressource'
  author: string
  date: string
  summary: string
}
