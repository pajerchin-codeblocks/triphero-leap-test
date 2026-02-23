import { Button } from "@/components/ui/button"

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
}

export default function WizardNavigation({ currentStep, totalSteps, onNext, onPrevious }: WizardNavigationProps) {
  return (
    <div className="mt-12 flex gap-4 justify-between">
      <Button onClick={onPrevious} disabled={currentStep === 0} variant="outline" className="gap-2 bg-transparent">
        ← Späť
      </Button>

      <Button onClick={onNext} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
        {currentStep === totalSteps - 1 ? "Pokračovať" : "Ďalej"} →
      </Button>
    </div>
  )
}
