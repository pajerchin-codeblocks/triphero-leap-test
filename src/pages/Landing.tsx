import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Landing() {
  const benefits = [
    { title: "Nulové vstupné náklady", description: "za camp nič neplatíš a kúpiš si lietanku aj ubytovanie" },
    { title: "Garantovaný zárobok", description: "Stým viac účastníkov, tým vyšší zароbok" },
    { title: "Šetrenie času a kompletniy servis", description: "pri tvorbe ponuky si spravovávanj objednávok" },
    { title: "Overené služby a skúsený tím", description: "spolupracujeme s cestovnou kanceláriou Pelikán" },
    { title: "Zákonné a bez rizika", description: "len cestovná kancelária môže podľa zákona organizovať zájazd" },
    { title: "Pohostovská komunikácia", description: "Každý deň sme k dispozícií lebo ti svojím klientom" },
  ]

  const steps = [
    { number: "1", title: "Vyberte si preferovanú destináciu, hotel a termín", icon: "🧭" },
    { number: "2", title: "Obidoj formulár a doplň do poznámky svoje požiadavky", icon: "👍" },
    { number: "3", title: "Pripravi ti produktovú stránku, ktorú si zdielaš medzi svojimi klientov", icon: "🌍" },
    { number: "4", title: "My všetko zabezpečíme a ty cestujete si camp snov s partiou", icon: "☀️" },
    { number: "5", title: "Vyhodnotíme i dohodu sa dohodnutú odmenu za každého evakuovaného", icon: "€" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <section className="px-6 py-20 md:py-32 bg-gradient-to-b from-background to-background/95">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Si vášnivý inštruktor alebo <span className="text-accent">lídér komunity</span>?
              </h1>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Staň sa súčasťou TripHERO a organizuj vlastné campy kdekoľvek na svete. Cestuj, zarábaj a vybuduj si
                nami ešte silnejšiu komunitu.
              </p>
            </div>
            <Link to="/">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8">
                Chcem svoj camp!
              </Button>
            </Link>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
            <img
              src="/fitness-trainer-video-thumbnail-urban-setting.jpg"
              alt="TripHERO video"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
              aria-label="Play video"
            >
              <svg
                className="w-20 h-20 text-white group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-32 bg-background/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Prečo organizovať Camp s TripHERO?
          </h2>
          <p className="text-center text-foreground/60 mb-16 max-w-2xl mx-auto text-lg" />

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="flex items-center justify-center">
              <div className="relative w-80 h-80 rounded-full border-8 border-accent flex items-center justify-center">
                <div className="absolute inset-8 rounded-full border-8 border-foreground/20" />
                <img
                  src="/fitness-trainer-strong-powerful-pose.jpg"
                  alt="Fitness trainer"
                  width={250}
                  height={250}
                  className="rounded-full object-cover w-[250px] h-[250px]"
                />
              </div>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, idx) => (
                <Card key={idx} className="border-l-4 border-l-accent bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <span className="text-2xl font-bold text-accent flex-shrink-0">✓</span>
                      <div>
                        <h3 className="font-bold text-foreground text-lg mb-1">{benefit.title}</h3>
                        <p className="text-foreground/70">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">Ako to funguje?</h2>
          <p className="text-center text-foreground/60 mb-16 text-lg">5 jednoduchých krokov ako urobiť svoj Camp</p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Card className="w-full bg-gradient-to-b from-card to-card/80 border-2 border-accent/20 hover:border-accent/50 transition-colors">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-5xl font-bold text-accent">{step.number}</div>
                    <div className="text-4xl">{step.icon}</div>
                    <p className="text-foreground/80 font-medium text-sm leading-tight">{step.title}</p>
                  </CardContent>
                </Card>
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center mt-6 mb-6 w-full">
                    <div className="w-8 h-1 bg-gradient-to-r from-accent to-accent/30 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-32 bg-gradient-to-r from-accent/10 via-background to-accent/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground">Vyskladaj si svoj ďalší camp za 5 minút</h2>
            <p className="text-xl text-foreground/70">
              Vyber destináciu, preferencie, rozpočet a získaj okamžitý návrh.
            </p>
          </div>
          <Link to="/">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-xl px-12 py-7">
              Začať plánovať camp
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
