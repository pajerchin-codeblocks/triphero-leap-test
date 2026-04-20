

## Úprava zobrazenia ceny letenky pri null hodnote

### Súbor
`src/components/wizard-steps/step2-accommodation.tsx`

### Zmeny

**1. Upraviť renderovanie ceny letenky (riadky 218-250):**

Keď `flight.minPrice` je `null`, `undefined` alebo `0`, zobraziť informačný text namiesto ceny.

```tsx
{/* Flight prices from webhook */}
{flightPricesByMonth && flightPricesByMonth.length > 0 && (
  <div className="space-y-3">
    <div>
      <p className="text-sm font-semibold text-foreground mb-1">Odhadované ceny leteniek</p>
      <p className="text-xs text-muted-foreground">vyber si preferovaný mesiac pre tvoju letenku</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {flightPricesByMonth.map((flight) => {
        const isSelected = configuration.selectedFlight?.month === flight.month
        const hasPrice = flight.minPrice != null && flight.minPrice > 0
        return (
          <button
            key={flight.month}
            onClick={() => handleChange("selectedFlight", isSelected ? null : { month: flight.month, price: flight.minPrice })}
            disabled={!hasPrice}
            className={`p-4 rounded-lg border-2 text-left transition ${
              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/50"
            } ${!hasPrice ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                  {flight.month !== "default" ? new Date(flight.month + "-01").toLocaleDateString("sk-SK", { year: "numeric", month: "long" }) : "Letenka"}
                </p>
                <p className={`text-xs mt-1 ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {hasPrice ? "minimálna cena" : "cenu dodatočne preveríme"}
                </p>
              </div>
              <p className={`text-2xl font-bold ${isSelected ? "text-primary-foreground" : "text-foreground"}`}>
                {hasPrice ? `${flight.minPrice} €` : "—"}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  </div>
)}
```

### Zhrnutie zmien

1. **Pridaná kontrola ceny**: `const hasPrice = flight.minPrice != null && flight.minPrice > 0`
2. **Disabled stav**: Tlačidlo je disabled keď nie je cena dostupná
3. **Zmena textu pod nadpisom**: "minimálna cena" → "cenu dodatočne preveríme" keď nie je cena
4. **Zmena zobrazenia ceny**: `flight.minPrice €` → `—` (pomlčka) keď nie je cena
5. **Opacity**: Pridaná `opacity-75` pre vizuálne odlíšenie neaktívnych leteniek

