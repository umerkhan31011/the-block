import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { VehicleCard } from '../components/VehicleCard'
import { getVehicleById } from '../hooks/useVehicles'
import type { Vehicle } from '../types/vehicle'

export function WatchlistPage() {
  const { watchedIds, toggle } = useWatchlist()

  const vehicles = [...watchedIds]
    .map((id) => getVehicleById(id))
    .filter((v): v is Vehicle => v !== undefined)

  if (vehicles.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="text-5xl mb-4">🤍</div>
          <p className="text-lg font-semibold text-gray-700">Your watchlist is empty</p>
          <p className="text-sm text-gray-400 mt-1">
            Save vehicles you're interested in by clicking the heart icon on any listing.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            Browse Inventory
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Watchlist</h1>
          <p className="text-sm text-gray-400 mt-0.5">{vehicles.length} saved vehicle{vehicles.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => vehicles.forEach((v) => toggle(v.id))}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
      </div>
    </main>
  )
}
