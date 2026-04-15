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
