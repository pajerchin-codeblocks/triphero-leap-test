import { useState } from "react"
import Navbar from "@/components/navbar"
import ConfiguratorWizard from "@/components/configurator-wizard"
import SummaryPage from "@/components/summary-page"
import AIChat from "@/components/ai-chat"
import { hotelsByDestination } from "@/lib/hotels-database"

type Step = "wizard" | "summary" | "chat"

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

  const buildTripData = () => {
    const cfg = configuration as any
    const destination = cfg.destination || ""
    const hotels = hotelsByDestination[destination] || []
    const hotel = hotels.find((h: any) => h.id === cfg.hotel)

    const participantStr = cfg.participants || "8"
    const minParticipants = Number.parseInt(participantStr.match(/(\d+)/)?.[1] || "8")
    const trainerReward = Number.parseInt(cfg.trainerReward ?? "50") || 50

    return {
      destination,
      months: cfg.months || [],
      duration: cfg.duration || "",
      participants: cfg.participants || "",
      campType: cfg.campType || "",
      hotel: {
        id: hotel?.id || "",
        name: hotel?.name || "",
        stars: hotel?.stars || 0,
      },
      meals: cfg.meals || "",
      transfer: cfg.transfer || false,
      extras: cfg.extras || [],
      trainerReward,
      totalEarnings: trainerReward * minParticipants,
      budgetPerPerson: cfg.budgetPerPerson || 0,
      totalPrice: (cfg.budgetPerPerson || 0) * minParticipants,
      trainerName: cfg.trainerName || "",
      trainerExperience: cfg.trainerExperience || "",
      trainerSpecialization: cfg.trainerSpecialization || "",
      trainerCertificates: cfg.trainerCertificates || "",
      trainerBio: cfg.trainerBio || "",
      dailyProgram: cfg.dailyProgram || "",
      specialActivities: cfg.specialActivities || "",
    }
  }

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
        ) : currentStep === "summary" ? (
          <SummaryPage
            configuration={configuration}
            onEdit={() => setCurrentStep("wizard")}
            onChat={() => setCurrentStep("chat")}
          />
        ) : (
          <AIChat
            tripData={buildTripData()}
            onBack={() => setCurrentStep("summary")}
          />
        )}
      </div>
    </div>
  )
}
