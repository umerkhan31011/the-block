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
 * Normalises auction times so we always get a realistic mix of
 * live / upcoming / ended across the 200 vehicles regardless of
 * what time of day you open the app.
 *
 * The data has hours 09–20 (12-hour span, centre 14.5).
 * We map that onto [pageLoad − 6h … pageLoad + 6h] using a fixed
 * reference time captured once at page load. This way the offsets
 * are stable and countdowns actually tick down.
 */
const PAGE_LOAD = Date.now()

export function normalizeAuctionTime(auctionStart: string): Date {
  const start = new Date(auctionStart)
  const hour = start.getHours()
  const minute = start.getMinutes()
  // Original data spans hours 9–20 (12 hours).
  // Map that to [pageLoad-6h .. pageLoad+6h] so there's always a spread.
  const offsetHours = (hour + minute / 60) - 14.5 // centre of 9–20 is 14.5
  return new Date(PAGE_LOAD + offsetHours * 3_600_000)
}

export function getAuctionStatus(auctionStart: string): 'upcoming' | 'live' | 'ended' {
  const now = new Date()
  const normalizedStart = normalizeAuctionTime(auctionStart)
  const normalizedEnd = new Date(normalizedStart.getTime() + 3 * 60 * 60 * 1000)
  if (now < normalizedStart) return 'upcoming'
  if (now <= normalizedEnd) return 'live'
  return 'ended'
}

export function getCountdownLabel(auctionStart: string): string {
  const now = new Date()
  const normalizedStart = normalizeAuctionTime(auctionStart)
  const diff = normalizedStart.getTime() - now.getTime()
  if (diff <= 0) return ''
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
