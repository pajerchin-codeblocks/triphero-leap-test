import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Heart } from "lucide-react"
import Navbar from "@/components/navbar"
import { supabase } from "@/integrations/supabase/client"

interface CampPreviewData {
  success: boolean
  sessionId: string
  slug: string
  hero: {
    headline: string
    subheadline: string
    visualDescription: string
    cta: string
  }
  storyHook: {
    opening: string
    problem: string
    solution: string
  }
  trainerProfile: {
    name: string
    bio: string
    credentials: string[]
    headline?: string
    narrative?: string
    specialization?: string
    experience?: string
    style?: string
    philosophy?: string
  }
  dayTimeline: Array<{
    time: string
    activity: string
  }>
  transformation: {
    headline: string
    emotionalImpact: string
    physicalBenefits: string[]
    mentalBenefits: string[]
  }
  luxuryExperience: {
    headline: string
    description: string
    amenities: string[]
    hotelName?: string
  }
  whatMakesItSpecial: {
    headline?: string
    uniquePoints?: string[]
    groupDynamics?: string
    exclusivity?: string
  }
  investmentBreakdown: {
    headline: string
    pricePerPerson: string
    priceFrame: string
    whatYouGet: string[]
    notIncluded: string[]
    paymentOptions: string
  }
  urgency: {
    scarcity: string
    deadline: string
    earlyBird: string | null
    finalCta: string
  }
  practicalInfo: {
    targetAudience: string
    fitnessLevel: string
    whatToBring: string[]
    faq: Array<{
      q: string
      a: string
    }>
  }
  closingStory: {
    narrative: string
    finalCta: string
  }
}

export default function Preview() {
  const { slug } = useParams<{ slug: string }>()
  const [campData, setCampData] = useState<CampPreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [accessInput, setAccessInput] = useState("")
  const [accessError, setAccessError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const stripEmojis = (text: string) => text.replace(/:\w+:/g, "").trim()

  // Add noindex meta tag
  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "robots"
    meta.content = "noindex, nofollow"
    document.head.appendChild(meta)
    return () => { document.head.removeChild(meta) }
  }, [])

  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessInput.trim() || !slug) return
    setIsVerifying(true)
    setAccessError(null)
    try {
      const { data, error } = await supabase.functions.invoke("preview-access", {
        body: { action: "verify", slug, accessCode: accessInput.trim() },
      })
      if (error) throw new Error(error.message)
      if (data?.error) {
        setAccessError(data.error)
      } else if (data?.previewData) {
        const pd = data.previewData
        setCampData(Array.isArray(pd) ? pd[0] : pd)
      }
    } catch (err) {
      setAccessError(err instanceof Error ? err.message : "Nepodarilo sa overiť prístup")
    } finally {
      setIsVerifying(false)
    }
  }

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Neplatný odkaz</p>
      </div>
    )
  }

  // Access form
  if (!campData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-foreground mb-2 text-center">Náhľad campu</h1>
              <p className="text-muted-foreground text-center mb-6">
                Pre zobrazenie náhľadu zadajte vaše meno a priezvisko
              </p>
              <form onSubmit={handleAccessSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="napr. Ján Novák"
                  value={accessInput}
                  onChange={(e) => setAccessInput(e.target.value)}
                  disabled={isVerifying}
                />
                {accessError && (
                  <p className="text-sm text-destructive text-center">{accessError}</p>
                )}
                <Button
                  type="submit"
                  disabled={!accessInput.trim() || isVerifying}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isVerifying ? "Overujem..." : "Zobraziť náhľad"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Načítavam náhľad campu...</p>
        </div>
      </div>
    )
  }

  const trainerIsFemale = campData.trainerProfile.name
    ?.toLowerCase()
    .match(/jana|petra|adriana|lucia|veronika|katarina|michaela|denisa|zuzana|lenka|monika|martina|andrea|eva|maria|barbora/)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <div className="flex gap-2 h-[400px] lg:h-[500px] mb-6">
                  <div className="flex-1 relative rounded-xl overflow-hidden">
                    <img
                      src="/luxury-beach-resort-sunset-aerial-view.jpg"
                      alt={campData.luxuryExperience?.hotelName || "Hotel"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden md:flex flex-col gap-2 w-32 lg:w-40">
                    <div className="relative flex-1 rounded-lg overflow-hidden">
                      <img
                        src="/luxury-resort-pool-area-aerial.jpg"
                        alt="Resort pool area"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <div className="relative flex-1 rounded-lg overflow-hidden">
                      <img
                        src={trainerIsFemale ? "/female-trainer-yoga-meditation.jpg" : "/male-trainer-workout.jpg"}
                        alt="Trainer"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <div className="relative flex-1 rounded-lg overflow-hidden">
                      <img src="/luxury-resort-beach-view.jpg" alt="More photos" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                        <span className="text-white text-2xl font-bold">+10</span>
                        <span className="text-white text-xs">fotografií</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
                  {campData.hero.headline}
                </h1>
                <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                  {campData.hero.visualDescription}
                </p>
              </section>

              <section className="space-y-6">
                <div>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">{campData.storyHook.opening}</p>
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">{campData.storyHook.problem}</p>
                  <p className="text-base text-muted-foreground leading-relaxed">{campData.storyHook.solution}</p>
                </div>
              </section>

              {campData.trainerProfile && (
                <section className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {campData.trainerProfile.headline || `Tvoj tréner: ${campData.trainerProfile.name}`}
                  </h2>
                  <div className="space-y-6">
                    <div className="relative flex flex-col md:flex-row gap-6 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 p-8 rounded-xl border-l-4 border-accent shadow-lg overflow-hidden">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            trainerIsFemale
                              ? "/female-fitness-trainer-professional-portrait.jpg"
                              : "/male-fitness-trainer-professional-portrait.jpg"
                          }
                          alt={campData.trainerProfile.name}
                          width={200}
                          height={280}
                          className="rounded-lg object-cover shadow-md ring-2 ring-accent/20 w-[200px] h-[280px]"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        {campData.trainerProfile.narrative && (
                          <p className="text-base md:text-lg text-foreground leading-relaxed font-medium">
                            {campData.trainerProfile.narrative}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {campData.trainerProfile.specialization && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Špecializácia</h3>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {campData.trainerProfile.specialization}
                          </p>
                        </div>
                      )}
                      {campData.trainerProfile.experience && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Skúsenosti</h3>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {campData.trainerProfile.experience}
                          </p>
                        </div>
                      )}
                      {campData.trainerProfile.style && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Štýl tréningu</h3>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {campData.trainerProfile.style}
                          </p>
                        </div>
                      )}
                      {campData.trainerProfile.philosophy && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Filozofia</h3>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {campData.trainerProfile.philosophy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {campData.dayTimeline && campData.dayTimeline.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Tvoj deň v kempe</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Každý deň je starostlivo naplánovaný tak, aby si dosiahol/a maximálny pokrok
                  </p>
                  <div className="space-y-4">
                    {campData.dayTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-foreground">{item.time}</span>
                            <span className="text-base text-muted-foreground">{stripEmojis(item.activity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {campData.transformation && (
                <section className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{campData.transformation.headline}</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {campData.transformation.emotionalImpact}
                  </p>
                  {campData.transformation.physicalBenefits && campData.transformation.physicalBenefits.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Čo získaš</h3>
                      <ul className="space-y-2">
                        {campData.transformation.physicalBenefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-base text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {campData.transformation.mentalBenefits && campData.transformation.mentalBenefits.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Mentálne benefity</h3>
                      <ul className="space-y-2">
                        {campData.transformation.mentalBenefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-base text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {campData.luxuryExperience && (
                <section className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {campData.luxuryExperience.headline}
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {campData.luxuryExperience.description}
                  </p>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3">Zariadenia hotela</h3>
                    <ul className="space-y-2">
                      {campData.luxuryExperience.amenities?.map((amenity, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span className="text-base text-muted-foreground">{stripEmojis(amenity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {campData.whatMakesItSpecial && (
                <section className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {campData.whatMakesItSpecial.headline ||
                      "Prečo je tento fit camp iný? Tvoja cesta k autentickej transformácii"}
                  </h2>
                  {campData.whatMakesItSpecial.uniquePoints && (
                    <ul className="space-y-3">
                      {campData.whatMakesItSpecial.uniquePoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Heart className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-base text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {campData.whatMakesItSpecial.groupDynamics && (
                    <div className="mt-4">
                      <p className="text-base text-muted-foreground">{campData.whatMakesItSpecial.groupDynamics}</p>
                    </div>
                  )}
                  {campData.whatMakesItSpecial.exclusivity && (
                    <div className="mt-4">
                      <p className="text-base text-muted-foreground">{campData.whatMakesItSpecial.exclusivity}</p>
                    </div>
                  )}
                </section>
              )}

              <section className="py-20 px-4 bg-background">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl font-bold text-center text-foreground mb-12">Praktické informácie</h2>
                  <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">Pre koho je to určené?</h3>
                      <p className="text-muted-foreground mb-6">{campData.practicalInfo.targetAudience}</p>
                      <h3 className="text-2xl font-bold text-foreground mb-4">Fyzická kondícia</h3>
                      <p className="text-muted-foreground">{campData.practicalInfo.fitnessLevel}</p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">Čo si vziať so sebou?</h3>
                      <ul className="space-y-3">
                        {campData.practicalInfo.whatToBring.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{stripEmojis(item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-center text-foreground mb-8">Často kladené otázky</h3>
                    <div className="space-y-6">
                      {campData.practicalInfo.faq.map((item, idx) => (
                        <div key={idx} className="bg-muted/30 p-6 rounded-xl">
                          <h4 className="text-xl font-bold text-foreground mb-3">{item.q}</h4>
                          <p className="text-muted-foreground">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary/90 text-white">
                <div className="max-w-4xl mx-auto text-center">
                  <p className="text-xl mb-8 leading-relaxed">{campData.closingStory.narrative}</p>
                  <p className="text-3xl font-bold mb-12">{campData.closingStory.finalCta}</p>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-white px-16 py-8 text-2xl font-bold shadow-2xl"
                  >
                    Áno, chcem sa zmeniť!
                  </Button>
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Rezervácia</h3>
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Termín</p>
                    <p className="text-lg font-semibold text-foreground">
                      {campData.investmentBreakdown?.pricePerPerson ? "Termín podľa dohody" : "Na vyžiadanie"}
                    </p>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Počet osôb / Izieb</p>
                    <div className="flex items-center justify-between border border-border rounded-lg p-3">
                      <span className="text-base">1 osoba</span>
                      <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      (Ubytovanie pre 1 osobu v dvojlôžkovej izbe (zdieľaná))
                    </p>
                  </div>
                  <div className="mb-6 pt-6 border-t border-border">
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm text-muted-foreground">Cena na osobu</p>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">od </span>
                        <span className="text-3xl font-bold text-foreground">
                          {campData.investmentBreakdown?.pricePerPerson || "600€"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-accent text-accent hover:bg-accent/10 font-semibold bg-transparent"
                    >
                      Nezáväzná rezervácia
                    </Button>
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      Rezervácia
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-8">
            {campData.investmentBreakdown.headline}
          </h2>
          <div className="text-center mb-12">
            <div className="text-6xl font-bold text-accent mb-4">{campData.investmentBreakdown.pricePerPerson}</div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {campData.investmentBreakdown.priceFrame}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-accent/10 border border-accent/30 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-accent mb-6">Čo získaš</h3>
              <ul className="space-y-3">
                {campData.investmentBreakdown.whatYouGet.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/30 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-foreground mb-6">Nie je zahrnuté</h3>
              <ul className="space-y-3">
                {campData.investmentBreakdown.notIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-accent">•</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-primary text-primary-foreground p-8 rounded-xl text-center">
            <p className="text-xl">{campData.investmentBreakdown.paymentOptions}</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-accent text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl font-bold mb-4">{campData.urgency.scarcity}</p>
          <p className="text-xl mb-8">{campData.urgency.deadline}</p>
          <p className="text-2xl mb-10">{campData.urgency.finalCta}</p>
          <Button size="lg" className="bg-background text-accent hover:bg-background/90 px-16 py-8 text-2xl font-bold shadow-2xl">
            Rezervovať teraz
          </Button>
        </div>
      </section>
    </div>
  )
}
