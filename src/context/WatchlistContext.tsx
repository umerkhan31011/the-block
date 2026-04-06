import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'the-block-watchlist-v1'

interface WatchlistContextValue {
  toggle: (vehicleId: string) => void
  isWatched: (vehicleId: string) => boolean
  count: number
  watchedIds: Set<string>
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null)

function loadWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as string[]
  } catch {
    // ignore parse errors
  }
  return []
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set(loadWatchlist()))

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  }, [ids])

  function toggle(vehicleId: string) {
    setIds((prev) => {
      const next = new Set(prev)
      if (next.has(vehicleId)) next.delete(vehicleId)
      else next.add(vehicleId)
      return next
    })
  }

  function isWatched(vehicleId: string) {
    return ids.has(vehicleId)
  }

  return (
    <WatchlistContext.Provider value={{ toggle, isWatched, count: ids.size, watchedIds: ids }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
