import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { hotelsByDestination } from "@/lib/hotels-database"

interface SummaryPageProps {
  configuration: any
  onEdit: () => void
}

export default function SummaryPage({ configuration, onEdit, onChat }: SummaryPageProps) {
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

        <div className="flex gap-4">
          <Button onClick={onEdit} variant="outline">← Upraviť</Button>
          <Button onClick={onChat} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground flex-1">
            Pokračovať na AI Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
