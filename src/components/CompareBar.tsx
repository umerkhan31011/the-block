import { useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useCurrency } from '../context/CurrencyContext'

export function CompareBar() {
  const { compareList, clear, toggle } = useCompare()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()

  if (compareList.length === 0) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900 text-white shadow-2xl border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <span className="text-sm font-semibold text-slate-400 flex-shrink-0 hidden sm:block">
          Compare ({compareList.length}/3)
        </span>

        {/* Vehicle chips */}
        <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0 overflow-hidden">
          {compareList.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-1.5 bg-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-medium min-w-0 max-w-[160px] sm:max-w-none"
            >
              <span className="truncate">
                {v.year} {v.make} {v.model}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-orange-400 flex-shrink-0">
                {formatPrice(v.current_bid || v.starting_bid)}
              </span>
              <button
                onClick={() => toggle(v)}
                className="ml-0.5 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                aria-label={`Remove ${v.make} ${v.model} from comparison`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          {compareList.length < 3 && (
            <span className="text-xs text-slate-500 italic">
              {3 - compareList.length} more slot{compareList.length < 2 ? 's' : ''} available
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clear}
            className="text-sm text-slate-400 hover:text-white transition-colors px-2 py-1"
          >
            Clear
          </button>
          {compareList.length >= 2 && (
            <button
              onClick={() => navigate('/compare')}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Compare {compareList.length} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
