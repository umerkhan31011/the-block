import { useState, useEffect } from 'react'
import { getAuctionStatus } from '../lib/format'

interface Props {
  auctionStart: string
}

function getRemainingSeconds(auctionStart: string): number {
  const start = new Date(auctionStart)
  const now = new Date()
  const normalizedStart = new Date(now)
  normalizedStart.setHours(start.getHours(), start.getMinutes(), 0, 0)
  const normalizedEnd = new Date(normalizedStart.getTime() + 3 * 60 * 60 * 1000)
  return Math.max(0, Math.floor((normalizedEnd.getTime() - now.getTime()) / 1000))
}

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) {
    return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  }
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
}

export function AuctionCountdown({ auctionStart }: Props) {
  const [seconds, setSeconds] = useState(() => getRemainingSeconds(auctionStart))
  const status = getAuctionStatus(auctionStart)

  useEffect(() => {
    if (status !== 'live') return
    const id = setInterval(() => {
      setSeconds(getRemainingSeconds(auctionStart))
    }, 1000)
    return () => clearInterval(id)
  }, [auctionStart, status])

  if (status !== 'live') return null

  return (
    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
      {/* Pulsing dot */}
      <span className="relative flex h-3 w-3 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
      </span>
      <div>
        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide leading-none mb-1">
          Auction Live — Ends in
        </p>
        {seconds > 0 ? (
          <p className="text-2xl font-bold text-green-800 tabular-nums leading-tight">
            {formatCountdown(seconds)}
          </p>
        ) : (
          <p className="text-sm font-semibold text-green-700">Closing now…</p>
        )}
      </div>
    </div>
  )
}
