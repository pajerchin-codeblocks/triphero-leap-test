import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { hotelsByDestination } from "@/lib/hotels-database"
import { supabase } from "@/integrations/supabase/client"
import { Sparkles, Copy, ExternalLink, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const emailSchema = z.string().trim().email({ message: "Zadajte platný email" }).max(255)

interface SummaryPageProps {
  configuration: any
  onEdit: () => void
}

export default function SummaryPage({ configuration, onEdit }: SummaryPageProps) {
  const [generating, setGenerating] = useState(false)
  const [previewLink, setPreviewLink] = useState<string | null>(null)
  const [trainerNameForAccess, setTrainerNameForAccess] = useState<string | null>(null)
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return ""
    return sessionStorage.getItem("triphero_email") || ""
  })
  const [consent, setConsent] = useState(false)

  // Persist email medzi návratmi na summary page (v rámci tej istej session).
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("triphero_email", value)
    }
  }
  const { toast } = useToast()

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

  const handleGeneratePreview = async () => {
    if (!configuration.trainerName) {
      toast({
        title: "Chýba meno trénera",
        description: "Vráťte sa späť a vyplňte meno trénera v kroku 4.",
        variant: "destructive",
      })
      return
    }

    // Pri prvom generovaní vyžadujeme email + súhlas. Pri „Vygenerovať znova" v rámci tej istej session už nie.
    if (!previewLink) {
      if (!consent) {
        toast({
          title: "Súhlas je povinný",
          description: "Pre pokračovanie musíte súhlasiť so spracovaním údajov a marketingovými účelmi.",
          variant: "destructive",
        })
        return
      }

      const emailResult = emailSchema.safeParse(email)
      if (!emailResult.success) {
        toast({
          title: "Neplatný email",
          description: emailResult.error.issues[0]?.message || "Zadajte platný email.",
          variant: "destructive",
        })
        return
      }

      const validEmail = emailResult.data

      // Bloomreach (Exponea) – tracking nesmie zablokovať generovanie preview.
      try {
        if (typeof window !== "undefined" && window.exponea) {
          window.exponea.identify(
            { registered: validEmail },
            { email: validEmail, registered: validEmail },
          )
          window.exponea.update({ email: validEmail })
          window.exponea.track("registered", {
            email: validEmail,
            consent: true,
          })
          window.exponea.track("consent", {
            action: "accept",
            category: "all",
            identification: validEmail,
            source: "triphero_builder",
            valid_until: "unlimited",
          })
        }
      } catch (trackErr) {
        console.error("Bloomreach tracking error:", trackErr)
      }
    }

    setGenerating(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-camp-preview', {
        body: { configuration },
      })

      if (error) throw error
      if (!data?.success) throw new Error(data?.error || 'Generovanie zlyhalo')

      const link = `${window.location.origin}/preview/${data.slug}`
      setPreviewLink(link)
      setTrainerNameForAccess(data.trainerName)

      toast({
        title: "Preview vygenerovaný! 🎉",
        description: "Zdieľajte odkaz s potenciálnymi účastníkmi.",
      })
    } catch (err: any) {
      console.error('Generate preview error:', err)
      toast({
        title: "Chyba pri generovaní",
        description: err.message || "Skúste to znova neskôr.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const copyLink = () => {
    if (previewLink) {
      navigator.clipboard.writeText(previewLink)
      toast({ title: "Odkaz skopírovaný!" })
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Súhrn vášho tripu</h1>
          <p className="text-muted-foreground">Skontrolujte detaily a vygenerujte preview stránku</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="px-6 py-6">
                <h3 className="font-semibold text-foreground mb-4">Základné informácie</h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-muted-foreground">Destinácia</p><p className="font-medium text-foreground">{configuration.destination || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Termín</p><p className="font-medium text-foreground">{configuration.months?.length > 0 ? configuration.months.join(", ") : "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Trvanie</p><p className="font-medium text-foreground">{configuration.duration || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Počet účastníkov</p><p className="font-medium text-foreground">{configuration.participants || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Typ tripu</p><p className="font-medium text-foreground">{configuration.campType || "—"}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="px-6 py-6">
                <h3 className="font-semibold text-foreground mb-4">Ubytovanie a služby</h3>
                <div className="space-y-3">
                  <div><p className="text-sm text-muted-foreground">Hotel</p><p className="font-medium text-foreground">{configuration.hotelTitle || hotelDetails?.name || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Trieda hotela</p><p className="font-medium text-foreground">{(configuration.hotelStars || hotelDetails?.stars) ? `${"⭐".repeat(configuration.hotelStars || hotelDetails?.stars)}` : "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Strava</p><p className="font-medium text-foreground">{configuration.meals || "—"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Transfer</p><p className="font-medium text-foreground">{configuration.transfer ? "Áno" : "Nie"}</p></div>
                  <div><p className="text-sm text-muted-foreground">Extra služby</p><p className="font-medium text-foreground">{formatList(configuration.extras)}</p></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent bg-accent/5">
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

        {/* Preview link result */}
        {previewLink && (
          <Card className="mb-8 border-2 border-primary/30 bg-primary/5">
            <CardContent className="px-6 py-6">
              <h3 className="font-semibold text-foreground mb-2">✅ Preview stránka je pripravená!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Prístupový kód je meno trénera: <span className="font-semibold text-foreground">{trainerNameForAccess}</span>
              </p>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <span className="text-sm text-foreground truncate flex-1">{previewLink}</span>
                <Button size="sm" variant="ghost" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <a href={previewLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!previewLink && (
          <Card className="mb-6">
            <CardContent className="px-6 py-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Tvoj email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="meno@email.sk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                  className="mt-1"
                  required
                />
                <Label
                  htmlFor="consent"
                  className="text-sm text-muted-foreground font-normal leading-relaxed cursor-pointer"
                >
                  Súhlasím so spracovaním osobných údajov a s ich použitím na marketingové účely. <span className="text-destructive">*</span>
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={onEdit} variant="outline">← Upraviť</Button>
          <Button
            onClick={handleGeneratePreview}
            disabled={generating || (!previewLink && (!consent || email.trim().length === 0))}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generujem preview...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {previewLink ? "Vygenerovať znova" : "Vygenerovať preview"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
