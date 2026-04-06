import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Vehicle } from '../types/vehicle'

const MAX_COMPARE = 3

interface CompareContextValue {
  compareList: Vehicle[]
  toggle: (vehicle: Vehicle) => void
  isInCompare: (vehicleId: string) => boolean
  clear: () => void
  canAdd: boolean
}

const CompareContext = createContext<CompareContextValue | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Vehicle[]>([])

  function toggle(vehicle: Vehicle) {
    setCompareList((prev) => {
      if (prev.some((v) => v.id === vehicle.id)) {
        return prev.filter((v) => v.id !== vehicle.id)
      }
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, vehicle]
    })
  }

  function isInCompare(vehicleId: string) {
    return compareList.some((v) => v.id === vehicleId)
  }

  function clear() {
    setCompareList([])
  }

  return (
    <CompareContext.Provider
      value={{ compareList, toggle, isInCompare, clear, canAdd: compareList.length < MAX_COMPARE }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
