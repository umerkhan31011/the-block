import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BidProvider } from './context/BidContext'
import { WatchlistProvider } from './context/WatchlistContext'
import { CompareProvider } from './context/CompareContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { Header } from './components/Header'
import { CompareBar } from './components/CompareBar'
import { InventoryPage } from './pages/InventoryPage'
import { VehicleDetailPage } from './pages/VehicleDetailPage'
import { WatchlistPage } from './pages/WatchlistPage'
import { ComparePage } from './pages/ComparePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <CurrencyProvider>
      <BidProvider>
        <WatchlistProvider>
          <CompareProvider>
            <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<InventoryPage />} />
                  <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                  <Route path="/watchlist" element={<WatchlistPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
              <footer className="border-t border-gray-200 bg-white mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
                  © 2026 The Block — Powered by OPENLANE
                </div>
              </footer>
              <CompareBar />
            </div>
            </BrowserRouter>
          </CompareProvider>
        </WatchlistProvider>
      </BidProvider>
    </CurrencyProvider>
  )
}

export default App

