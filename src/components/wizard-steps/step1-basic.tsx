import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

interface Step1BasicProps {
  configuration: any
  onConfigurationChange: (updates: any) => void
  validationErrors?: Record<string, boolean>
}

const initialMainDestinations = [
  { id: "Turecko", label: "Turecko", image: "/destinations/turkey.jpg" },
  { id: "Grécko", label: "Grécko", image: "/destinations/greece.jpg" },
  { id: "Egypt", label: "Egypt", image: "/destinations/egypt.jpg" },
  { id: "Portugalsko", label: "Portugalsko", image: "/destinations/portugal.jpg" },
  { id: "Bali", label: "Bali", image: "/destinations/bali.jpg" },
]

const additionalDestinations = [
  { id: "Španielsko", label: "Španielsko", image: "/destinations/spanish.jpg" },
  { id: "Taliansko", label: "Taliansko", image: "/destinations/italy.jpg" },
  { id: "Francúzsko", label: "Francúzsko", image: "/destinations/france.jpg" },
  { id: "Maroko", label: "Maroko", image: "/destinations/morocco.jpg" },
  { id: "Thajsko", label: "Thajsko", image: "/destinations/thailand.jpg" },
  { id: "Vietnam", label: "Vietnam", image: "/destinations/vietnam.jpg" },
  { id: "Mexiko", label: "Mexiko", image: "/destinations/mexico.jpg" },
  { id: "Kostarika", label: "Kostarika", image: "/destinations/costarica.jpg" },
  { id: "Austrália", label: "Austrália", image: "/destinations/australia.jpg" },
  { id: "Japonsko", label: "Japonsko", image: "/destinations/japan.jpg" },
]

const monthsByDestination: Record<string, { month: string; number: number; label: string }[]> = {
  Turecko: [
    { month: "Apríl", number: 4, label: "Apr" },
    { month: "Máj", number: 5, label: "Máj" },
    { month: "Jún", number: 6, label: "Jún" },
    { month: "Júl", number: 7, label: "Júl" },
    { month: "August", number: 8, label: "Aug" },
    { month: "September", number: 9, label: "Sep" },
    { month: "Október", number: 10, label: "Okt" },
    { month: "November", number: 11, label: "Nov" },
  ],
  Grécko: [
    { month: "Apríl", number: 4, label: "Apr" },
    { month: "Máj", number: 5, label: "Máj" },
    { month: "Jún", number: 6, label: "Jún" },
    { month: "Júl", number: 7, label: "Júl" },
    { month: "August", number: 8, label: "Aug" },
    { month: "September", number: 9, label: "Sep" },
    { month: "Október", number: 10, label: "Okt" },
  ],
  Egypt: [
    { month: "Október", number: 10, label: "Okt" },
    { month: "November", number: 11, label: "Nov" },
    { month: "December", number: 12, label: "Dec" },
    { month: "Január", number: 1, label: "Jan" },
    { month: "Február", number: 2, label: "Feb" },
    { month: "Marec", number: 3, label: "Mar" },
    { month: "Apríl", number: 4, label: "Apr" },
  ],
  Portugalsko: [
    { month: "Február", number: 2, label: "Feb" },
    { month: "Marec", number: 3, label: "Mar" },
    { month: "Apríl", number: 4, label: "Apr" },
    { month: "Máj", number: 5, label: "Máj" },
    { month: "Jún", number: 6, label: "Jún" },
    { month: "Júl", number: 7, label: "Júl" },
    { month: "August", number: 8, label: "Aug" },
    { month: "September", number: 9, label: "Sep" },
    { month: "Október", number: 10, label: "Okt" },
    { month: "November", number: 11, label: "Nov" },
  ],
  Bali: [
    { month: "Apríl", number: 4, label: "Apr" },
    { month: "Máj", number: 5, label: "Máj" },
    { month: "Jún", number: 6, label: "Jún" },
    { month: "Júl", number: 7, label: "Júl" },
    { month: "August", number: 8, label: "Aug" },
    { month: "September", number: 9, label: "Sep" },
  ],
}

const campTypeOptions = ["Fit camp", "Yoga retreat", "Lifestyle", "Komunitný pobyt", "Iné"]

export default function Step1Basic({ configuration, onConfigurationChange, validationErrors = {} }: Step1BasicProps) {
  const [showMoreDestinations, setShowMoreDestinations] = useState(false)
  const [showCustomDuration, setShowCustomDuration] = useState(false)
  const [customDuration, setCustomDuration] = useState(configuration.duration || "")
  const [campTypeInput, setCampTypeInput] = useState(configuration.campType || "")
  const [showCampTypeSuggestions, setShowCampTypeSuggestions] = useState(false)
  const [mainDestinations, setMainDestinations] = useState(initialMainDestinations)

  const handleChange = (key: string, value: string) => {
    onConfigurationChange({ [key]: value })
  }

  const handleMonthToggle = (monthName: string) => {
    const selectedMonths = Array.isArray(configuration.months) ? configuration.months : []
    const isSelected = selectedMonths.includes(monthName)

    if (isSelected) {
      onConfigurationChange({ months: selectedMonths.filter((m: string) => m !== monthName) })
    } else if (selectedMonths.length < 4) {
      onConfigurationChange({ months: [...selectedMonths, monthName] })
    }
  }

  const handleCustomDuration = (value: string) => {
    const numValue = value.replace(/\D/g, "")
    if (numValue && Number.parseInt(numValue) > 0) {
      setCustomDuration(numValue)
      handleChange("duration", `${numValue} dní`)
    }
  }

  const handleCampTypeChange = (value: string) => {
    setCampTypeInput(value)
    onConfigurationChange({ campType: value })
  }

  const handleSelectCampType = (type: string) => {
    handleChange("campType", type)
    setCampTypeInput(type)
    setShowCampTypeSuggestions(false)
  }

  const handleDestinationFromPopup = (destId: string) => {
    const selectedDest = additionalDestinations.find((d) => d.id === destId)
    if (selectedDest) {
      const filtered = mainDestinations.filter((d) => d.id !== destId)
      setMainDestinations([selectedDest, ...filtered.slice(0, 4)])
    }
    handleChange("destination", destId)
    onConfigurationChange({ months: [] })
    setShowMoreDestinations(false)
  }

  const availableMonths = monthsByDestination[configuration.destination] || monthsByDestination["Bali"]
  const selectedMonths = Array.isArray(configuration.months) ? configuration.months : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Základné parametre</h2>
        <p className="text-foreground/60">Vyber si destináciu a parametre tvojho campu</p>
      </div>

      <Card>
        <CardContent className="space-y-8 px-6 py-6">
          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-4">Destinácia</label>
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 ${validationErrors.destination ? "ring-2 ring-destructive rounded-lg p-2" : ""}`}>
              {mainDestinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => {
                    handleChange("destination", dest.id)
                    onConfigurationChange({ months: [] })
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 transition transform hover:scale-105 h-24 ${
                    configuration.destination === dest.id
                      ? "border-accent ring-2 ring-accent"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <img src={dest.image} alt={dest.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 hover:bg-black/20 transition" />
                  <div className="absolute inset-0 flex items-end p-2">
                    <span className="text-white text-xs font-semibold text-balance">{dest.label}</span>
                  </div>
                </button>
              ))}

              <button
                onClick={() => setShowMoreDestinations(true)}
                className={`relative rounded-xl overflow-hidden border-2 transition transform hover:scale-105 h-24 flex items-center justify-center ${
                  showMoreDestinations ? "border-accent ring-2 ring-accent" : "border-border hover:border-accent/50 bg-muted"
                }`}
              >
                <span className="text-foreground font-semibold">Všetky krajiny →</span>
              </button>
            </div>
            {validationErrors.destination && <p className="text-destructive text-xs mt-2">Toto je povinné pole</p>}
          </div>

          {showMoreDestinations && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                <CardContent className="px-6 py-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Vyber si destináciu</h3>
                    <button onClick={() => setShowMoreDestinations(false)} className="text-foreground/60 hover:text-foreground text-xl font-bold">✕</button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {[...initialMainDestinations, ...additionalDestinations].map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => handleDestinationFromPopup(dest.id)}
                        className={`relative rounded-xl overflow-hidden border-2 transition transform hover:scale-105 h-24 ${
                          configuration.destination === dest.id
                            ? "border-accent ring-2 ring-accent"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <img src={dest.image} alt={dest.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 hover:bg-black/20 transition" />
                        <div className="absolute inset-0 flex items-end p-2">
                          <span className="text-white text-xs font-semibold text-balance">{dest.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Month */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Preferovaný mesiac/termín
              <span className="ml-2 text-sm font-normal">
                {selectedMonths.length > 0 ? (
                  <span className={selectedMonths.length >= 4 ? "text-destructive" : "text-accent"}>
                    ({selectedMonths.length}/4 {selectedMonths.length === 1 ? "mesiac" : "mesiacov"})
                  </span>
                ) : (
                  <span className="text-muted-foreground">(max 4)</span>
                )}
              </span>
            </label>
            <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 ${validationErrors.months ? "ring-2 ring-destructive rounded-lg p-2" : ""}`}>
              {availableMonths.map((monthObj) => (
                <button
                  key={monthObj.month}
                  onClick={() => handleMonthToggle(monthObj.month)}
                  className={`p-2 rounded-lg border-2 font-medium text-sm transition ${
                    selectedMonths.includes(monthObj.month)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-background text-foreground hover:border-accent/50"
                  }`}
                >
                  {monthObj.label}
                </button>
              ))}
            </div>
            {configuration.destination && (
              <p className="text-xs text-foreground/60 mt-2">✓ Odporúčané mesiace pre {configuration.destination}</p>
            )}
            {validationErrors.months && <p className="text-destructive text-xs mt-2">Toto je povinné pole</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Dĺžka pobytu</label>
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${validationErrors.duration ? "ring-2 ring-destructive rounded-lg p-2" : ""}`}>
              {["4 dni", "5 dní", "6 dní"].map((duration) => (
                <button
                  key={duration}
                  onClick={() => {
                    handleChange("duration", duration)
                    setShowCustomDuration(false)
                  }}
                  className={`p-3 rounded-lg border-2 font-medium transition ${
                    configuration.duration === duration
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-background text-foreground hover:border-accent/50"
                  }`}
                >
                  {duration}
                </button>
              ))}
              <button
                onClick={() => setShowCustomDuration(!showCustomDuration)}
                className={`p-3 rounded-lg border-2 font-medium transition ${
                  showCustomDuration ? "border-accent bg-accent/10 text-accent" : "border-border bg-background text-foreground hover:border-accent/50"
                }`}
              >
                +
              </button>
            </div>

            {showCustomDuration && (
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="30"
                  placeholder="Počet dní"
                  value={customDuration.replace(/\D/g, "")}
                  onChange={(e) => handleCustomDuration(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition"
                  autoFocus
                />
                <button onClick={() => setShowCustomDuration(false)} className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition">✕</button>
              </div>
            )}
            {validationErrors.duration && <p className="text-destructive text-xs mt-2">Toto je povinné pole</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Odhadovaný počet účastníkov</label>
            <div className="grid grid-cols-3 gap-3">
              {["8–12", "12–16", "16–22"].map((count) => (
                <button
                  key={count}
                  onClick={() => handleChange("participants", count)}
                  className={`p-3 rounded-lg border-2 font-medium transition ${
                    configuration.participants === count
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-background text-foreground hover:border-accent/50"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Typ campu</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Napíš typ campu..."
                value={campTypeInput}
                onChange={(e) => handleCampTypeChange(e.target.value)}
                onFocus={() => setShowCampTypeSuggestions(true)}
                onBlur={() => setTimeout(() => setShowCampTypeSuggestions(false), 200)}
                className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition ${validationErrors.campType ? "border-destructive ring-2 ring-destructive" : "border-border"}`}
              />
              {showCampTypeSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10">
                  {campTypeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSelectCampType(type)}
                      className="w-full px-4 py-2 text-left hover:bg-muted transition first:rounded-t-lg last:rounded-b-lg"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {validationErrors.campType && <p className="text-destructive text-xs mt-2">Toto je povinné pole</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
