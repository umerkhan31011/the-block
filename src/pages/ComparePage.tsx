import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useCurrency } from '../context/CurrencyContext'
import { formatOdometer, abbrevProvince } from '../lib/format'
import type { Vehicle } from '../types/vehicle'

type RowDef = {
  label: string
  render: (v: Vehicle) => string
}

function buildRows(formatPrice: (n: number) => string): RowDef[] {
  return [
    { label: 'Year', render: (v) => String(v.year) },
    { label: 'Make', render: (v) => v.make },
    { label: 'Model', render: (v) => v.model },
    { label: 'Trim', render: (v) => v.trim },
    { label: 'Body Style', render: (v) => v.body_style },
    { label: 'Engine', render: (v) => v.engine },
    { label: 'Transmission', render: (v) => v.transmission },
    { label: 'Drivetrain', render: (v) => v.drivetrain },
    { label: 'Fuel Type', render: (v) => v.fuel_type },
    { label: 'Odometer', render: (v) => formatOdometer(v.odometer_km) },
    { label: 'Exterior Color', render: (v) => v.exterior_color },
    { label: 'Interior Color', render: (v) => v.interior_color },
    { label: 'Condition Grade', render: (v) => v.condition_grade.toFixed(1) },
    { label: 'Title Status', render: (v) => v.title_status },
    { label: 'Location', render: (v) => `${v.city}, ${abbrevProvince(v.province)}` },
    { label: 'Current / Starting Bid', render: (v) => formatPrice(v.current_bid || v.starting_bid) },
    { label: 'Reserve Price', render: (v) => formatPrice(v.reserve_price) },
    { label: 'Buy Now Price', render: (v) => v.buy_now_price ? formatPrice(v.buy_now_price) : '—' },
  ]
}

export function ComparePage() {
  const { compareList, toggle } = useCompare()
  const { formatPrice } = useCurrency()
  const rows = useMemo(() => buildRows(formatPrice), [formatPrice])

  if (compareList.length < 2) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="text-5xl mb-4">⚖️</div>
          <p className="text-lg font-semibold text-gray-700">Select vehicles to compare</p>
          <p className="text-sm text-gray-400 mt-1">Choose 2 or 3 vehicles from the inventory to see them side by side.</p>
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Inventory
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Compare</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Comparison</h1>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full min-w-[480px] border-collapse">
          {/* Vehicle headers */}
          <thead>
            <tr>
              {/* Label column */}
              <th className="w-36 sm:w-44 sticky left-0 bg-white z-10 pb-4 pr-3 align-bottom">
                <span className="sr-only">Specification</span>
              </th>

              {compareList.map((v) => (
                <th key={v.id} className="min-w-[200px] pb-4 px-3 align-top text-left font-normal">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img
                        src={v.images[0]}
                        alt={`${v.year} ${v.make} ${v.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-900 text-sm leading-snug">
                        {v.year} {v.make} {v.model}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{v.trim}</p>
                      <Link
                        to={`/vehicles/${v.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block"
                      >
                        View details →
                      </Link>
                    </div>
                    <button
                      onClick={() => toggle(v)}
                      className="w-full text-xs text-red-400 hover:text-red-600 hover:bg-red-50 py-2 border-t border-gray-100 text-center transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Spec rows */}
          <tbody>
            {rows.map((row, rowIdx) => {
              const values = compareList.map((v) => row.render(v))
              const allSame = values.every((val) => val === values[0])

              return (
                <tr
                  key={row.label}
                  className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td
                    className={`sticky left-0 z-10 text-xs font-semibold text-gray-500 py-3 pr-3 uppercase tracking-wide align-middle ${
                      rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {row.label}
                  </td>
                  {values.map((val, colIdx) => (
                    <td
                      key={compareList[colIdx].id}
                      className={`text-sm py-3 px-3 capitalize align-middle ${
                        !allSame ? 'font-semibold text-indigo-700' : 'text-gray-800'
                      }`}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}
