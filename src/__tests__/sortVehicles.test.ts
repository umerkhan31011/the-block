import { describe, it, expect } from 'vitest'
import { sortVehicles } from '../hooks/useVehicles'
import type { Vehicle } from '../types/vehicle'

function makeVehicle(id: string, overrides: Partial<Vehicle> = {}): Vehicle {
  return {
    id,
    vin: `VIN${id}`,
    year: 2020,
    make: 'Toyota',
    model: 'Camry',
    trim: 'SE',
    body_style: 'sedan',
    exterior_color: 'White',
    interior_color: 'Black',
    engine: '2.5L',
    transmission: 'automatic',
    drivetrain: 'FWD',
    odometer_km: 50000,
    fuel_type: 'gasoline',
    condition_grade: 3.5,
    condition_report: '',
    damage_notes: [],
    title_status: 'clean',
    province: 'Ontario',
    city: 'Toronto',
    auction_start: new Date().toISOString(),
    starting_bid: 10000,
    reserve_price: 12000,
    buy_now_price: null,
    images: [],
    selling_dealership: 'Dealer',
    lot: `LOT${id}`,
    current_bid: 0,
    bid_count: 0,
    ...overrides,
  }
}

const vehicles: Vehicle[] = [
  makeVehicle('a', { year: 2018, starting_bid: 15000, current_bid: 0, odometer_km: 80000 }),
  makeVehicle('b', { year: 2022, starting_bid: 5000,  current_bid: 28000, odometer_km: 15000 }),
  makeVehicle('c', { year: 2020, starting_bid: 20000, current_bid: 0, odometer_km: 50000 }),
  makeVehicle('d', { year: 2019, starting_bid: 12000, current_bid: 10000, odometer_km: 65000 }),
]

describe('sortVehicles', () => {
  it('price-asc: sorts by effective price ascending (current_bid || starting_bid)', () => {
    const result = sortVehicles(vehicles, 'price-asc')
    const prices = result.map((v) => v.current_bid || v.starting_bid)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('price-asc: effective prices are current_bid when > 0, else starting_bid', () => {
    // a: starting_bid=15000, current_bid=0  → effective=15000
    // b: starting_bid=5000,  current_bid=28000 → effective=28000
    // c: starting_bid=20000, current_bid=0  → effective=20000
    // d: starting_bid=12000, current_bid=10000 → effective=10000
    // sorted asc: d(10000), a(15000), c(20000), b(28000)
    const result = sortVehicles(vehicles, 'price-asc')
    const ids = result.map((v) => v.id)
    expect(ids).toEqual(['d', 'a', 'c', 'b'])
  })

  it('price-desc: sorts by effective price descending', () => {
    const result = sortVehicles(vehicles, 'price-desc')
    const prices = result.map((v) => v.current_bid || v.starting_bid)
    expect(prices).toEqual([...prices].sort((a, b) => b - a))
  })

  it('year-desc: sorts by year newest first', () => {
    const result = sortVehicles(vehicles, 'year-desc')
    const years = result.map((v) => v.year)
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })

  it('year-asc: sorts by year oldest first', () => {
    const result = sortVehicles(vehicles, 'year-asc')
    const years = result.map((v) => v.year)
    expect(years).toEqual([...years].sort((a, b) => a - b))
    expect(years[0]).toBe(2018)
    expect(years[years.length - 1]).toBe(2022)
  })

  it('mileage-asc: sorts by odometer ascending', () => {
    const result = sortVehicles(vehicles, 'mileage-asc')
    const kms = result.map((v) => v.odometer_km)
    expect(kms).toEqual([...kms].sort((a, b) => a - b))
    expect(kms[0]).toBe(15000)
    expect(kms[kms.length - 1]).toBe(80000)
  })

  it('does not mutate the original array', () => {
    const original = [...vehicles]
    sortVehicles(vehicles, 'year-asc')
    expect(vehicles).toEqual(original)
  })
})
