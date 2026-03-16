

## Fix: Validácia kroku 2 blokuje prechod kvôli nedostupným údajom

### Problém

V `validateStep(1)` (riadok 61-64) sa vyžaduje:
1. `hotel` — OK, dá sa vybrať
2. `meals` — BLOKUJE, lebo webhook hotely majú `bb/hb/fb/ai` všetko `false`, takže sa žiadne jedlá nezobrazujú
3. `selectedFlight` alebo `flight` — BLOKUJE ak webhook nevrátil žiadne lety

### Riešenie

**`src/components/configurator-wizard.tsx`** — upraviť `validateStep` pre step 1:

- Meals: vyžadovať len ak vybraný hotel má aspoň jeden typ stravy dostupný (skontrolovať `bb || hb || fb || ai` na webhook hoteli, alebo fallback hoteloch)
- Flight: vyžadovať len ak `flightPricesByMonth` obsahuje dáta

### Zmeny

Jediný súbor: `src/components/configurator-wizard.tsx`, funkcia `validateStep`, riadky 61-64.

```typescript
} else if (step === 1) {
  if (!configuration.hotel) errors.push("hotel");
  
  // Only require meals if the selected hotel has any meal option
  const wh = webhookHotels.find((h) => h.id === configuration.hotel);
  const hasMealOptions = wh ? (wh.bb || wh.hb || wh.fb || wh.ai) : true;
  if (hasMealOptions && !configuration.meals) errors.push("meals");
  
  // Only require flight if flight data is available
  if (flightPricesByMonth.length > 0 && !configuration.selectedFlight && !configuration.flight) {
    errors.push("flight");
  }
}
```

