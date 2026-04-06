import { describe, it, expect } from 'vitest'
import { filterVehicles, DEFAULT_FILTERS, type Filters } from '../hooks/useVehicles'
import type { Vehicle } from '../types/vehicle'

// Minimal vehicle factory for tests
function makeVehicle(overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id: 'v1',
    vin: '1HGCM82633A004352',
    year: 2020,
    make: 'Toyota',
    model: 'Camry',
    trim: 'SE',
    body_style: 'sedan',
    exterior_color: 'White',
    interior_color: 'Black',
    engine: '2.5L 4-cyl',
    transmission: 'automatic',
    drivetrain: 'FWD',
    odometer_km: 40000,
    fuel_type: 'gasoline',
    condition_grade: 4.0,
    condition_report: 'Good condition.',
    damage_notes: [],
    title_status: 'clean',
    province: 'Ontario',
    city: 'Toronto',
    auction_start: new Date().toISOString(),
    starting_bid: 10000,
    reserve_price: 12000,
    buy_now_price: null,
    images: ['https://example.com/img.jpg'],
    selling_dealership: 'Test Dealer',
    lot: 'LOT001',
    current_bid: 0,
    bid_count: 0,
    ...overrides,
  }
}

const vehicles: Vehicle[] = [
  makeVehicle({ id: 'v1', make: 'Toyota', model: 'Camry', year: 2020, starting_bid: 10000, current_bid: 0, fuel_type: 'gasoline', body_style: 'sedan', transmission: 'automatic', title_status: 'clean', city: 'Toronto' }),
  makeVehicle({ id: 'v2', make: 'Honda', model: 'Civic', year: 2018, starting_bid: 8000, current_bid: 9000, fuel_type: 'gasoline', body_style: 'sedan', transmission: 'manual', title_status: 'clean', city: 'Vancouver', vin: '2T1BURHE0JC028765', lot: 'LOT002' }),
  makeVehicle({ id: 'v3', make: 'Ford', model: 'F-150', year: 2022, starting_bid: 25000, current_bid: 0, fuel_type: 'gasoline', body_style: 'truck', transmission: 'automatic', title_status: 'salvage', city: 'Calgary', vin: '1FTEW1EG4JFB12345', lot: 'LOT003' }),
  makeVehicle({ id: 'v4', make: 'Tesla', model: 'Model 3', year: 2021, starting_bid: 35000, current_bid: 37000, fuel_type: 'electric', body_style: 'sedan', transmission: 'automatic', title_status: 'clean', city: 'Ottawa', vin: '5YJ3E1EA1JF012345', lot: 'LOT004' }),
  makeVehicle({ id: 'v5', make: 'Toyota', model: 'RAV4', year: 2019, starting_bid: 20000, current_bid: 21000, fuel_type: 'hybrid', body_style: 'suv', transmission: 'automatic', title_status: 'rebuilt', city: 'Montreal', vin: '2T3RFREV9JW123456', lot: 'LOT005' }),
]

describe('filterVehicles', () => {
  it('returns all vehicles when no filters applied', () => {
    const result = filterVehicles(vehicles, DEFAULT_FILTERS)
    expect(result).toHaveLength(vehicles.length)
  })

  describe('search filter', () => {
    it('filters by make (case-insensitive)', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, search: 'toyota' })
      expect(result).toHaveLength(2)
      expect(result.map((v) => v.id)).toEqual(expect.arrayContaining(['v1', 'v5']))
    })

    it('filters by model', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, search: 'civic' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('v2')
    })

    it('filters by city', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, search: 'Vancouver' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('v2')
    })

    it('filters by year string', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, search: '2022' })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('v3')
    })

    it('returns empty array when no match', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, search: 'Lamborghini' })
      expect(result).toHaveLength(0)
    })
  })

  describe('make filter', () => {
    it('filters to selected makes only', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, makes: ['Toyota', 'Honda'] })
      expect(result).toHaveLength(3)
      result.forEach((v) => expect(['Toyota', 'Honda']).toContain(v.make))
    })

    it('returns empty when no vehicles match make', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, makes: ['BMW'] })
      expect(result).toHaveLength(0)
    })
  })

  describe('body style filter', () => {
    it('filters by body style', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, bodyStyles: ['truck'] })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('v3')
    })

    it('filters by multiple body styles', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, bodyStyles: ['sedan', 'suv'] })
      expect(result).toHaveLength(4)
    })
  })

  describe('fuel type filter', () => {
    it('filters by electric', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, fuelTypes: ['electric'] })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('v4')
    })
  })

  describe('transmission filter', () => {
    it('filters by manual', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, transmissions: ['manual'] })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('v2')
    })
  })

  describe('title status filter', () => {
    it('filters by salvage', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, titleStatuses: ['salvage'] })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('v3')
    })

    it('filters by multiple statuses', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, titleStatuses: ['salvage', 'rebuilt'] })
      expect(result).toHaveLength(2)
    })
  })

  describe('year range filter', () => {
    it('filters by minYear', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, minYear: 2021 })
      expect(result).toHaveLength(2)
      result.forEach((v) => expect(v.year).toBeGreaterThanOrEqual(2021))
    })

    it('filters by maxYear', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, maxYear: 2019 })
      expect(result).toHaveLength(2)
      result.forEach((v) => expect(v.year).toBeLessThanOrEqual(2019))
    })

    it('filters by year range', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, minYear: 2019, maxYear: 2021 })
      expect(result).toHaveLength(3)
      result.forEach((v) => {
        expect(v.year).toBeGreaterThanOrEqual(2019)
        expect(v.year).toBeLessThanOrEqual(2021)
      })
    })
  })

  describe('price range filter', () => {
    it('filters by minPrice using effective price (current_bid when > 0, else starting_bid)', () => {
      // Effective prices: v1=10000 (starting), v2=9000 (current), v3=25000 (starting), v4=37000 (current), v5=21000 (current)
      // minPrice 25000 → v3 (25000) and v4 (37000) pass; v1, v2, v5 are excluded
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, minPrice: 25000 })
      expect(result).toHaveLength(2)
      expect(result.map((v) => v.id)).toEqual(expect.arrayContaining(['v3', 'v4']))
    })

    it('filters by maxPrice', () => {
      const result = filterVehicles(vehicles, { ...DEFAULT_FILTERS, maxPrice: 10000 })
      expect(result.map((v) => v.id)).toEqual(expect.arrayContaining(['v1', 'v2']))
    })
  })

  describe('combined filters', () => {
    it('applies multiple filters simultaneously', () => {
      const filters: Filters = {
        ...DEFAULT_FILTERS,
        makes: ['Toyota'],
        fuelTypes: ['gasoline'],
      }
      const result = filterVehicles(vehicles, filters)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('v1')
    })
  })
})
