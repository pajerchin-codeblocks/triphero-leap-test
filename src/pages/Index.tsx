import { useState } from "react"
import { Button } from "@/components/ui/button"
import WelcomeScreen from "@/components/welcome-screen"
import ConfiguratorWizard from "@/components/configurator-wizard"
import SummaryPage from "@/components/summary-page"
import SiteNavigation from "@/components/site-navigation"

type Step = "landing" | "welcome" | "wizard" | "summary"

export default function Home() {
  const [playVideo, setPlayVideo] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>("landing")
  const [configuration, setConfiguration] = useState({
    destination: "",
    month: "",
    duration: "",
    participants: "",
    campType: "",
    hotelClass: "",
    meals: "",
    transfer: false,
    extras: [] as string[],
    rewardModel: "",
    rewardAmount: "",
    budgetPerPerson: 600,
  })

  const benefits = [
    { number: "01", title: "Nulové vstupné náklady", description: "za camp nič neplatíš a kúpiš si lietanku aj ubytovanie" },
    { number: "02", title: "Garantovaný zárobok", description: "Stým viac účastníkov, tým vyšší zárobok" },
    { number: "03", title: "Šetrenie času a kompletniy servis", description: "pri tvorbe ponuky si spravovávanj objednávok" },
    { number: "04", title: "Overené služby a skúsený tím", description: "spolupracujeme s cestovnou kanceláriou Pelikán" },
    { number: "05", title: "Zákonné a bez rizika", description: "len cestovná kancelária môže podľa zákona organizovať zájazd" },
    { number: "06", title: "Pohostovská komunikácia", description: "Každý deň sme k dispozícií lebo ti svojím klientom" },
  ]

  const steps = [
    { number: "1", title: "Vyber destináciu, termín a počet účastníkov" },
    { number: "2", title: "Zvol hotel, stravu, letenky a doplnkové služby" },
    { number: "3", title: "Nastav si svoju odmenu na účastníka a uvidíš svoj celkový výnos" },
    { number: "4", title: "Na záver hneď dostaneš výslednú stránku pre tvoj camp" },
    { number: "5", title: "My všetko zabezpečíme a ty zažiješ camp snov" },
  ]

  const handleStartPlanning = () => setCurrentStep("wizard")
  const handleConfigurationChange = (updates: Partial<typeof configuration>) => setConfiguration((prev) => ({ ...prev, ...updates }))
  const handleWizardComplete = () => setCurrentStep("summary")
  const handleGoToChat = () => setCurrentStep("summary")
  const handleBackToWizard = () => setCurrentStep("wizard")
  const handleBackToHome = () => setCurrentStep("landing")

  if (currentStep === "welcome") {
    return <WelcomeScreen onStart={() => setCurrentStep("wizard")} />
  }

  if (currentStep === "wizard") {
    return (
      <div>
        <SiteNavigation showBackButton onBackClick={handleBackToHome} />
        <div className="pt-20">
          <ConfiguratorWizard configuration={configuration} onConfigurationChange={handleConfigurationChange} onComplete={handleWizardComplete} />
        </div>
      </div>
    )
  }

  if (currentStep === "summary") {
    return (
      <div>
        <SiteNavigation showBackButton onBackClick={handleBackToHome} />
        <div className="pt-20">
          <SummaryPage configuration={configuration} onEdit={handleBackToWizard} onChat={handleGoToChat} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNavigation onStartPlanning={handleStartPlanning} />

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-background to-background/95 pt-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Si vášnivý inštruktor alebo <span className="text-accent">lídér komunity</span>?
              </h1>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Staň sa súčasťou TripHERO a organizuj vlastné campy kdekoľvek na svete. Cestuj, zarábaj a vybuduj si nami ešte silnejšiu komunitu.
              </p>
            </div>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8" onClick={handleStartPlanning}>
              Chcem svoj camp!
            </Button>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 bg-primary/10 flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-accent ml-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-muted-foreground">Video prezentácia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="px-6 py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Prečo organizovať Camp <br />s TripHERO?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Spojili sme sily s profesionálmi, aby sme ti priniesli komplexný servis pre tvoj úspešný camp
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="group relative p-8 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                <div className="mb-6">
                  <span className="text-5xl font-bold text-accent/20 group-hover:text-accent/40 transition-colors">{benefit.number}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-accent transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{benefit.description}</p>
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-accent/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 rounded-full" onClick={handleStartPlanning}>
              Začať plánovať camp
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 md:py-32 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">Ako to funguje?</h2>
            <p className="text-xl text-muted-foreground">5 jednoduchých krokov ako urobiť svoj Camp</p>
          </div>

          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-5 md:gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-accent/40 via-accent/20 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-accent-foreground">{step.number}</span>
                  </div>
                  <div className="text-center space-y-3 bg-card rounded-xl p-6 border border-border hover:border-accent/30 transition-all hover:shadow-md">
                    <p className="text-sm text-foreground/90 leading-snug font-medium">{step.title}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && <div className="md:hidden w-0.5 h-8 bg-accent/20 mx-auto my-4" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 md:py-32 bg-gradient-to-r from-accent/10 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">Vyskladaj si svoj ďalší camp za 5 minút</h2>
            <p className="text-xl text-foreground/70">Vyber destináciu, preferencie, rozpočet a získaj okamžitý návrh.</p>
          </div>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-12 py-7" onClick={handleStartPlanning}>
            Začať plánovať camp
          </Button>
        </div>
      </section>
    </div>
  )
}
