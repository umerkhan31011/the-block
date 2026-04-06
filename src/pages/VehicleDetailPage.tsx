import { useParams, Link } from 'react-router-dom'
import { getVehicleById } from '../hooks/useVehicles'
import { ImageGallery } from '../components/ImageGallery'
import { BidForm } from '../components/BidForm'
import { AuctionCountdown } from '../components/AuctionCountdown'
import { formatOdometer, getAuctionStatus, abbrevProvince } from '../lib/format'
import { useWatchlist } from '../context/WatchlistContext'
import { useCurrency } from '../context/CurrencyContext'
import { NotFoundPage } from './NotFoundPage'

const STATUS_STYLES = {
  live: 'bg-green-100 text-green-700',
  upcoming: 'bg-blue-100 text-blue-700',
  ended: 'bg-gray-100 text-gray-500',
} as const

const STATUS_LABELS = {
  live: '● Live',
  upcoming: 'Upcoming',
  ended: 'Ended',
} as const

const TITLE_STYLES = {
  clean: 'bg-green-100 text-green-800',
  rebuilt: 'bg-yellow-100 text-yellow-800',
  salvage: 'bg-red-100 text-red-800',
} as const

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const vehicle = id ? getVehicleById(id) : undefined

  const { isWatched, toggle: watchlistToggle } = useWatchlist()
  const { formatPrice } = useCurrency()

  if (!vehicle) return <NotFoundPage />

  const status = getAuctionStatus(vehicle.auction_start)
  const watched = isWatched(vehicle.id)
  const gradeColor =
    vehicle.condition_grade >= 4
      ? 'text-green-700 bg-green-50 ring-1 ring-green-200'
      : vehicle.condition_grade >= 3
        ? 'text-yellow-700 bg-yellow-50 ring-1 ring-yellow-200'
        : 'text-red-700 bg-red-50 ring-1 ring-red-200'

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Inventory
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: gallery + details */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <ImageGallery
            images={vehicle.images}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />

          {/* Vehicle header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap text-sm text-gray-400">
                <span>Lot {vehicle.lot}</span>
                <span className="text-gray-200">·</span>
                <span className="font-mono text-xs">{vehicle.vin}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status]}`}
              >
                {STATUS_LABELS[status]}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${TITLE_STYLES[vehicle.title_status]}`}
              >
                {vehicle.title_status} title
              </span>
              <button
                onClick={() => watchlistToggle(vehicle.id)}
                className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                  watched
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : 'bg-white text-gray-500 border-gray-300 hover:text-red-500 hover:border-red-300'
                }`}
                aria-label={watched ? 'Remove from watchlist' : 'Save to watchlist'}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill={watched ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {watched ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          {/* Specs */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              <div>
                <SpecRow label="Engine" value={vehicle.engine} />
                <SpecRow label="Transmission" value={capitalize(vehicle.transmission)} />
                <SpecRow label="Drivetrain" value={vehicle.drivetrain} />
                <SpecRow label="Fuel Type" value={capitalize(vehicle.fuel_type)} />
              </div>
              <div>
                <SpecRow label="Odometer" value={formatOdometer(vehicle.odometer_km)} />
                <SpecRow label="Exterior" value={vehicle.exterior_color} />
                <SpecRow label="Interior" value={vehicle.interior_color} />
                <SpecRow label="Body Style" value={capitalize(vehicle.body_style)} />
              </div>
            </div>
          </section>

          {/* Condition */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Condition
              </h2>
              <span className={`text-sm font-bold px-3 py-1 rounded-lg ${gradeColor}`}>
                Grade {vehicle.condition_grade.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{vehicle.condition_report}</p>

            {vehicle.damage_notes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Damage Notes
                </h3>
                <ul className="space-y-1.5">
                  {vehicle.damage_notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-orange-400 flex-shrink-0 mt-0.5">⚠</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Dealership */}
          <section className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Selling Dealership
            </h2>
            <p className="font-semibold text-gray-800">{vehicle.selling_dealership}</p>
            <p className="text-sm text-gray-500 mt-0.5">
              {vehicle.city}, {abbrevProvince(vehicle.province)}
            </p>
          </section>
        </div>

        {/* Right: sticky bid panel */}
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <div className="lg:sticky lg:top-6 flex flex-col gap-3">
            <AuctionCountdown auctionStart={vehicle.auction_start} />

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Place a Bid
              </h2>
              <BidForm vehicle={vehicle} />
            </div>

            {/* Pricing reference */}
            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-2">
              <div className="flex justify-between">
                <span>Starting Bid</span>
                <span className="font-medium text-gray-700">{formatPrice(vehicle.starting_bid)}</span>
              </div>
              <div className="flex justify-between">
                <span>Reserve Price</span>
                <span className="font-medium text-gray-700">
                  {formatPrice(vehicle.reserve_price)}
                </span>
              </div>
              {vehicle.buy_now_price && (
                <div className="flex justify-between">
                  <span>Buy Now</span>
                  <span className="font-medium text-orange-600">
                    {formatPrice(vehicle.buy_now_price)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
