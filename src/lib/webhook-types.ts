// Types for webhook response data

export interface WebhookHotel {
  id: string
  title: string
  price: number
  currency: string
  rating: string // e.g. "RATING_4"
  image: string
  location: string
  description: string
  bb: boolean
  hb: boolean
  fb: boolean
  ai: boolean
  bbCena?: { amountMicros: number; currencyCode: string }
  hbCena?: { amountMicros: number; currencyCode: string }
  fbCena?: { amountMicros: number; currencyCode: string }
  aiCena?: { amountMicros: number; currencyCode: string }
  transfer: boolean
  transferPrice?: { amountMicros: number; currencyCode: string }
}

export function parseRatingStars(rating: string | null | undefined): number {
  if (!rating) return 4
  const match = rating.match(/(\d+)/)
  return match ? parseInt(match[1]) : 4
}

export function micros(price?: { amountMicros: number }): number {
  return price ? price.amountMicros / 1_000_000 : 0
}

export type MealKey = "bb" | "hb" | "fb" | "ai"

export const mealLabels: Record<MealKey, string> = {
  bb: "Raňajky",
  hb: "Polpenzia",
  fb: "Plná penzia",
  ai: "All inclusive",
}

export const mealPriceKeys: Record<MealKey, "bbCena" | "hbCena" | "fbCena" | "aiCena"> = {
  bb: "bbCena",
  hb: "hbCena",
  fb: "fbCena",
  ai: "aiCena",
}

export interface HotelPricing {
  basePrice: number
  baseMeal: MealKey | null
  mealPrices: Partial<Record<MealKey, number>>
}

/**
 * Compute effective hotel pricing.
 * - If hotel.price > 0: basePrice = hotel.price, all meals priced absolutely (micros).
 * - If hotel.price = 0: basePrice = highest available meal price (full daily package),
 *   that meal becomes baseMeal with surcharge 0; other available meals keep their
 *   raw cena value as a daily surcharge.
 */
export function getHotelPricing(hotel: WebhookHotel): HotelPricing {
  const keys: MealKey[] = ["bb", "hb", "fb", "ai"]
  const available = keys.filter((k) => hotel[k])
  const rawPrices: Partial<Record<MealKey, number>> = {}
  for (const k of available) {
    rawPrices[k] = micros(hotel[mealPriceKeys[k]])
  }

  if (hotel.price && hotel.price > 0) {
    return { basePrice: hotel.price, baseMeal: null, mealPrices: rawPrices }
  }

  // hotel.price is 0/empty → derive from meals
  if (available.length === 0) {
    return { basePrice: 0, baseMeal: null, mealPrices: {} }
  }

  let baseMeal: MealKey = available[0]
  let basePrice = rawPrices[baseMeal] ?? 0
  for (const k of available) {
    const p = rawPrices[k] ?? 0
    if (p > basePrice) {
      basePrice = p
      baseMeal = k
    }
  }

  const mealPrices: Partial<Record<MealKey, number>> = {}
  for (const k of available) {
    mealPrices[k] = k === baseMeal ? 0 : (rawPrices[k] ?? 0)
  }

  return { basePrice, baseMeal, mealPrices }
}
