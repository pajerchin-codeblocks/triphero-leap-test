import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Step4TrainerInfoProps {
  configuration: any
  onConfigurationChange: (updates: any) => void
  validationErrors?: Record<string, boolean>
}

export default function Step4TrainerInfo({ configuration, onConfigurationChange, validationErrors }: Step4TrainerInfoProps) {
  const handleChange = (key: string, value: any) => {
    onConfigurationChange({ [key]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">O vás ako trénerovi</h2>
        <p className="text-muted-foreground text-base">
          Pomôžte nám lepšie pochopiť vaše skúsenosti a špecializáciu, aby sme mohli vytvoriť presvedčivý popis vášho tripu.
        </p>
      </div>

      <Card className="shadow-soft rounded-2xl border-0">
        <CardContent className="space-y-6 px-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="trainerName" className="text-sm font-semibold text-foreground">Vaše meno a priezvisko <span className="text-destructive">*</span></Label>
            <Input
              id="trainerName"
              type="text"
              placeholder="napr. Ján Novák"
              value={configuration.trainerName || ""}
              onChange={(e) => handleChange("trainerName", e.target.value)}
              className={validationErrors?.trainerName ? "border-destructive" : ""}
            />
            {validationErrors?.trainerName && <p className="text-xs text-destructive mt-1">Toto je povinné pole</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainerExperience" className="text-sm font-semibold text-foreground">Roky skúseností v trénerstve <span className="text-destructive">*</span></Label>
            <Input
              id="trainerExperience"
              type="text"
              placeholder="napr. 5 rokov"
              value={configuration.trainerExperience || ""}
              onChange={(e) => handleChange("trainerExperience", e.target.value)}
              className={validationErrors?.trainerExperience ? "border-destructive" : ""}
            />
            {validationErrors?.trainerExperience && <p className="text-xs text-destructive mt-1">Toto je povinné pole</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainerSpecialization" className="text-sm font-semibold text-foreground">Špecializácia <span className="text-destructive">*</span></Label>
            <Input
              id="trainerSpecialization"
              type="text"
              placeholder="napr. Funkčný tréning, Jogu, Pilates"
              value={configuration.trainerSpecialization || ""}
              onChange={(e) => handleChange("trainerSpecialization", e.target.value)}
              className={validationErrors?.trainerSpecialization ? "border-destructive" : ""}
            />
            {validationErrors?.trainerSpecialization && <p className="text-xs text-destructive mt-1">Toto je povinné pole</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainerCertificates" className="text-sm font-semibold text-foreground">Certifikáty a kvalifikácie</Label>
            <Textarea
              id="trainerCertificates"
              placeholder="Vypíšte vaše certifikáty, kvalifikácie a dosiahnuté úspechy..."
              value={configuration.trainerCertificates || ""}
              onChange={(e) => handleChange("trainerCertificates", e.target.value)}
              className="min-h-[120px] resize-none"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">Nepovinné, ale pomôže to zvýšiť dôveryhodnosť</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainerBio" className="text-sm font-semibold text-foreground">Váš príbeh a prístup k trénovaniu</Label>
            <Textarea
              id="trainerBio"
              placeholder="Popíšte svoju filozofiu tréningu, čo vás motivuje, a prečo by sa účastníci mali prihlásiť práve na váš camp..."
              value={configuration.trainerBio || ""}
              onChange={(e) => handleChange("trainerBio", e.target.value)}
              className="min-h-[150px] resize-none"
              rows={6}
            />
            <p className="text-xs text-muted-foreground">Tento text použijeme pre vytvorenie autentického a presvedčivého popisu</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
