import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { AssetsPage } from '@/pages/AssetsPage'
import { AssetDetailPage } from '@/pages/AssetDetailPage'
import { PropertyApartmentsPage } from '@/pages/PropertyApartmentsPage'
import { PropertyMapPage } from '@/pages/PropertyMapPage'
import { InventoryPage } from '@/pages/InventoryPage'
import { MaintenancePage } from '@/pages/MaintenancePage'
import { ReformPage } from '@/pages/ReformPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AccessPage, FinancePage, HrPage, IntraPage, MovementsPage, PurchasesPage, StocksPage, SuppliersPage } from '@/pages/SupportPages'
import { PropertyOverviewMapPage } from '@/pages/PropertyOverviewMapPage'
import { assets, userProfiles } from '@/data/mockData'
import type { Asset, UserProfile } from '@/types'

const pages: Record<string, ComponentType> = {
  '/inventory': InventoryPage,
  '/inventory/1': InventoryPage,
  '/maintenance': MaintenancePage,
  '/reform': ReformPage,
  '/reports': ReportsPage,
  '/settings': SettingsPage,
  '/movements': MovementsPage,
  '/hr': HrPage,
  '/intra': IntraPage,
  '/access': AccessPage,
  '/purchases': PurchasesPage,
  '/stocks': StocksPage,
  '/finance': FinancePage,
  '/suppliers': SuppliersPage,
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPath, setCurrentPath] = useState('/dashboard')
  const [currentUser, setCurrentUser] = useState<UserProfile>(userProfiles[0])
  const [assetRecords, setAssetRecords] = useState<Asset[]>(assets)
  const [assetSearchTerm, setAssetSearchTerm] = useState('')

  const Page = useMemo(() => {
    if (!isLoggedIn) return LoginPage
    return pages[currentPath] ?? DashboardPage
  }, [currentPath, isLoggedIn])

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    setCurrentPath('/dashboard')
  }

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPath('/dashboard')
    setAssetRecords(assets)
    setAssetSearchTerm('')
  }

  const handleAddAsset = (asset: Asset) => {
    setAssetRecords((records) => {
      const withAsset = [asset, ...records]
      if (!asset.apartmentDetails) return withAsset
      return withAsset.map((record) => record.id === asset.apartmentDetails?.buildingId && record.buildingDetails
        ? { ...record, buildingDetails: { ...record.buildingDetails, apartmentCount: record.buildingDetails.apartmentCount + 1 } }
        : record)
    })
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  const CurrentPage = Page as ComponentType

  return (
    <AppShell currentPath={currentPath} onNavigate={handleNavigate} user={currentUser} assetSearchTerm={assetSearchTerm} onSearchChange={setAssetSearchTerm} onSearch={() => setCurrentPath('/assets')} onLogout={handleLogout}>
      {currentPath === '/property-map' ? (
        <PropertyOverviewMapPage assets={assetRecords} onNavigate={handleNavigate} />
      ) : currentPath.startsWith('/assets/') ? (
        (() => {
          const pathParts = currentPath.split('/')
          const asset = assetRecords.find((record) => record.id === pathParts[2])
          if (pathParts[3] === 'map' && asset) return <PropertyMapPage asset={asset} onNavigate={handleNavigate} />
          if (pathParts[3] === 'apartments' && asset) return <PropertyApartmentsPage building={asset} assets={assetRecords} onNavigate={handleNavigate} />
          return <AssetDetailPage assetId={pathParts[2]} assets={assetRecords} onNavigate={handleNavigate} />
        })()
      ) : currentPath === '/assets' ? (
        <AssetsPage assets={assetRecords} onAddAsset={handleAddAsset} searchTerm={assetSearchTerm} onSearchChange={setAssetSearchTerm} onNavigate={handleNavigate} />
      ) : currentPath === '/dashboard' ? (
        <DashboardPage onNavigate={handleNavigate} assets={assetRecords} />
      ) : currentPath === '/inventory' || currentPath === '/inventory/1' ? (
        <InventoryPage assets={assetRecords} />
      ) : currentPath === '/maintenance' ? (
        <MaintenancePage assets={assetRecords} />
      ) : currentPath === '/reform' ? (
        <ReformPage assets={assetRecords} />
      ) : currentPath === '/reports' ? (
        <ReportsPage assets={assetRecords} />
      ) : (
        <CurrentPage />
      )}
    </AppShell>
  )
}

export default App
