import { useEffect, useRef } from 'react'
import type { Vehicle } from '../types/vehicle'
import { useCurrency } from '../context/CurrencyContext'

interface Props {
  vehicle: Vehicle
  onConfirm: () => void
  onCancel: () => void
}

export function BuyNowModal({ vehicle, onConfirm, onCancel }: Props) {
  const { formatPrice } = useCurrency()
  const confirmRef = useRef<HTMLButtonElement>(null)

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onCancel])

  // Focus confirm button on open
  useEffect(() => {
    confirmRef.current?.focus()
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="buy-now-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h2 id="buy-now-title" className="text-lg font-bold text-gray-900">
            Confirm Purchase
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1 -mt-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 -mt-2">
          You're about to buy this vehicle immediately at the listed Buy Now price.
        </p>

        {/* Vehicle summary */}
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1">
          <p className="font-semibold text-gray-900 leading-snug">
            {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Lot {vehicle.lot} · {vehicle.vin}</p>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Buy Now Price</p>
            <p className="text-3xl font-bold text-orange-600 leading-tight mt-0.5">
              {formatPrice(vehicle.buy_now_price!)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            Buy for {formatPrice(vehicle.buy_now_price!)}
          </button>
        </div>
      </div>
    </div>
  )
}
