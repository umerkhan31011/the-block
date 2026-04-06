import { Link } from 'react-router-dom'
import { useWatchlist } from '../context/WatchlistContext'
import { useCurrency } from '../context/CurrencyContext'

export function Header() {
  const { count } = useWatchlist()
  const { currency, toggleCurrency } = useCurrency()

  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none hover:opacity-90 transition-opacity">
          <span className="text-lg font-bold tracking-widest">THE BLOCK</span>
          <span className="text-[10px] text-slate-400 tracking-widest">POWERED BY OPENLANE</span>
        </Link>

        <nav className="flex items-center gap-1">
          <button
            onClick={toggleCurrency}
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-slate-800 border border-slate-700"
            aria-label={`Switch to ${currency === 'CAD' ? 'USD' : 'CAD'}`}
          >
            {currency === 'CAD' ? '🇨🇦 CAD' : '🇺🇸 USD'}
          </button>
          <Link
            to="/"
            className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800"
          >
            Inventory
          </Link>
          <Link
            to="/watchlist"
            className="relative flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={count > 0 ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Watchlist
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
