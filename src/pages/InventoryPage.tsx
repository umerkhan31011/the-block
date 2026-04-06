import { useState } from 'react'
import { useVehicles } from '../hooks/useVehicles'
import { VehicleCard } from '../components/VehicleCard'
import { FilterPanel } from '../components/FilterPanel'
import { Pagination } from '../components/Pagination'
import type { SortOption } from '../hooks/useVehicles'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'year-desc', label: 'Year: Newest' },
  { value: 'year-asc', label: 'Year: Oldest' },
  { value: 'mileage-asc', label: 'Mileage: Lowest' },
]

export function InventoryPage() {
  const {
    vehicles,
    totalCount,
    allCount,
    filters,
    sort,
    setSort,
    page,
    setPage,
    totalPages,
    updateFilters,
    resetFilters,
    uniqueMakes,
    uniqueBodyStyles,
    uniqueFuelTypes,
    uniqueTransmissions,
  } = useVehicles()

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {totalCount} of {allCount} vehicles
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center gap-1.5 text-sm font-medium border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h18M7 8h10M11 12h2"
              />
            </svg>
            Filters
          </button>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search make, model, VIN…"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48 sm:w-60"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar: desktop */}
        <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
          <FilterPanel
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
            uniqueMakes={uniqueMakes}
            uniqueBodyStyles={uniqueBodyStyles}
            uniqueFuelTypes={uniqueFuelTypes}
            uniqueTransmissions={uniqueTransmissions}
            resultCount={totalCount}
          />
        </div>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="relative ml-auto w-80 max-w-[90vw] bg-white h-full overflow-y-auto p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <FilterPanel
                filters={filters}
                updateFilters={updateFilters}
                resetFilters={resetFilters}
                uniqueMakes={uniqueMakes}
                uniqueBodyStyles={uniqueBodyStyles}
                uniqueFuelTypes={uniqueFuelTypes}
                uniqueTransmissions={uniqueTransmissions}
                resultCount={totalCount}
              />
              <div className="pt-2">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm"
                >
                  Show {totalCount} results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle grid */}
        <div className="flex-1 min-w-0">
          {vehicles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium text-gray-600">No vehicles found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters or search term.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}
