/**
 * n8n webhook URLs (z triphero-leap).
 * V Supabase Edge Functions nastav env:
 * - N8N_TRIP_PREVIEW_WEBHOOK_URL = TRIP_PREVIEW_WEBHOOK_URL (náhľad tripu)
 * - N8N_FLIGHT_PRICES_WEBHOOK_URL = FLIGHT_PRICES_WEBHOOK_URL (step1 – ceny letov)
 */
export const TRIP_PREVIEW_WEBHOOK_URL = "https://n8n.codeblocks.sk/webhook/3b6f62b9-dc0c-4902-bfd7-956f0bb23021"
export const FLIGHT_PRICES_WEBHOOK_URL = "https://n8n.codeblocks.sk/webhook/73b1e138-9659-4bde-9731-1031b26668fb"

const WEBHOOK_URL = TRIP_PREVIEW_WEBHOOK_URL

export interface TripConfigurationData {
  timestamp: string
  configuration: {
    // Základné informácie
    destination: string
    months: string[]
    duration: string
    participants: string
    tripType: string

    // Ubytovanie a služby
    hotel: {
      id: string
      name: string
      stars: number
    }
    meals: string
    transfer: boolean
    extras: string[]

    // Biznis nastavenia
    trainerReward: number
    totalEarnings: number

    // Odhadovaná cena
    budgetPerPerson: number
    totalPrice: number
  }
}

export async function sendTripConfiguration(
   data: TripConfigurationData,
): Promise<{ success: boolean; error?: string }> {
  console.log("[TripHERO] Sending data to webhook:", WEBHOOK_URL)
  console.log("[TripHERO] Payload:", JSON.stringify(data, null, 2))

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    console.log("[TripHERO] Response status:", response.status)
    const responseText = await response.text()
    console.log("[TripHERO] Response body:", responseText)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`)
    }

    return { success: true }
  } catch (error) {
    console.error("[TripHERO] Webhook error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Nepodarilo sa odoslať dáta",
    }
  }
}
