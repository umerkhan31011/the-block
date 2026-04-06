import { useMemo, useState, useEffect } from 'react'
import type { Vehicle } from '../types/vehicle'
import { normalizeAuctionTime } from '../lib/format'
import { useCurrency } from '../context/CurrencyContext'
import vehiclesData from '../data/vehicles.json'

const ALL_VEHICLES = vehiclesData as Vehicle[]

export type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'year-desc'
  | 'year-asc'
  | 'mileage-asc'
  | 'auction-asc'
  | 'auction-desc'

export interface Filters {
  search: string
  makes: string[]
  bodyStyles: string[]
  fuelTypes: string[]
  transmissions: string[]
  titleStatuses: string[]
  minPrice: number | null
  maxPrice: number | null
  minYear: number | null
  maxYear: number | null
  listingType: 'all' | 'buy-now' | 'auction-only'
}

export const DEFAULT_FILTERS: Filters = {
  search: '',
  makes: [],
  bodyStyles: [],
  fuelTypes: [],
  transmissions: [],
  titleStatuses: [],
  minPrice: null,
  maxPrice: null,
  minYear: null,
  maxYear: null,
  listingType: 'all',
}

const PAGE_SIZE = 20

export function filterVehicles(vehicles: Vehicle[], filters: Filters): Vehicle[] {
  let result = vehicles

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        String(v.year).includes(q) ||
        v.trim.toLowerCase().includes(q) ||
        v.vin.toLowerCase().includes(q) ||
        v.lot.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q),
    )
  }

  if (filters.makes.length > 0)
    result = result.filter((v) => filters.makes.includes(v.make))
  if (filters.bodyStyles.length > 0)
    result = result.filter((v) => filters.bodyStyles.includes(v.body_style))
  if (filters.fuelTypes.length > 0)
    result = result.filter((v) => filters.fuelTypes.includes(v.fuel_type))
  if (filters.transmissions.length > 0)
    result = result.filter((v) => filters.transmissions.includes(v.transmission))
  if (filters.titleStatuses.length > 0)
    result = result.filter((v) => filters.titleStatuses.includes(v.title_status))

  if (filters.minPrice !== null) {
    const minP = filters.minPrice
    result = result.filter((v) => (v.current_bid || v.starting_bid) >= minP)
  }
  if (filters.maxPrice !== null) {
    const maxP = filters.maxPrice
    result = result.filter((v) => (v.current_bid || v.starting_bid) <= maxP)
  }
  if (filters.minYear !== null) {
    const minY = filters.minYear
    result = result.filter((v) => v.year >= minY)
  }
  if (filters.maxYear !== null) {
    const maxY = filters.maxYear
    result = result.filter((v) => v.year <= maxY)
  }

  if (filters.listingType === 'buy-now')
    result = result.filter((v) => v.buy_now_price !== null)
  else if (filters.listingType === 'auction-only')
    result = result.filter((v) => v.buy_now_price === null)

  return result
}

export function sortVehicles(vehicles: Vehicle[], sort: SortOption): Vehicle[] {
  const arr = [...vehicles]
  switch (sort) {
    case 'price-asc':
      arr.sort((a, b) => (a.current_bid || a.starting_bid) - (b.current_bid || b.starting_bid))
      break
    case 'price-desc':
      arr.sort((a, b) => (b.current_bid || b.starting_bid) - (a.current_bid || a.starting_bid))
      break
    case 'year-desc':
      arr.sort((a, b) => b.year - a.year)
      break
    case 'year-asc':
      arr.sort((a, b) => a.year - b.year)
      break
    case 'mileage-asc':
      arr.sort((a, b) => a.odometer_km - b.odometer_km)
      break
    case 'auction-asc':
    case 'auction-desc': {
      const desc = sort === 'auction-desc'
      arr.sort((a, b) => {
        const aEnd = normalizeAuctionTime(a.auction_start).getTime() + 3 * 3_600_000
        const bEnd = normalizeAuctionTime(b.auction_start).getTime() + 3 * 3_600_000
        const now = Date.now()
        const aStart = normalizeAuctionTime(a.auction_start).getTime()
        const bStart = normalizeAuctionTime(b.auction_start).getTime()
        const aLive = aStart <= now && now <= aEnd
        const bLive = bStart <= now && now <= bEnd
        const aUpcoming = aStart > now
        const bUpcoming = bStart > now
        const aRank = aLive ? 0 : aUpcoming ? 1 : 2
        const bRank = bLive ? 0 : bUpcoming ? 1 : 2
        if (aRank !== bRank) return aRank - bRank
        return desc ? bEnd - aEnd : aEnd - bEnd
      })
      break
    }
  }
  return arr
}

export function useVehicles() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('price-asc')
  const [page, setPage] = useState(1)
  const { toCAD, currency } = useCurrency()

  // Clear price filters when currency changes so stale values don't misfilter
  const [prevCurrency, setPrevCurrency] = useState(currency)
  useEffect(() => {
    if (currency !== prevCurrency) {
      setPrevCurrency(currency)
      setFilters((prev) => ({ ...prev, minPrice: null, maxPrice: null }))
    }
  }, [currency, prevCurrency])

  const filtered = useMemo(() => {
    // Convert user-entered prices (in display currency) to CAD for filtering
    const cadFilters = {
      ...filters,
      minPrice: filters.minPrice !== null ? toCAD(filters.minPrice) : null,
      maxPrice: filters.maxPrice !== null ? toCAD(filters.maxPrice) : null,
    }
    return filterVehicles(ALL_VEHICLES, cadFilters)
  }, [filters, toCAD])

  const sorted = useMemo(() => sortVehicles(filtered, sort), [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function updateFilters(update: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, ...update }))
    setPage(1)
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const uniqueMakes = useMemo(
    () => [...new Set(ALL_VEHICLES.map((v) => v.make))].sort(),
    [],
  )
  const uniqueBodyStyles = useMemo(
    () => [...new Set(ALL_VEHICLES.map((v) => v.body_style))].sort(),
    [],
  )
  const uniqueFuelTypes = useMemo(
    () => [...new Set(ALL_VEHICLES.map((v) => v.fuel_type))].sort(),
    [],
  )
  const uniqueTransmissions = useMemo(
    () => [...new Set(ALL_VEHICLES.map((v) => v.transmission))].sort(),
    [],
  )

  return {
    vehicles: paginated,
    totalCount: sorted.length,
    allCount: ALL_VEHICLES.length,
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
  }
}

export function getVehicleById(id: string): Vehicle | undefined {
  return ALL_VEHICLES.find((v) => v.id === id)
}
