import { useState } from "react"
import Navbar from "@/components/navbar"
import ConfiguratorWizard from "@/components/configurator-wizard"
import SummaryPage from "@/components/summary-page"

type Step = "wizard" | "summary"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>("wizard")
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

  const handleConfigurationChange = (updates: Partial<typeof configuration>) =>
    setConfiguration((prev) => ({ ...prev, ...updates }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div>
        {currentStep === "wizard" ? (
          <ConfiguratorWizard
            configuration={configuration}
            onConfigurationChange={handleConfigurationChange}
            onComplete={() => setCurrentStep("summary")}
          />
        ) : (
          <SummaryPage
            configuration={configuration}
            onEdit={() => setCurrentStep("wizard")}
          />
        )}
      </div>
    </div>
  )
}
