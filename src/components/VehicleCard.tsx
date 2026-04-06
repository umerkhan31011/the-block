import { Link } from 'react-router-dom'
import type { Vehicle } from '../types/vehicle'
import { formatOdometer, getAuctionStatus, abbrevProvince } from '../lib/format'
import { useBidContext } from '../context/BidContext'
import { useWatchlist } from '../context/WatchlistContext'
import { useCompare } from '../context/CompareContext'
import { useCurrency } from '../context/CurrencyContext'

interface Props {
  vehicle: Vehicle
}

const STATUS_STYLES = {
  live: 'bg-green-100 text-green-800',
  upcoming: 'bg-blue-100 text-blue-800',
  ended: 'bg-gray-100 text-gray-500',
} as const

const STATUS_LABELS = {
  live: '● Live',
  upcoming: 'Upcoming',
  ended: 'Ended',
} as const

export function VehicleCard({ vehicle }: Props) {
  const { getHighestUserBid } = useBidContext()
  const { isWatched, toggle: watchlistToggle } = useWatchlist()
  const { isInCompare, toggle: compareToggle, canAdd } = useCompare()
  const { formatPrice } = useCurrency()

  const userHighest = getHighestUserBid(vehicle.id)
  const effectiveBid =
    userHighest !== null ? Math.max(vehicle.current_bid, userHighest) : vehicle.current_bid
  const displayBid = effectiveBid > 0 ? effectiveBid : vehicle.starting_bid
  const hasBid = effectiveBid > 0
  const status = getAuctionStatus(vehicle.auction_start)
  const isHighBidder = userHighest !== null && userHighest >= effectiveBid && effectiveBid > 0
  const watched = isWatched(vehicle.id)
  const inCompare = isInCompare(vehicle.id)

  const gradeColor =
    vehicle.condition_grade >= 4
      ? 'text-green-700 bg-green-50 ring-1 ring-green-200'
      : vehicle.condition_grade >= 3
        ? 'text-yellow-700 bg-yellow-50 ring-1 ring-yellow-200'
        : 'text-red-700 bg-red-50 ring-1 ring-red-200'

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 flex flex-col">
      {/* Main link area */}
      <Link
        to={`/vehicles/${vehicle.id}`}
        className="flex flex-col flex-1 min-w-0"
      >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
        {vehicle.buy_now_price && (
          <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
            Buy Now
          </span>
        )}
        {isHighBidder && (
          <span className="absolute bottom-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
            You're highest
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">
            {vehicle.trim} · {vehicle.lot}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-500">
          <span>{formatOdometer(vehicle.odometer_km)}</span>
          <span className="text-gray-300">·</span>
          <span className="capitalize">{vehicle.fuel_type}</span>
          <span className="text-gray-300">·</span>
          <span>
            {vehicle.city}, {abbrevProvince(vehicle.province)}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              {hasBid ? 'Current bid' : 'Starting bid'}
            </p>
            <p className="text-xl font-bold text-gray-900 leading-tight">{formatPrice(displayBid)}</p>
            {vehicle.bid_count > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {vehicle.bid_count} bid{vehicle.bid_count !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${gradeColor}`}>
            {vehicle.condition_grade.toFixed(1)}
          </span>
        </div>
      </div>
      </Link>

      {/* Action footer — compare + watchlist */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-gray-100 bg-gray-50">
        <label
          className={`flex items-center gap-1.5 cursor-pointer text-xs font-medium transition-colors select-none ${
            inCompare ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
          } ${!inCompare && !canAdd ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          <input
            type="checkbox"
            checked={inCompare}
            disabled={!inCompare && !canAdd}
            onChange={() => compareToggle(vehicle)}
            className="rounded accent-indigo-600"
          />
          Compare
        </label>

        <button
          onClick={() => watchlistToggle(vehicle.id)}
          className={`transition-colors p-1 rounded-md ${
            watched ? 'text-red-500 hover:text-red-600' : 'text-gray-300 hover:text-red-400'
          }`}
          aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
          title={watched ? 'Remove from watchlist' : 'Save to watchlist'}
        >
          <svg
            className="w-4 h-4"
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
        </button>
      </div>
    </div>
  )
}
