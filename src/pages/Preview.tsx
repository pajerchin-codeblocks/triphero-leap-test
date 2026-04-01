import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  Heart,
  MapPin,
  Calendar,
  Users,
  Clock,
  Star,
  Dumbbell,
  Brain,
  Sparkles,
  ChevronDown,
  ArrowRight,
} from "lucide-react"
import Navbar from "@/components/navbar"
import { supabase } from "@/integrations/supabase/client"
import { motion } from "framer-motion"

const ILLUSTRATIVE_TRAINER_FEMALE = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop&crop=face"
const ILLUSTRATIVE_TRAINER_MALE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop&crop=face"

interface TripPreviewData {
  success: boolean
  sessionId: string
  slug: string
  hotelImages?: {
    hero: string
    title: string
    location: string
  }
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function Preview() {
  const { slug } = useParams<{ slug: string }>()
  const [campData, setCampData] = useState<TripPreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [accessInput, setAccessInput] = useState("")
  const [accessError, setAccessError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const stripEmojis = (text: string) => text.replace(/:\w+:/g, "").trim()

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

  if (!campData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <Card className="w-full max-w-md border-0 shadow-soft">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Náhľad tripu</h1>
                <p className="text-muted-foreground">
                  Pre zobrazenie náhľadu zadajte vaše meno a priezvisko
                </p>
              </div>
              <form onSubmit={handleAccessSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="napr. Ján Novák"
                  value={accessInput}
                  onChange={(e) => setAccessInput(e.target.value)}
                  disabled={isVerifying}
                  className="h-12 text-base"
                />
                {accessError && (
                  <p className="text-sm text-destructive text-center">{accessError}</p>
                )}
                <Button
                  type="submit"
                  disabled={!accessInput.trim() || isVerifying}
                  className="w-full h-12 gradient-wizard-btn text-base font-semibold"
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
          <p className="text-muted-foreground">Načítavam náhľad tripu...</p>
        </div>
      </div>
    )
  }

  const trainerIsFemale = campData.trainerProfile.name
    ?.toLowerCase()
    .match(/jana|petra|adriana|lucia|veronika|katarina|michaela|denisa|zuzana|lenka|monika|martina|andrea|eva|maria|barbora/)

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════════════════════════════════════
          HERO SECTION — Full viewport immersive
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <img
          src={campData.hotelImages?.hero || "/luxury-beach-resort-sunset-aerial-view.jpg"}
          alt={campData.hotelImages?.title || campData.luxuryExperience?.hotelName || "Resort"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.5)] to-transparent" />

        {/* Scarcity badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 right-6 z-10"
        >
          <Badge className="bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold shadow-glow border-0">
            {campData.urgency.scarcity || "Limitovaný počet miest"}
          </Badge>
        </motion.div>

        <div className="relative z-10 w-full px-4 pb-16 pt-32 md:px-8 lg:px-16">
          <div className="max-w-5xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-6"
            >
              {/* Trainer badge in hero */}
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm border-2 border-accent/40 overflow-hidden">
                  <img
                    src={trainerIsFemale ? ILLUSTRATIVE_TRAINER_FEMALE : ILLUSTRATIVE_TRAINER_MALE}
                    alt={campData.trainerProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-primary-foreground/80 text-sm">Vedie</p>
                  <p className="text-primary-foreground font-semibold">{campData.trainerProfile.name}</p>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] tracking-tight"
              >
                {campData.hero.headline}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed"
              >
                {campData.hero.subheadline || campData.hero.visualDescription}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="gradient-wizard-btn text-lg px-10 py-7 font-bold shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                >
                  {campData.hero.cta || "Chcem sa zúčastniť"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="w-8 h-8 text-primary-foreground/50" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          KEY HIGHLIGHTS STRIP
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 -mt-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: Calendar, label: "Termín", value: campData.investmentBreakdown?.priceFrame?.match(/\d{1,2}\.\d{1,2}\.\d{4}/)?.[0] || "Podľa dohody" },
              { icon: MapPin, label: "Destinácia", value: campData.luxuryExperience?.hotelName || "Premium resort" },
              { icon: Users, label: "Kapacita", value: campData.urgency?.scarcity || "Limitované miesta" },
              { icon: Sparkles, label: "Cena od", value: campData.investmentBreakdown?.pricePerPerson || "Na vyžiadanie" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-2xl p-5 text-center shadow-soft hover:shadow-glow transition-shadow duration-300"
              >
                <item.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm font-bold text-foreground leading-tight">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          STORY HOOK — Transformation narrative
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {campData.storyHook.opening}
          </motion.p>
          <motion.p variants={fadeUp} className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
            {campData.storyHook.problem}
          </motion.p>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {campData.storyHook.solution}
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          TRAINER PROFILE — Premium card
      ═══════════════════════════════════════════ */}
      {campData.trainerProfile && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-5xl font-bold text-foreground text-center mb-16"
              >
                {campData.trainerProfile.headline || `Tvoj sprievodca na ceste k zmene`}
              </motion.h2>

              <motion.div
                variants={fadeUp}
                className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"
              >
                {/* Photo */}
                <div className="flex-shrink-0 relative">
                  <div className="w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden shadow-elevated ring-4 ring-accent/20">
                    <img
                      src={trainerIsFemale ? ILLUSTRATIVE_TRAINER_FEMALE : ILLUSTRATIVE_TRAINER_MALE}
                      alt={campData.trainerProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground rounded-xl px-4 py-2 font-bold shadow-glow text-sm">
                    {campData.trainerProfile.name}
                  </div>
                </div>

                {/* Bio content */}
                <div className="flex-1 space-y-6">
                  {campData.trainerProfile.narrative && (
                    <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium italic border-l-4 border-accent pl-6">
                      „{campData.trainerProfile.narrative}"
                    </p>
                  )}

                  {campData.trainerProfile.credentials && campData.trainerProfile.credentials.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {campData.trainerProfile.credentials.map((cred, idx) => (
                        <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                          {cred}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    {campData.trainerProfile.specialization && (
                      <div className="bg-card border border-border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Špecializácia</p>
                        <p className="text-sm text-foreground font-medium">{campData.trainerProfile.specialization}</p>
                      </div>
                    )}
                    {campData.trainerProfile.experience && (
                      <div className="bg-card border border-border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Skúsenosti</p>
                        <p className="text-sm text-foreground font-medium">{campData.trainerProfile.experience}</p>
                      </div>
                    )}
                    {campData.trainerProfile.style && (
                      <div className="bg-card border border-border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Štýl tréningu</p>
                        <p className="text-sm text-foreground font-medium">{campData.trainerProfile.style}</p>
                      </div>
                    )}
                    {campData.trainerProfile.philosophy && (
                      <div className="bg-card border border-border rounded-xl p-4">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Filozofia</p>
                        <p className="text-sm text-foreground font-medium">{campData.trainerProfile.philosophy}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          DAY TIMELINE — Visual vertical timeline
      ═══════════════════════════════════════════ */}
      {campData.dayTimeline && campData.dayTimeline.length > 0 && (
        <section className="py-20 md:py-28 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Tvoj deň na tripe</h2>
                <p className="text-lg text-muted-foreground">
                  Každý deň je starostlivo naplánovaný pre maximálny zážitok
                </p>
              </motion.div>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

                {campData.dayTimeline.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    className={`relative flex items-start gap-6 mb-8 last:mb-0 ${
                      idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot on the line */}
                    <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background -translate-x-1.5 mt-5 z-10 shadow-glow" />

                    {/* Spacer for desktop alternating */}
                    <div className="hidden md:block md:w-1/2" />

                    {/* Content card */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                      <div className="bg-card border border-border rounded-xl p-5 shadow-soft hover:shadow-glow transition-shadow duration-300 group">
                        <div className="flex items-center gap-3 mb-1">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="text-sm font-bold text-accent">{item.time}</span>
                        </div>
                        <p className="text-foreground font-medium">{stripEmojis(item.activity)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          TRANSFORMATION — Physical + Mental split
      ═══════════════════════════════════════════ */}
      {campData.transformation && (
        <section className="py-20 md:py-28 px-4 bg-primary text-primary-foreground">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">{campData.transformation.headline}</h2>
                <p className="text-lg text-primary-foreground/70 leading-relaxed">
                  {campData.transformation.emotionalImpact}
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                {campData.transformation.physicalBenefits?.length > 0 && (
                  <motion.div variants={fadeUp} className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold">Fyzická transformácia</h3>
                    </div>
                    <ul className="space-y-4">
                      {campData.transformation.physicalBenefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-primary-foreground/80">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {campData.transformation.mentalBenefits?.length > 0 && (
                  <motion.div variants={fadeUp} className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold">Mentálna sila</h3>
                    </div>
                    <ul className="space-y-4">
                      {campData.transformation.mentalBenefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-primary-foreground/80">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          LUXURY EXPERIENCE — Amenities grid
      ═══════════════════════════════════════════ */}
      {campData.luxuryExperience && (
        <section className="py-20 md:py-28 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  {campData.luxuryExperience.headline}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {campData.luxuryExperience.description}
                </p>
              </motion.div>

              {campData.hotelImages?.hero ? (
                <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden mb-12 h-64 md:h-80">
                  <img src={campData.hotelImages.hero} alt={campData.hotelImages.title || "Hotel"} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
              ) : (
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-12 h-64 md:h-80">
                  <div className="rounded-2xl overflow-hidden">
                    <img src="/luxury-resort-pool-area-aerial.jpg" alt="Pool" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <img src="/luxury-resort-beach-view.jpg" alt="Beach" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="rounded-2xl overflow-hidden">
                    <img src="/luxury-beach-resort-sunset-aerial-view.jpg" alt="Aerial" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                </motion.div>
              )}

              <motion.div variants={fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {campData.luxuryExperience.amenities?.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-accent/30 hover:shadow-soft transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-foreground text-sm font-medium">{stripEmojis(amenity)}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          WHAT MAKES IT SPECIAL
      ═══════════════════════════════════════════ */}
      {campData.whatMakesItSpecial && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                className="text-3xl md:text-5xl font-bold text-foreground text-center mb-12"
              >
                {campData.whatMakesItSpecial.headline || "Prečo práve tento kemp?"}
              </motion.h2>

              {campData.whatMakesItSpecial.uniquePoints && (
                <div className="space-y-4">
                  {campData.whatMakesItSpecial.uniquePoints.map((point, idx) => (
                    <motion.div
                      key={idx}
                      variants={fadeUp}
                      className="flex items-start gap-4 bg-card border border-border rounded-xl p-6 hover:border-accent/30 hover:shadow-soft transition-all duration-300"
                    >
                      <Heart className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-foreground leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {campData.whatMakesItSpecial.groupDynamics && (
                <motion.p variants={fadeUp} className="text-center text-muted-foreground mt-8 text-lg">
                  {campData.whatMakesItSpecial.groupDynamics}
                </motion.p>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          SOCIAL PROOF — Testimonial placeholder
      ═══════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              Čo hovoria účastníci
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { text: "Najlepšia investícia do seba za posledné roky. Vrátila som sa ako nový človek.", name: "Účastníčka campu" },
                { text: "Tréningy, jedlo, prostredie — všetko bolo na úplne inom leveli.", name: "Účastník campu" },
              ].map((t, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="bg-card border border-border rounded-2xl p-8 text-left"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-4 italic">„{t.text}"</p>
                  <p className="text-sm text-muted-foreground font-medium">— {t.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          INVESTMENT BREAKDOWN — Premium pricing
      ═══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-center text-foreground mb-16">
              {campData.investmentBreakdown.headline}
            </motion.h2>

            <motion.div variants={fadeUp} className="max-w-lg mx-auto mb-12">
              <div className="bg-card border-2 border-accent/30 rounded-2xl p-8 text-center shadow-glow">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Investícia od</p>
                <p className="text-5xl md:text-6xl font-bold text-accent mb-4">{campData.investmentBreakdown.pricePerPerson}</p>
                <p className="text-muted-foreground leading-relaxed">{campData.investmentBreakdown.priceFrame}</p>
                {campData.urgency.earlyBird && (
                  <div className="mt-4 bg-accent/10 rounded-lg px-4 py-2 inline-block">
                    <p className="text-sm text-accent font-semibold">{campData.urgency.earlyBird}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={fadeUp} className="bg-card border border-accent/20 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Check className="w-6 h-6 text-accent" />
                  V cene je zahrnuté
                </h3>
                <ul className="space-y-3">
                  {campData.investmentBreakdown.whatYouGet.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl p-8">
                <h3 className="text-xl font-bold text-foreground mb-6">Nie je zahrnuté</h3>
                <ul className="space-y-3">
                  {campData.investmentBreakdown.notIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                      <span className="text-muted-foreground/50 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="mt-8 bg-primary text-primary-foreground rounded-2xl p-6 text-center">
              <p className="text-lg">{campData.investmentBreakdown.paymentOptions}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRACTICAL INFO + FAQ
      ═══════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-center text-foreground mb-16">
              Praktické informácie
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div variants={fadeUp} className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Pre koho je to určené?</h3>
                  <p className="text-muted-foreground">{campData.practicalInfo.targetAudience}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Požadovaná kondícia</h3>
                  <p className="text-muted-foreground">{campData.practicalInfo.fitnessLevel}</p>
                </div>
              </motion.div>
              <motion.div variants={fadeUp}>
                <h3 className="text-lg font-bold text-foreground mb-4">Čo si vziať so sebou</h3>
                <ul className="space-y-2">
                  {campData.practicalInfo.whatToBring.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{stripEmojis(item)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div variants={fadeUp}>
              <h3 className="text-2xl font-bold text-center text-foreground mb-8">Často kladené otázky</h3>
              <div className="space-y-3 max-w-3xl mx-auto">
                {campData.practicalInfo.faq.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-foreground font-medium pr-4">{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5">
                        <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CLOSING STORY + FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/luxury-resort-pool-area-aerial.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.85)] to-[hsl(var(--primary)/0.7)]" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8">
            {campData.closingStory.narrative}
          </motion.p>

          <motion.p variants={fadeUp} className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
            {campData.closingStory.finalCta}
          </motion.p>

          <motion.div variants={fadeUp} className="mb-6">
            <p className="text-primary-foreground/60 text-sm">{campData.urgency.deadline}</p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Button
              size="lg"
              className="gradient-wizard-btn text-lg md:text-xl px-12 py-7 font-bold shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              {campData.urgency.finalCta || "Rezervovať si miesto"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          STICKY MOBILE CTA BAR
      ═══════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 shadow-[0_-4px_20px_-4px_hsl(var(--foreground)/0.1)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">od</p>
            <p className="text-xl font-bold text-foreground">{campData.investmentBreakdown?.pricePerPerson || "—"}</p>
          </div>
          <Button className="gradient-wizard-btn font-bold px-8 py-5 text-base">
            Rezervovať
            <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bottom spacer for sticky bar on mobile */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}