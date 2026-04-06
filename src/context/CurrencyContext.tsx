import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Currency = 'CAD' | 'USD'

const CAD_TO_USD = 0.73

interface CurrencyContextValue {
  currency: Currency
  toggleCurrency: () => void
  formatPrice: (amountCAD: number) => string
  /** Convert a CAD amount to the active currency (numeric, rounded) */
  fromCAD: (amountCAD: number) => number
  /** Convert an amount in the active currency back to CAD (numeric, rounded) */
  toCAD: (amountInCurrency: number) => number
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

function format(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === 'CAD' ? 'en-CA' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('CAD')

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => (prev === 'CAD' ? 'USD' : 'CAD'))
  }, [])

  const fromCAD = useCallback(
    (amountCAD: number) => (currency === 'CAD' ? amountCAD : Math.round(amountCAD * CAD_TO_USD)),
    [currency],
  )

  const toCAD = useCallback(
    (amountInCurrency: number) =>
      currency === 'CAD' ? amountInCurrency : Math.round(amountInCurrency / CAD_TO_USD),
    [currency],
  )

  const formatPrice = useCallback(
    (amountCAD: number) => format(fromCAD(amountCAD), currency),
    [currency, fromCAD],
  )

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, fromCAD, toCAD }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
