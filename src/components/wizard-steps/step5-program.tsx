import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { countryCodeToDestination } from "@/lib/destination-mapping"

interface Step5ProgramProps {
  configuration: any
  onConfigurationChange: (updates: any) => void
  validationErrors?: Record<string, boolean>
}

export default function Step5Program({ configuration, onConfigurationChange, validationErrors }: Step5ProgramProps) {
  const handleChange = (key: string, value: any) => {
    onConfigurationChange({ [key]: value })
  }

  const durationDays = (() => {
    const match = String(configuration.duration || "").match(/\d+/)
    const n = match ? parseInt(match[0], 10) : 0
    return n > 0 ? n : 8
  })()

  const destinationLabel =
    countryCodeToDestination[configuration.destination] || configuration.destination || "vybranú destináciu"

  const meals = configuration.meals || ""
  const mealLine = (() => {
    if (meals === "Raňajky") return "- Spoločné raňajky v hoteli\n"
    if (meals === "Polpenzia") return "- Spoločné raňajky a večere v hoteli\n"
    if (meals === "Plná penzia") return "- Spoločné raňajky, obedy a večere v hoteli\n"
    if (meals === "All inclusive") return "- Spoločné stravovanie v režime all inclusive\n"
    return ""
  })()

  const middleLine =
    durationDays > 2
      ? `${durationDays === 3 ? "2" : `2-${durationDays - 1}`}. deň\n${mealLine}- Hlavný program tripu\n- Fakultatívne výlety\n\n`
      : ""

  const programExample = `1. deň\n- Odlet z Viedne\n- Prílet do destinácie: ${destinationLabel}\n- Transfer do hotela\n- Check-in v hoteli\n- Úvodné stretnutie\n\n${middleLine}${durationDays > 1 ? `${durationDays}. deň\n- Check-out z hotela\n- Transfer na letisko\n- Odlet z destinácie\n- Prílet do Viedne` : ""}`

  const exampleWithPrefix = `Napríklad:\n\n${programExample}`

  const [exampleActive, setExampleActive] = useState(!configuration.dailyProgram)

  const displayValue = exampleActive ? exampleWithPrefix : (configuration.dailyProgram || "")

  const handleProgramFocus = () => {
    if (exampleActive) {
      setExampleActive(false)
      handleChange("dailyProgram", programExample)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Program</h2>
        <p className="text-muted-foreground text-base">
          Popíšte, ako by mohol vyzerať typický deň na vašom tripe.
        </p>
      </div>

      <Card className="shadow-soft rounded-2xl border-0">
        <CardContent className="space-y-6 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="dailyProgram" className="text-sm font-semibold text-foreground">Predstava programu</Label>
            <Textarea
              id="dailyProgram"
              value={displayValue}
              onFocus={handleProgramFocus}
              onChange={(e) => {
                if (exampleActive) setExampleActive(false)
                handleChange("dailyProgram", e.target.value)
              }}
              className={`min-h-[300px] resize-none ${exampleActive ? "text-muted-foreground" : ""}`}
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
