const PROVINCE_ABBR: Record<string, string> = {
  'British Columbia': 'BC',
  Ontario: 'ON',
  Quebec: 'QC',
  Alberta: 'AB',
  Manitoba: 'MB',
  Saskatchewan: 'SK',
  'Nova Scotia': 'NS',
  'New Brunswick': 'NB',
}

export function abbrevProvince(province: string): string {
  return PROVINCE_ABBR[province] ?? province
}

export function formatCAD(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatOdometer(km: number): string {
  return `${km.toLocaleString('en-CA')} km`
}

/**
 * Normalises the auction hour to today so we get a realistic
 * live / upcoming / ended spread across the 200 vehicles.
 */
export function getAuctionStatus(auctionStart: string): 'upcoming' | 'live' | 'ended' {
  const start = new Date(auctionStart)
  const now = new Date()
  const normalizedStart = new Date(now)
  normalizedStart.setHours(start.getHours(), start.getMinutes(), 0, 0)
  const normalizedEnd = new Date(normalizedStart.getTime() + 3 * 60 * 60 * 1000)
  if (now < normalizedStart) return 'upcoming'
  if (now <= normalizedEnd) return 'live'
  return 'ended'
}

export function getCountdownLabel(auctionStart: string): string {
  const start = new Date(auctionStart)
  const now = new Date()
  const normalizedStart = new Date(now)
  normalizedStart.setHours(start.getHours(), start.getMinutes(), 0, 0)
  const diff = normalizedStart.getTime() - now.getTime()
  if (diff <= 0) return ''
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
