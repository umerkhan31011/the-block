import { describe, it, expect } from 'vitest'
import { bidReducer } from '../context/BidContext'
import type { UserBid, Purchase } from '../context/BidContext'

interface BidState {
  bids: Record<string, UserBid[]>
  purchases: Record<string, Purchase>
}

const EMPTY_STATE: BidState = { bids: {}, purchases: {} }

describe('bidReducer', () => {
  describe('PLACE_BID', () => {
    it('adds a new bid entry for a vehicle', () => {
      const state = bidReducer(EMPTY_STATE, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 15000,
      })

      expect(state.bids['v1']).toHaveLength(1)
      expect(state.bids['v1'][0].amount).toBe(15000)
      expect(typeof state.bids['v1'][0].timestamp).toBe('string')
    })

    it('appends additional bids for the same vehicle', () => {
      let state = bidReducer(EMPTY_STATE, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 10000,
      })
      state = bidReducer(state, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 11000,
      })
      state = bidReducer(state, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 12000,
      })

      expect(state.bids['v1']).toHaveLength(3)
      expect(state.bids['v1'].map((b) => b.amount)).toEqual([10000, 11000, 12000])
    })

    it('keeps bids for different vehicles separate', () => {
      let state = bidReducer(EMPTY_STATE, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 5000,
      })
      state = bidReducer(state, {
        type: 'PLACE_BID',
        vehicleId: 'v2',
        amount: 20000,
      })

      expect(state.bids['v1']).toHaveLength(1)
      expect(state.bids['v2']).toHaveLength(1)
      expect(state.bids['v1'][0].amount).toBe(5000)
      expect(state.bids['v2'][0].amount).toBe(20000)
    })

    it('does not mutate purchases when placing a bid', () => {
      const state = bidReducer(EMPTY_STATE, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 5000,
      })

      expect(state.purchases).toEqual({})
    })

    it('stores an ISO timestamp with each bid', () => {
      const before = Date.now()
      const state = bidReducer(EMPTY_STATE, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 5000,
      })
      const after = Date.now()

      const ts = new Date(state.bids['v1'][0].timestamp).getTime()
      expect(ts).toBeGreaterThanOrEqual(before)
      expect(ts).toBeLessThanOrEqual(after)
    })
  })

  describe('BUY_NOW', () => {
    it('records a purchase for the vehicle', () => {
      const state = bidReducer(EMPTY_STATE, {
        type: 'BUY_NOW',
        vehicleId: 'v1',
        amount: 30000,
      })

      expect(state.purchases['v1']).toBeDefined()
      expect(state.purchases['v1'].amount).toBe(30000)
      expect(typeof state.purchases['v1'].timestamp).toBe('string')
    })

    it('overwrites an existing purchase for the same vehicle', () => {
      let state = bidReducer(EMPTY_STATE, {
        type: 'BUY_NOW',
        vehicleId: 'v1',
        amount: 30000,
      })
      state = bidReducer(state, {
        type: 'BUY_NOW',
        vehicleId: 'v1',
        amount: 28000,
      })

      expect(state.purchases['v1'].amount).toBe(28000)
    })

    it('keeps purchases for different vehicles separate', () => {
      let state = bidReducer(EMPTY_STATE, {
        type: 'BUY_NOW',
        vehicleId: 'v1',
        amount: 10000,
      })
      state = bidReducer(state, {
        type: 'BUY_NOW',
        vehicleId: 'v2',
        amount: 50000,
      })

      expect(state.purchases['v1'].amount).toBe(10000)
      expect(state.purchases['v2'].amount).toBe(50000)
    })

    it('does not affect existing bids when buying', () => {
      let state = bidReducer(EMPTY_STATE, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 5000,
      })
      state = bidReducer(state, {
        type: 'BUY_NOW',
        vehicleId: 'v1',
        amount: 30000,
      })

      expect(state.bids['v1']).toHaveLength(1)
      expect(state.bids['v1'][0].amount).toBe(5000)
    })

    it('stores an ISO timestamp with each purchase', () => {
      const before = Date.now()
      const state = bidReducer(EMPTY_STATE, {
        type: 'BUY_NOW',
        vehicleId: 'v1',
        amount: 30000,
      })
      const after = Date.now()

      const ts = new Date(state.purchases['v1'].timestamp).getTime()
      expect(ts).toBeGreaterThanOrEqual(before)
      expect(ts).toBeLessThanOrEqual(after)
    })
  })

  describe('immutability', () => {
    it('returns a new state object on PLACE_BID', () => {
      const newState = bidReducer(EMPTY_STATE, {
        type: 'PLACE_BID',
        vehicleId: 'v1',
        amount: 5000,
      })
      expect(newState).not.toBe(EMPTY_STATE)
    })

    it('returns a new state object on BUY_NOW', () => {
      const newState = bidReducer(EMPTY_STATE, {
        type: 'BUY_NOW',
        vehicleId: 'v1',
        amount: 5000,
      })
      expect(newState).not.toBe(EMPTY_STATE)
    })
  })
})
