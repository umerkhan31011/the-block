import { useState, type FormEvent } from 'react'
import type { Vehicle } from '../types/vehicle'
import { useBidContext } from '../context/BidContext'
import { useCurrency } from '../context/CurrencyContext'
import { BuyNowModal } from './BuyNowModal'

interface BidFormProps {
  vehicle: Vehicle
}

export function BidForm({ vehicle }: BidFormProps) {
  const { placeBid, buyNow, getHighestUserBid, getUserBids, getPurchase } = useBidContext()
  const { formatPrice, currency, fromCAD, toCAD } = useCurrency()
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showBuyNowModal, setShowBuyNowModal] = useState(false)

  const userHighest = getHighestUserBid(vehicle.id)
  const purchase = getPurchase(vehicle.id)
  const effectiveBid =
    userHighest !== null ? Math.max(vehicle.current_bid, userHighest) : vehicle.current_bid
  const hasBids = effectiveBid > 0
  // minBid in CAD (canonical currency)
  const minBidCAD = hasBids ? effectiveBid + 100 : vehicle.starting_bid
  // minBid in the active display currency for input validation
  const minBidDisplay = fromCAD(minBidCAD)
  const userBids = getUserBids(vehicle.id)
  const totalBids = vehicle.bid_count + userBids.length
  const isHighestBidder = userHighest !== null && userHighest >= effectiveBid && effectiveBid > 0
  const reserveMet = effectiveBid >= vehicle.reserve_price

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const amount = parseInt(inputValue.replace(/[^0-9]/g, ''), 10)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid bid amount.')
      return
    }
    if (amount < minBidDisplay) {
      setError(`Minimum bid is ${formatPrice(minBidCAD)}.`)
      return
    }
    // Convert the user's input (in display currency) back to CAD for storage
    const amountCAD = toCAD(amount)
    placeBid(vehicle.id, amountCAD)
    setInputValue('')
    setError('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Bid summary */}
      <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              {hasBids ? 'Current Bid' : 'Starting Bid'}
            </p>
            <p className="text-2xl font-bold text-gray-900 leading-tight">
              {formatPrice(hasBids ? effectiveBid : vehicle.starting_bid)}
            </p>
            {totalBids > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">
                {totalBids} bid{totalBids !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
              Reserve
            </p>
            <p
              className={`text-sm font-semibold mt-2 ${
                reserveMet ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              {reserveMet ? '✓ Reserve met' : '✗ Not met'}
            </p>
          </div>
        </div>

        {vehicle.buy_now_price && (
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                Buy Now Price
              </p>
              <p className="text-lg font-bold text-orange-600">
                {formatPrice(vehicle.buy_now_price)}
              </p>
            </div>
            {!purchase && (
              <button
                type="button"
                onClick={() => setShowBuyNowModal(true)}
                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex-shrink-0"
              >
                Buy Now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Purchased banner */}
      {purchase && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 text-sm text-orange-800 font-medium flex items-center gap-2">
          <span>🎉</span>
          <span>Purchased for {formatPrice(purchase.amount)} on {new Date(purchase.timestamp).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      )}

      {/* Highest bidder banner */}
      {isHighestBidder && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3 text-sm text-indigo-800 font-medium flex items-center gap-2">
          <span>🏆</span>
          <span>You're the highest bidder at {formatPrice(userHighest!)}</span>
        </div>
      )}

      {/* Success banner */}
      {success && !isHighestBidder && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 font-medium">
          ✓ Your bid was placed successfully!
        </div>
      )}

      {/* Bid form — hidden after purchase */}
      {!purchase && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-600" htmlFor="bid-input">
            Your bid ({currency}) — min {formatPrice(minBidCAD)}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm select-none">
                $
              </span>
              <input
                id="bid-input"
                type="number"
                min={minBidDisplay}
                step={1}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  if (error) setError('')
                }}
                placeholder={String(minBidDisplay)}
                className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              Place Bid
            </button>
          </div>
          {error && <p className="text-red-600 text-xs">{error}</p>}
        </form>
      )}

      {/* Buy Now modal */}
      {showBuyNowModal && vehicle.buy_now_price && (
        <BuyNowModal
          vehicle={vehicle}
          onCancel={() => setShowBuyNowModal(false)}
          onConfirm={() => {
            buyNow(vehicle.id, vehicle.buy_now_price!)
            setShowBuyNowModal(false)
          }}
        />
      )}

      {/* Bid history */}
      {userBids.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Your Bids
            </h4>
          </div>
          <ul className="divide-y divide-gray-100">
            {[...userBids].reverse().map((bid, i) => (
              <li key={i} className="flex items-center justify-between px-4 py-2.5">
                <span className="font-semibold text-gray-800 text-sm">
                  {formatPrice(bid.amount)}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(bid.timestamp).toLocaleString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
