import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { hotelsByDestination } from "@/lib/hotels-database"
import { destinationToCountryCode, convertMonthsToWebhookFormat } from "@/lib/destination-mapping"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface SummaryPageProps {
  configuration: any
  onEdit: () => void
  onChat: () => void
}

export default function SummaryPage({ configuration, onEdit }: SummaryPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatList = (arr: string[]) => arr && arr.length > 0 ? arr.join(", ") : "—"

  const getHotelDetails = () => {
    if (configuration.hotel && configuration.destination) {
      const destination = configuration.destination as keyof typeof hotelsByDestination
      const hotels = hotelsByDestination[destination] || []
      return hotels.find((h) => h.id === configuration.hotel)
    }
    return null
  }

  const hotelDetails = getHotelDetails()

  const calculateEarningsRange = () => {
    const rewardPerParticipant = Number.parseInt(configuration.trainerReward ?? "50") || 50
    const participantStr = configuration.participants || "8-12"
    const match = participantStr.match(/(\d+)\s*[–—-]\s*(\d+)/)
    if (match) {
      const minP = Number.parseInt(match[1])
      const maxP = Number.parseInt(match[2])
      return { min: rewardPerParticipant * minP, max: rewardPerParticipant * maxP, minParticipants: minP, maxParticipants: maxP }
    }
    const participants = Number.parseInt(participantStr.match(/(\d+)/)?.[1] || "8")
    return { min: rewardPerParticipant * participants, max: rewardPerParticipant * participants, minParticipants: participants, maxParticipants: participants }
  }

  const displayTrainerReward = Number.parseInt(configuration.trainerReward ?? "50") || 50
  const earningsRange = calculateEarningsRange()

  const handleProceedToChat = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)

    try {
      const participantStr = configuration.participants || "8"
      const minParticipants = Number.parseInt(participantStr.match(/(\d+)/)?.[1] || "8")

      const configData = {
        destination: destinationToCountryCode[configuration.destination] || configuration.destination || "",
        months: convertMonthsToWebhookFormat(configuration.months || []),
        duration: configuration.duration || "",
        participants: configuration.participants || "",
        campType: configuration.campType || "",
        hotel: { id: hotelDetails?.id || "", name: hotelDetails?.name || "", stars: hotelDetails?.stars || 0 },
        meals: configuration.meals || "",
        transfer: configuration.transfer || false,
        extras: configuration.extras || [],
        trainerReward: Number.parseInt(configuration.trainerReward ?? "50") || 50,
        totalPrice: (configuration.budgetPerPerson || 0) * minParticipants,
        trainerName: configuration.trainerName || "",
        trainerExperience: configuration.trainerExperience || "",
        trainerSpecialization: configuration.trainerSpecialization || "",
        trainerCertificates: configuration.trainerCertificates || "",
        trainerBio: configuration.trainerBio || "",
        dailyProgram: configuration.dailyProgram || "",
        specialActivities: configuration.specialActivities || "",
      }

      console.log("[TripHERO] Camp configuration:", configData)

      const { data, error: fnError } = await supabase.functions.invoke('generate-camp-preview', {
        body: configData,
      })

      if (fnError) {
        console.error("[TripHERO] Camp preview error:", fnError)
        setError("Nepodarilo sa vygenerovať náhľad. Skúste to prosím znova.")
        setIsSubmitting(false)
        return
      }

      console.log("[TripHERO] Camp preview response:", data)
      // TODO: Handle the camp preview response (e.g. navigate to preview page)
      setIsSubmitting(false)
    } catch (error) {
      console.error("[TripHERO] Error:", error)
      setError("Nepodarilo sa vygenerovať náhľad. Skúste to prosím znova.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Súhrn vášho campu</h1>
          <p className="text-muted-foreground">Skontrolujte detaily pred pokračovaním</p>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="px-6 py-6">
                <h3 className="font-semibold text-foreground mb-4">Základné informácie</h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-muted-foreground">Destinácia</p><p className="font-medium text-foreground">{configuration.destination || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Termín</p><p className="font-medium text-foreground">{configuration.months?.length > 0 ? configuration.months.join(", ") : "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Trvanie</p><p className="font-medium text-foreground">{configuration.duration || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Počet účastníkov</p><p className="font-medium text-foreground">{configuration.participants || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Typ campu</p><p className="font-medium text-foreground">{configuration.campType || "—"}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="px-6 py-6">
                <h3 className="font-semibold text-foreground mb-4">Ubytovanie a služby</h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-muted-foreground">Hotel</p><p className="font-medium text-foreground">{hotelDetails ? hotelDetails.name : "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Trieda hotela</p><p className="font-medium text-foreground">{hotelDetails ? `${"⭐".repeat(hotelDetails.stars)}` : "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Strava</p><p className="font-medium text-foreground">{configuration.meals || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Transfer</p><p className="font-medium text-foreground">{configuration.transfer ? "Áno" : "Nie"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Extra služby</p><p className="font-medium text-foreground">{formatList(configuration.extras)}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Card className="border-2 border-accent bg-accent/5 w-full md:w-1/2">
              <CardContent className="px-6 py-6">
                <h3 className="font-semibold text-foreground mb-4">Biznis nastavenia</h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-muted-foreground">Výška odmeny na jedného účastníka</p><p className="font-medium text-foreground">{displayTrainerReward} €</p></div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Spolu zarobíš</p>
                    <p className="text-2xl font-bold text-accent">{earningsRange.min.toLocaleString()} € - {earningsRange.max.toLocaleString()} €</p>
                    <p className="text-xs text-muted-foreground mt-2">Pri počte účastníkov {earningsRange.minParticipants} - {earningsRange.maxParticipants}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
          <div className="flex gap-4">
            <Button onClick={onEdit} variant="outline" disabled={isSubmitting}>← Upraviť</Button>
            <Button onClick={handleProceedToChat} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <><div className="animate-spin w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full" />Generujem náhľad...</>
              ) : "Zobraziť náhľad campu"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
