import { Card, CardContent } from "@/components/ui/card"

interface Step3BusinessProps {
  configuration: any
  onConfigurationChange: (updates: any) => void
  validationErrors?: Record<string, boolean>
}

export default function Step3Business({ configuration, onConfigurationChange }: Step3BusinessProps) {
  const handleChange = (key: string, value: any) => {
    onConfigurationChange({ [key]: value })
  }

  const getParticipantRange = (participantStr: string): [number, number] => {
    const match = participantStr?.match(/(\d+)\s*[–—-]\s*(\d+)/)
    if (match) return [Number.parseInt(match[1]), Number.parseInt(match[2])]
    return [8, 12]
  }

  const [minParticipants, maxParticipants] = getParticipantRange(configuration.participants)
  const trainerReward = configuration.trainerReward ?? 50
  const minEarnings = trainerReward * minParticipants
  const maxEarnings = trainerReward * maxParticipants

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Biznis nastavenia</h2>
        <p className="text-muted-foreground text-base">Nastavte si svoju odmenu za účastníkov</p>
      </div>

      <Card className="shadow-soft rounded-2xl border-0">
        <CardContent className="space-y-6 px-6 py-6">
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Model odmeny lídra - Garantovaná odmena na osobu</p>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-4">Odmena za jedného účastníka</label>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={trainerReward}
                  onChange={(e) => handleChange("trainerReward", Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">0 €</span>
                  <span className="text-2xl font-bold text-accent">{trainerReward} €</span>
                  <span className="text-sm text-muted-foreground">500 €</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Spolu zarobíš</p>
            <p className="text-3xl font-bold text-accent">
              {minEarnings.toLocaleString()} € - {maxEarnings.toLocaleString()} €
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Pri počte účastníkov {minParticipants} - {maxParticipants}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
