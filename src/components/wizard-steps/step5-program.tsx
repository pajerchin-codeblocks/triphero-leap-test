import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Step5ProgramProps {
  configuration: any
  onConfigurationChange: (updates: any) => void
  validationErrors?: Record<string, boolean>
}

export default function Step5Program({ configuration, onConfigurationChange, validationErrors }: Step5ProgramProps) {
  const handleChange = (key: string, value: any) => {
    onConfigurationChange({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Program dňa</h2>
        <p className="text-muted-foreground text-base">
          Popíšte, ako by mohol vyzerať typický deň na vašom tripe.
        </p>
      </div>

      <Card className="shadow-soft rounded-2xl border-0">
        <CardContent className="space-y-6 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="dailyProgram" className="text-sm font-semibold text-foreground">Predstava programu dňa</Label>
            <Textarea
              id="dailyProgram"
              placeholder={`Napríklad:\n\n8:00 — Raňajky a privítanie\n9:30 — Hlavná aktivita dňa (workshop, výlet, ochutnávka…)\n12:30 — Obed\n15:00 — Popoludňajší program (prechádzka, voľný čas, druhá session)\n18:00 — Večera\n20:00 — Spoločenský večer alebo voľný program`}
              value={configuration.dailyProgram || ""}
              onChange={(e) => handleChange("dailyProgram", e.target.value)}
              className={`min-h-[300px] resize-none`}
              rows={12}
            />
            <p className="text-xs text-muted-foreground">Nepovinné — čím detailnejšie popíšete program, tým lepšie vieme vytvoriť presný popis</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialActivities" className="text-sm font-semibold text-foreground">Špeciálne aktivity alebo výlety (voliteľné)</Label>
            <Textarea
              id="specialActivities"
              placeholder="napr. Výlet na hory, plavba loďou, návšteva lokálnych pamätihodností..."
              value={configuration.specialActivities || ""}
              onChange={(e) => handleChange("specialActivities", e.target.value)}
              className="min-h-[100px] resize-none"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Pridajte extra zážitky, ktoré urobia váš trip nezabudnuteľným</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
