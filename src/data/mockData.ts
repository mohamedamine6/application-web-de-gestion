import type { AccessRecord, ActivityItem, Asset, AssetMovement, ChartDataPoint, DashboardMetric, FinancialEntry, IntraPost, InventoryItem, MaintenanceRequest, PurchaseRequest, ReformItem, StaffMember, StockItem, Supplier, UserProfile } from '@/types'

export const userProfiles: UserProfile[] = [
  { name: 'Karine Mba', role: 'Direction', email: 'karine.mba@dgp.gabon' },
  { name: 'Aimé Ndzeng', role: 'Gestionnaire patrimoine', email: 'aime.ndzeng@dgp.gabon' },
  { name: 'Céleste Okaf', role: 'Agent terrain', email: 'celeste.okaf@dgp.gabon' },
  { name: 'Samuel Boussou', role: 'Comptabilité', email: 'samuel.boussou@dgp.gabon' },
  { name: 'Jules Mba', role: 'Admin', email: 'jules.mba@dgp.gabon' },
]

export const dashboardMetrics: DashboardMetric[] = [
  { label: 'Valeur totale', value: '48,2 M', delta: '+2,1%', trend: 'up', tone: 'blue' },
  { label: 'Actifs', value: '12 480', delta: '+3,4%', trend: 'up', tone: 'green' },
  { label: 'Taux de vétusté', value: '18,7%', delta: '-1,2 pts', trend: 'down', tone: 'amber' },
  { label: 'Maintenance', value: '642', delta: '+8,5%', trend: 'up', tone: 'red' },
  { label: 'Réformes', value: '187', delta: '+14%', trend: 'up', tone: 'blue' },
  { label: 'Non affectés', value: '1 310', delta: '-2,6%', trend: 'down', tone: 'green' },
]

export const valueTrend: ChartDataPoint[] = [
  { label: 'Jan', value: 36 },
  { label: 'Fév', value: 39 },
  { label: 'Mar', value: 41 },
  { label: 'Avr', value: 43 },
  { label: 'Mai', value: 46 },
  { label: 'Jui', value: 48 },
]

export const ministryBreakdown: ChartDataPoint[] = [
  { label: 'Éducation', value: 32 },
  { label: 'Santé', value: 24 },
  { label: 'Transport', value: 18 },
  { label: 'Finance', value: 16 },
  { label: 'Autres', value: 10 },
]

export const alerts = [
  { title: 'Vétusté critique', detail: '12 biens du ministère de la Santé sont au-dessus du seuil', level: 'danger' },
  { title: 'Maintenance urgente', detail: '6 demandes de maintenance dépassent la date limite', level: 'warning' },
  { title: 'Écart d’inventaire', detail: '3 actifs non retrouvés sur le site de Libreville', level: 'info' },
]

export const recentActivities: ActivityItem[] = [
  { id: 'a1', title: 'Affectation modifiée', time: 'Il y a 15 min', detail: 'PAT-2014-034 transféré vers le ministère des Finances' },
  { id: 'a2', title: 'Inventaire validé', time: 'Il y a 1 h', detail: 'Site de Port-Gentil: 96 % des éléments vérifiés' },
  { id: 'a3', title: 'Demande de maintenance clôturée', time: 'Il y a 2 h', detail: 'Équipement de bureau – M-0221 remis en service' },
  { id: 'a4', title: 'Réforme soumise', time: 'Hier', detail: '3 ordinateurs du service comptabilité validés pour recyclage' },
  { id: 'a5', title: 'Anomalie détectée', time: 'Hier', detail: '2 actifs non localisés sur le site de Oyem' },
]

export const assets: Asset[] = [
  { id: '1', code: 'PAT-2014-034', name: 'Ordinateur portable Dell Latitude', type: 'Équipement informatique', department: 'Ministère des Finances', location: 'Libreville', region: 'Estuaire', status: 'En service', value: 1450000, lastUpdated: '2026-09-21', condition: 83, assignedTo: 'Service comptabilité' },
  { id: '2', code: 'PAT-2017-119', name: 'Véhicule utilitaire Toyota', type: 'Parc automobile', department: 'Ministère du Transport', location: 'Port-Gentil', region: 'Ogooué-Maritime', status: 'En maintenance', value: 24700000, lastUpdated: '2026-09-18', condition: 64, assignedTo: 'Atelier logistique' },
  { id: '3', code: 'PAT-2020-208', name: 'Imprimante multifonction', type: 'Matériel bureautique', department: 'Ministère de la Santé', location: 'Oyem', region: 'Woleu-Ntem', status: 'À reformer', value: 480000, lastUpdated: '2026-09-14', condition: 41, assignedTo: 'Service administratif' },
  { id: '4', code: 'PAT-2018-050', name: 'Chaise de bureau', type: 'Mobilier de bureau', department: 'Ministère de l’Éducation', location: 'Franceville', region: 'Haut-Ogooué', status: 'En service', value: 180000, lastUpdated: '2026-09-23', condition: 91, assignedTo: 'Direction générale' },
  { id: '5', code: 'PAT-2019-081', name: 'Serveur de stockage', type: 'Infrastructure IT', department: 'Ministère du numérique', location: 'Libreville', region: 'Estuaire', status: 'Hors service', value: 8900000, lastUpdated: '2026-09-12', condition: 55, assignedTo: 'Service SI' },
  { id: '6', code: 'PAT-2022-009', name: 'Bureau de gestion des accès', type: 'Équipement de sécurité', department: 'Ministère de l’Intérieur', location: 'Libreville', region: 'Estuaire', status: 'En service', value: 2350000, lastUpdated: '2026-09-26', condition: 88, assignedTo: 'Sécurité' },
  { id: 'imm-akanda', code: 'PAT-IMM-001', name: 'Immeuble administratif Akanda', type: 'Immeuble', department: 'Ministère des Affaires foncières', location: 'Akanda', region: 'Estuaire', status: 'En service', value: 1450000000, lastUpdated: '2026-09-26', condition: 96, assignedTo: 'Direction du patrimoine immobilier', buildingDetails: { address: 'Boulevard du Bord de Mer, lot 18, quartier Angondjé', floorCount: 4, apartmentCount: 4, areaM2: 1840, latitude: 0.5124, longitude: 9.4561 } },
  { id: 'terrain-libreville', code: 'PAT-TER-001', name: 'Terrain administratif de Libreville', type: 'Terrain', department: 'Ministère des Affaires foncières', location: 'Libreville', region: 'Estuaire', status: 'En service', value: 320000000, lastUpdated: '2026-09-24', condition: 100, assignedTo: 'Direction du patrimoine immobilier', landDetails: { address: 'Quartier Batterie IV, Libreville', areaM2: 5200, latitude: 0.3921, longitude: 9.4536 } },
  { id: 'app-akanda-a101', code: 'PAT-APP-001', name: 'Appartement administratif A101', type: 'Appartement', department: 'Ministère des Affaires foncières', location: 'Akanda', region: 'Estuaire', status: 'Occupé', value: 85000000, lastUpdated: '2026-09-25', condition: 94, assignedTo: 'Direction des affaires juridiques', apartmentDetails: { buildingId: 'imm-akanda', number: 'A101', floor: 1, areaM2: 92, roomCount: 4, occupant: 'Direction des affaires juridiques' } },
  { id: 'app-akanda-a102', code: 'PAT-APP-002', name: 'Appartement administratif A102', type: 'Appartement', department: 'Ministère des Affaires foncières', location: 'Akanda', region: 'Estuaire', status: 'Occupé', value: 79000000, lastUpdated: '2026-09-22', condition: 90, assignedTo: 'Service du cadastre', apartmentDetails: { buildingId: 'imm-akanda', number: 'A102', floor: 1, areaM2: 86, roomCount: 3, occupant: 'Service du cadastre' } },
  { id: 'app-akanda-a201', code: 'PAT-APP-003', name: 'Appartement administratif A201', type: 'Appartement', department: 'Ministère des Affaires foncières', location: 'Akanda', region: 'Estuaire', status: 'Disponible', value: 91000000, lastUpdated: '2026-09-20', condition: 98, assignedTo: 'À affecter', apartmentDetails: { buildingId: 'imm-akanda', number: 'A201', floor: 2, areaM2: 98, roomCount: 4 } },
  { id: 'app-akanda-a202', code: 'PAT-APP-004', name: 'Appartement administratif A202', type: 'Appartement', department: 'Ministère des Affaires foncières', location: 'Akanda', region: 'Estuaire', status: 'Maintenance', value: 76000000, lastUpdated: '2026-09-18', condition: 72, assignedTo: 'Maintenance immobilière', apartmentDetails: { buildingId: 'imm-akanda', number: 'A202', floor: 2, areaM2: 84, roomCount: 3 } },
]

export const inventoryItems: InventoryItem[] = [
  { id: 'inv-1', site: 'Libreville', date: '2026-09-20', agent: 'Céleste Okaf', status: 'Validé', scanned: 240, total: 248 },
  { id: 'inv-2', site: 'Port-Gentil', date: '2026-09-18', agent: 'A. Nzi', status: 'En cours', scanned: 156, total: 190 },
  { id: 'inv-3', site: 'Oyem', date: '2026-09-15', agent: 'M. Asseko', status: 'Anomalie', scanned: 118, total: 130 },
  { id: 'inv-4', site: 'Franceville', date: '2026-09-24', agent: 'J. Mba', status: 'Validé', scanned: 178, total: 178 },
]

export const maintenanceRequests: MaintenanceRequest[] = [
  { id: 'm-101', assetId: 'PAT-2017-119', title: 'Suspension avant à vérifier', priority: 'Urgente', status: 'En cours', date: '2026-09-17', assignedTo: 'Atelier 2' },
  { id: 'm-102', assetId: 'PAT-2014-034', title: 'Changement batterie', priority: 'Moyenne', status: 'Ouverte', date: '2026-09-22', assignedTo: 'Support IT' },
  { id: 'm-103', assetId: 'PAT-2019-081', title: 'Serveur hors service', priority: 'Haute', status: 'Urgente', date: '2026-09-12', assignedTo: 'Equipe SI' },
  { id: 'm-104', assetId: 'PAT-2020-208', title: 'Imprimante en fin de vie', priority: 'Faible', status: 'Clôturée', date: '2026-09-10', assignedTo: 'Bureau administratif' },
]

export const reformItems: ReformItem[] = [
  { id: 'r-1', assetId: 'PAT-2020-208', reason: 'Perte de fiabilité et pièces non disponibles', status: 'À valider', date: '2026-09-15' },
  { id: 'r-2', assetId: 'PAT-2019-081', reason: 'Équipement obsolète et non conforme', status: 'Validée', date: '2026-09-08' },
  { id: 'r-3', assetId: 'PAT-2014-034', reason: 'À remplacer selon plan de renouvellement', status: 'Recyclage', date: '2026-09-23' },
]

export const reportsSeries: ChartDataPoint[] = [
  { label: 'Q1', value: 32 },
  { label: 'Q2', value: 41 },
  { label: 'Q3', value: 49 },
  { label: 'Q4', value: 59 },
]

export const settingsRows = [
  { name: 'Type d’actif', count: '12', status: 'Actif' },
  { name: 'Services', count: '28', status: 'Actif' },
  { name: 'Sites', count: '9', status: 'Actif' },
  { name: 'Rôles utilisateurs', count: '5', status: 'À revoir' },
]

export const assetMovements: AssetMovement[] = [
  { id: 'mv-001', assetId: 'PAT-2014-034', assetName: 'Ordinateur portable Dell Latitude', type: 'Transfert', fromLocation: 'Libreville', toLocation: 'Libreville · Finances', user: 'Aimé Ndzeng', date: '2026-09-25', comment: 'Transfert vers le service comptabilité', status: 'Terminé' },
  { id: 'mv-002', assetId: 'PAT-2017-119', assetName: 'Véhicule utilitaire Toyota', type: 'Changement de localisation', fromLocation: 'Libreville', toLocation: 'Port-Gentil', user: 'Céleste Okaf', date: '2026-09-23', comment: 'Affectation atelier logistique', status: 'Validé' },
  { id: 'mv-003', assetId: 'PAT-2020-208', assetName: 'Imprimante multifonction', type: 'Réforme', fromLocation: 'Oyem', toLocation: 'En attente de décision', user: 'Karine Mba', date: '2026-09-15', comment: 'Dossier de réforme ouvert', status: 'En attente' },
]

export const staffMembers: StaffMember[] = [
  { id: 'EMP-001', name: 'Karine Mba', function: 'Directrice générale', service: 'Direction générale', direction: 'DGP', region: 'Estuaire', status: 'Actif', email: 'karine.mba@dgp.gabon', phone: '+241 01 70 00 01' },
  { id: 'EMP-002', name: 'Aimé Ndzeng', function: 'Gestionnaire patrimoine', service: 'Gestion des actifs', direction: 'Patrimoine', region: 'Estuaire', status: 'Actif', email: 'aime.ndzeng@dgp.gabon', phone: '+241 01 70 00 02' },
  { id: 'EMP-003', name: 'Céleste Okaf', function: 'Agent terrain', service: 'Inventaire', direction: 'Opérations', region: 'Ogooué-Maritime', status: 'En congé', email: 'celeste.okaf@dgp.gabon', phone: '+241 01 70 00 03' },
  { id: 'EMP-004', name: 'Samuel Boussou', function: 'Comptable', service: 'Comptabilité', direction: 'Finances', region: 'Estuaire', status: 'Actif', email: 'samuel.boussou@dgp.gabon', phone: '+241 01 70 00 04' },
]

export const intraPosts: IntraPost[] = [
  { id: 'INT-001', title: 'Campagne annuelle de l’inventaire physique', category: 'Annonce', author: 'Direction du patrimoine', date: '2026-09-26', summary: 'Les équipes terrain préparent la campagne de vérification des biens publics.' },
  { id: 'INT-002', title: 'Guide de codification des actifs', category: 'Document', author: 'Équipe SI', date: '2026-09-22', summary: 'Référentiel de démonstration pour les identifiants et le marquage des actifs.' },
  { id: 'INT-003', title: 'Modernisation du patrimoine public', category: 'Actualité', author: 'Communication DGP', date: '2026-09-18', summary: 'Point d’information sur les travaux de digitalisation de la DGP.' },
  { id: 'INT-004', title: 'Ressources pour les agents terrain', category: 'Ressource', author: 'Support DGP', date: '2026-09-12', summary: 'Documents et consignes internes pour les contrôles d’inventaire.' },
]

export const accessRecords: AccessRecord[] = [
  { id: 'ACC-001', employee: 'Céleste Okaf', type: 'Entrée', date: '2026-09-28', time: '08:12', reason: 'Prise de service', status: 'Enregistré' },
  { id: 'ACC-002', employee: 'Aimé Ndzeng', type: 'Sortie', date: '2026-09-28', time: '09:05', reason: 'Mission terrain · Libreville', status: 'Enregistré' },
  { id: 'ACC-003', employee: 'Samuel Boussou', type: 'Absence', date: '2026-09-29', time: '—', reason: 'Rendez-vous administratif', status: 'À valider' },
]

export const purchaseRequests: PurchaseRequest[] = [
  { id: 'ACH-2026-014', subject: 'Étiquettes de marquage des actifs', supplier: 'Gabon Solutions Numériques', requester: 'Aimé Ndzeng', date: '2026-09-24', amount: 1250000, status: 'En validation' },
  { id: 'ACH-2026-013', subject: 'Matériel bureautique', supplier: 'Services Bureautiques Gabon', requester: 'Karine Mba', date: '2026-09-20', amount: 840000, status: 'Commandé' },
  { id: 'ACH-2026-012', subject: 'Équipement de protection terrain', supplier: 'ProTech Afrique', requester: 'Céleste Okaf', date: '2026-09-16', amount: 520000, status: 'Reçu' },
]

export const stockItems: StockItem[] = [
  { id: 'STK-001', name: 'Étiquettes inventaire QR', category: 'Marquage', quantity: 140, threshold: 100, location: 'Libreville · Magasin central', status: 'Disponible' },
  { id: 'STK-002', name: 'Papier A4', category: 'Fournitures', quantity: 18, threshold: 30, location: 'Libreville · Bureau', status: 'Stock faible' },
  { id: 'STK-003', name: 'Cartouches imprimante', category: 'Consommables', quantity: 0, threshold: 12, location: 'Port-Gentil · Antenne', status: 'Rupture' },
]

export const financialEntries: FinancialEntry[] = [
  { id: 'FIN-BUD-2026', label: 'Budget annuel de démonstration', category: 'Budget', center: 'DGP · Direction générale', amount: 45000000, date: '2026-01-01', status: 'Prévu' },
  { id: 'FIN-001', label: 'Maintenance parc informatique', category: 'Entretien', center: 'DGP · SI', amount: 1850000, date: '2026-09-21', status: 'Engagé' },
  { id: 'FIN-002', label: 'Marquage du patrimoine mobilier', category: 'Inventaire', center: 'DGP · Opérations', amount: 1250000, date: '2026-09-24', status: 'Prévu' },
  { id: 'FIN-003', label: 'Entretien véhicule PAT-2017-119', category: 'Maintenance', center: 'DGP · Logistique', amount: 640000, date: '2026-09-12', status: 'Payé' },
]

export const suppliers: Supplier[] = [
  { id: 'FOU-001', company: 'Gabon Solutions Numériques', category: 'Marquage et informatique', contact: 'Élodie Moussavou', phone: '+241 01 77 10 10', email: 'contact@gsn.ga', status: 'Actif', orders: 4, amount: 4280000 },
  { id: 'FOU-002', company: 'Services Bureautiques Gabon', category: 'Fournitures', contact: 'Paul Obame', phone: '+241 01 77 20 20', email: 'ventes@sbg.ga', status: 'Actif', orders: 2, amount: 1540000 },
  { id: 'FOU-003', company: 'ProTech Afrique', category: 'Équipements terrain', contact: 'Nadia Ekomi', phone: '+241 01 77 30 30', email: 'contact@protech.ga', status: 'En évaluation', orders: 1, amount: 520000 },
]
