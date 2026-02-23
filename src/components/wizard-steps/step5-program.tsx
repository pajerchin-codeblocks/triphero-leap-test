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
        <h2 className="text-2xl font-bold text-foreground mb-2">Program dňa</h2>
        <p className="text-muted-foreground">
          Popíšte, ako by mohol vyzerať typický deň na vašom campe.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="dailyProgram" className="text-sm font-semibold text-foreground">Predstava programu dňa</Label>
            <Textarea
              id="dailyProgram"
              placeholder={`Napríklad:\n\n7:00 - Ranná meditácia pri východe slnka\n8:00 - Zdravá raňajky\n9:30 - Intenzívny funkčný tréning na pláži\n12:00 - Obed a voľný čas\n16:00 - Joga a strečing\n18:00 - Večera\n20:00 - Spoločenské aktivity`}
              value={configuration.dailyProgram || ""}
              onChange={(e) => handleChange("dailyProgram", e.target.value)}
              className={`min-h-[300px] resize-none ${validationErrors?.dailyProgram ? "border-destructive" : ""}`}
              rows={12}
            />
            {validationErrors?.dailyProgram && <p className="text-xs text-destructive mt-1">Toto je povinné pole</p>}
            <p className="text-xs text-muted-foreground">Čím detailnejšie popíšete program, tým lepšie vieme vytvoriť presný popis</p>
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
            <p className="text-xs text-muted-foreground">Pridajte extra zážitky, ktoré urobia váš camp nezabudnuteľným</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
