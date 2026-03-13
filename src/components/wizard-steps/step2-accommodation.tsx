import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { hotelsByDestination, mealsPricing, extraServicesPricing, transferPrice, flightsPricing } from "@/lib/hotels-database"

interface Step2AccommodationProps {
  configuration: any
  onConfigurationChange: (updates: any) => void
  validationErrors?: Record<string, boolean>
  flightPricesByMonth?: Array<{ month: string; minPrice: number }>
}

const renderStars = (count: number) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </span>
)

export default function Step2Accommodation({ configuration, onConfigurationChange, validationErrors = {}, flightPricesByMonth = [] }: Step2AccommodationProps) {
  const [customExtra, setCustomExtra] = useState("")

  const handleChange = (key: string, value: any) => {
    onConfigurationChange({ [key]: value })
  }

  const handleToggleExtra = (extra: string) => {
    const extras = configuration.extras || []
    const updated = extras.includes(extra) ? extras.filter((e: string) => e !== extra) : [...extras, extra]
    onConfigurationChange({ extras: updated })
  }

  const handleAddCustomExtra = () => {
    if (customExtra.trim()) {
      const extras = configuration.extras || []
      if (!extras.includes(customExtra)) {
        onConfigurationChange({ extras: [...extras, customExtra] })
      }
      setCustomExtra("")
    }
  }

  const selectedDestination = configuration.destination as keyof typeof hotelsByDestination
  const hotels = selectedDestination ? hotelsByDestination[selectedDestination] || [] : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Ubytovanie & služby</h2>
        <p className="text-muted-foreground text-base">Vyber si hotel, stravu a doplnkové služby</p>
      </div>

      <Card className="shadow-soft rounded-2xl border-0">
        <CardContent className="space-y-10 px-6 py-6">
          {/* Hotels */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-4">Vyber hotel v {configuration.destination}</label>
            {hotels.length > 0 ? (
              <>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${validationErrors.hotel ? "ring-2 ring-destructive rounded-lg p-2" : ""}`}>
                  {hotels.map((hotel) => (
                    <button
                      key={hotel.id}
                      onClick={() => handleChange("hotel", hotel.id)}
                      className={`text-left rounded-2xl overflow-hidden border-2 transition transform hover:shadow-lg ${
                        configuration.hotel === hotel.id ? "border-primary ring-2 ring-primary" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="relative overflow-hidden bg-muted h-40">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover hover:scale-105 transition" />
                      </div>
                      <div className="p-4 bg-card">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-foreground text-sm">{hotel.name}</h3>
                          <span className="text-xs font-bold">{renderStars(hotel.stars)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{hotel.description}</p>
                        <p className="text-sm font-semibold text-foreground">od {hotel.pricePerNight}€ / noc</p>
                      </div>
                    </button>
                  ))}
                </div>
                {validationErrors.hotel && <p className="text-destructive text-xs mt-2">Toto je povinné pole</p>}
              </>
            ) : (
              <p className="text-muted-foreground">Najprv vyber destináciu</p>
            )}
          </div>

          {/* Meals */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Strava</label>
            <div className={`grid grid-cols-2 gap-3 ${validationErrors.meals ? "ring-2 ring-destructive rounded-lg p-2" : ""}`}>
              {Object.entries(mealsPricing).map(([meal, price]) => (
                <button
                  key={meal}
                  onClick={() => handleChange("meals", meal)}
                  className={`p-3 rounded-lg border-2 font-medium transition text-center ${
                    configuration.meals === meal ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  <div>{meal}</div>
                  <div className={`text-xs mt-1 ${configuration.meals === meal ? "text-primary-foreground/70" : "text-muted-foreground"}`}>od {price}€/deň</div>
                </button>
              ))}
            </div>
            {validationErrors.meals && <p className="text-destructive text-xs mt-2">Toto je povinné pole</p>}
          </div>

          {/* Flight prices from webhook */}
          {configuration.hotel && configuration.meals && flightPricesByMonth && flightPricesByMonth.length > 0 && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Odhadované ceny leteniek</p>
                <p className="text-xs text-muted-foreground">vyber si preferovaný mesiac pre tvoju letenku</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {flightPricesByMonth.map((flight) => {
                  const isSelected = configuration.selectedFlight?.month === flight.month
                  return (
                    <button
                      key={flight.month}
                      onClick={() => handleChange("selectedFlight", isSelected ? null : { month: flight.month, price: flight.minPrice })}
                      className={`p-4 rounded-lg border-2 text-left transition ${
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                            {flight.month !== "default" ? new Date(flight.month + "-01").toLocaleDateString("sk-SK", { year: "numeric", month: "long" }) : "Letenka"}
                          </p>
                          <p className={`text-xs mt-1 ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>minimálna cena</p>
                        </div>
                        <p className={`text-2xl font-bold ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>{flight.minPrice} €</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Transfer */}
          <div>
            <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
              <input
                type="checkbox"
                checked={configuration.transfer || false}
                onChange={(e) => handleChange("transfer", e.target.checked)}
                className="w-4 h-4 rounded border border-border cursor-pointer"
              />
              <div className="flex-1">
                <span className="font-medium text-foreground">Transfer zabezpečený</span>
                <p className="text-xs text-muted-foreground">od {transferPrice}€ na osobu</p>
              </div>
            </label>
          </div>

          {/* Extras */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Extra služby</label>
            <div className="space-y-2">
              {Object.entries(extraServicesPricing).map(([extra]) => (
                <label key={extra} className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted transition">
                  <input
                    type="checkbox"
                    checked={configuration.extras?.includes(extra) || false}
                    onChange={() => handleToggleExtra(extra)}
                    className="w-4 h-4 rounded border border-border cursor-pointer"
                  />
                  <span className="font-medium text-foreground">{extra}</span>
                </label>
              ))}

              {configuration.extras?.filter((e: string) => !Object.keys(extraServicesPricing).includes(e)).map((custom: string) => (
                <div key={custom} className="flex items-center gap-2 p-3 border border-primary rounded-lg bg-primary/5">
                  <span className="font-medium text-foreground flex-1">{custom}</span>
                  <button onClick={() => handleToggleExtra(custom)} className="text-primary hover:text-primary/80 font-bold">✕</button>
                </div>
              ))}

              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={customExtra}
                  onChange={(e) => setCustomExtra(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCustomExtra()}
                  placeholder="Zadaj vlastnú službu..."
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button onClick={handleAddCustomExtra} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition">+</button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
