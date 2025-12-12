import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type PriceInput = {
  variant?: any
  currencyFallback?: string
}

export function formatPrice({ variant, currencyFallback }: PriceInput) {
  const rawAmount = variant?.calculated_price?.calculated_amount
    ?? variant?.original_price
    ?? variant?.prices?.[0]?.amount

  const currencyCode = variant?.calculated_price?.calculated_currency_code
    ?? variant?.prices?.[0]?.currency_code
    ?? currencyFallback
    ?? 'USD'

  const symbolMap: Record<string, string> = {
    usd: '$',
    eur: '€',
    gbp: '£',
    cad: '$',
    aud: '$',
    sek: 'kr',
    nok: 'kr',
    dkk: 'kr',
  }

  return {
    amount: rawAmount != null ? (rawAmount).toFixed(2) : '0.00',
    currency: currencyCode.toUpperCase(),
    symbol: symbolMap[currencyCode.toLowerCase()],
  }
}
