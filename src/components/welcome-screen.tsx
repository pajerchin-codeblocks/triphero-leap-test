import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background px-4">
      <div className="max-w-2xl w-full">
        <div className="mb-12 h-64 bg-primary/10 rounded-2xl flex items-center justify-center">
          <img
            src="/placeholder.svg"
            alt="Travel destination"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-balance text-primary">
              Vyskladaj si svoj camp za 5 minút.
            </h1>
            <p className="text-lg md:text-xl text-foreground/70">
              Vyber destináciu, preferencie, rozpočet a získaj okamžitý návrh.
            </p>
          </div>

          <Button
            onClick={onStart}
            size="lg"
            className="mt-8 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg"
          >
            Začať plánovať camp →
          </Button>
        </div>
      </div>
    </div>
  )
}
