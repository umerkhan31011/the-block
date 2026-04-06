import type { ReactNode } from 'react'
import type { Filters } from '../hooks/useVehicles'
import { useCurrency } from '../context/CurrencyContext'

interface FilterPanelProps {
  filters: Filters
  updateFilters: (update: Partial<Filters>) => void
  resetFilters: () => void
  uniqueMakes: string[]
  uniqueBodyStyles: string[]
  uniqueFuelTypes: string[]
  uniqueTransmissions: string[]
  resultCount: number
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
}

function ChipToggle({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`text-xs px-3 py-1 rounded-full border transition-colors ${
        selected
          ? 'bg-slate-800 text-white border-slate-800'
          : 'bg-white text-gray-600 border-gray-300 hover:border-slate-500'
      }`}
    >
      {label}
    </button>
  )
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-4 flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</h3>
      {children}
    </div>
  )
}

const BODY_STYLE_LABELS: Record<string, string> = {
  SUV: 'SUV',
  sedan: 'Sedan',
  truck: 'Truck',
  coupe: 'Coupe',
  hatchback: 'Hatchback',
}

const FUEL_LABELS: Record<string, string> = {
  gasoline: 'Gasoline',
  electric: 'Electric',
  hybrid: 'Hybrid',
  diesel: 'Diesel',
}

const TRANS_LABELS: Record<string, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
  'single-speed': 'Single-Speed',
}

export function FilterPanel({
  filters,
  updateFilters,
  resetFilters,
  uniqueMakes,
  uniqueBodyStyles,
  uniqueFuelTypes,
  uniqueTransmissions,
  resultCount,
}: FilterPanelProps) {
  const { currency } = useCurrency()
  const hasActiveFilters =
    filters.makes.length > 0 ||
    filters.bodyStyles.length > 0 ||
    filters.fuelTypes.length > 0 ||
    filters.transmissions.length > 0 ||
    filters.titleStatuses.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.minYear !== null ||
    filters.maxYear !== null ||
    filters.listingType !== 'all'

  return (
    <aside className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 -mt-2">
        {resultCount} vehicle{resultCount !== 1 ? 's' : ''} found
      </p>

      <FilterSection title="Listing Type">
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'buy-now', 'auction-only'] as const).map((lt) => (
            <ChipToggle
              key={lt}
              label={lt === 'all' ? 'All' : lt === 'buy-now' ? 'Buy Now' : 'Auction Only'}
              selected={filters.listingType === lt}
              onToggle={() => updateFilters({ listingType: lt })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Make">
        <div className="flex flex-wrap gap-1.5">
          {uniqueMakes.map((make) => (
            <ChipToggle
              key={make}
              label={make}
              selected={filters.makes.includes(make)}
              onToggle={() => updateFilters({ makes: toggle(filters.makes, make) })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Body Style">
        <div className="flex flex-wrap gap-1.5">
          {uniqueBodyStyles.map((bs) => (
            <ChipToggle
              key={bs}
              label={BODY_STYLE_LABELS[bs] ?? bs}
              selected={filters.bodyStyles.includes(bs)}
              onToggle={() => updateFilters({ bodyStyles: toggle(filters.bodyStyles, bs) })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Fuel Type">
        <div className="flex flex-wrap gap-1.5">
          {uniqueFuelTypes.map((ft) => (
            <ChipToggle
              key={ft}
              label={FUEL_LABELS[ft] ?? ft}
              selected={filters.fuelTypes.includes(ft)}
              onToggle={() => updateFilters({ fuelTypes: toggle(filters.fuelTypes, ft) })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Transmission">
        <div className="flex flex-wrap gap-1.5">
          {uniqueTransmissions.map((tr) => (
            <ChipToggle
              key={tr}
              label={TRANS_LABELS[tr] ?? tr}
              selected={filters.transmissions.includes(tr)}
              onToggle={() =>
                updateFilters({ transmissions: toggle(filters.transmissions, tr) })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Title Status">
        <div className="flex flex-wrap gap-1.5">
          {(['clean', 'rebuilt', 'salvage'] as const).map((s) => (
            <ChipToggle
              key={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              selected={filters.titleStatuses.includes(s)}
              onToggle={() =>
                updateFilters({ titleStatuses: toggle(filters.titleStatuses, s) })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Year">
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.minYear ?? ''}
            onChange={(e) =>
              updateFilters({ minYear: e.target.value ? parseInt(e.target.value) : null })
            }
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxYear ?? ''}
            onChange={(e) =>
              updateFilters({ maxYear: e.target.value ? parseInt(e.target.value) : null })
            }
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </FilterSection>

      <FilterSection title={`Price (${currency})`}>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) =>
              updateFilters({ minPrice: e.target.value ? parseInt(e.target.value) : null })
            }
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) =>
              updateFilters({ maxPrice: e.target.value ? parseInt(e.target.value) : null })
            }
            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </FilterSection>
    </aside>
  )
}
