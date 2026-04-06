import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'

export interface UserBid {
  amount: number
  timestamp: string
}

export interface Purchase {
  amount: number
  timestamp: string
}

interface BidState {
  bids: Record<string, UserBid[]>
  purchases: Record<string, Purchase>
}

type BidAction =
  | { type: 'PLACE_BID'; vehicleId: string; amount: number }
  | { type: 'BUY_NOW'; vehicleId: string; amount: number }

const STORAGE_KEY = 'the-block-bids-v1'

function loadFromStorage(): BidState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<BidState>
      return { bids: parsed.bids ?? {}, purchases: parsed.purchases ?? {} }
    }
  } catch {
    // ignore parse errors — start fresh
  }
  return { bids: {}, purchases: {} }
}

export function bidReducer(state: BidState, action: BidAction): BidState {
  switch (action.type) {
    case 'PLACE_BID': {
      const existing = state.bids[action.vehicleId] ?? []
      return {
        ...state,
        bids: {
          ...state.bids,
          [action.vehicleId]: [
            ...existing,
            { amount: action.amount, timestamp: new Date().toISOString() },
          ],
        },
      }
    }
    case 'BUY_NOW': {
      return {
        ...state,
        purchases: {
          ...state.purchases,
          [action.vehicleId]: { amount: action.amount, timestamp: new Date().toISOString() },
        },
      }
    }
    default:
      return state
  }
}

interface BidContextValue {
  placeBid: (vehicleId: string, amount: number) => void
  buyNow: (vehicleId: string, amount: number) => void
  getHighestUserBid: (vehicleId: string) => number | null
  getUserBids: (vehicleId: string) => UserBid[]
  getPurchase: (vehicleId: string) => Purchase | null
}

const BidContext = createContext<BidContextValue | null>(null)

export function BidProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bidReducer, undefined, loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function placeBid(vehicleId: string, amount: number) {
    dispatch({ type: 'PLACE_BID', vehicleId, amount })
  }

  function buyNow(vehicleId: string, amount: number) {
    dispatch({ type: 'BUY_NOW', vehicleId, amount })
  }

  function getHighestUserBid(vehicleId: string): number | null {
    const bids = state.bids[vehicleId]
    if (!bids || bids.length === 0) return null
    return Math.max(...bids.map((b) => b.amount))
  }

  function getUserBids(vehicleId: string): UserBid[] {
    return state.bids[vehicleId] ?? []
  }

  function getPurchase(vehicleId: string): Purchase | null {
    return state.purchases[vehicleId] ?? null
  }

  return (
    <BidContext.Provider value={{ placeBid, buyNow, getHighestUserBid, getUserBids, getPurchase }}>
      {children}
    </BidContext.Provider>
  )
}

export function useBidContext(): BidContextValue {
  const ctx = useContext(BidContext)
  if (!ctx) throw new Error('useBidContext must be used within BidProvider')
  return ctx
}
