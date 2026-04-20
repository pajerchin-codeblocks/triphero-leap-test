## Problém

Niektoré hotely z webhooku majú `price = 0` (napr. The Ravenala). V takom prípade:

- najdrahsia dostupná `cena` mealu (napr. `hbCena = 185€`) = **denná cena hotela vrátane tej stravy**
- ostatné meal ceny (napr. `aiCena = 80€`) = **denný príplatok** k tej najdrahsej

Logika "cena × počet dní" zostáva nezmenená — meníme len ako sa určí `hotelPrice` (per noc) a ceny stravy keď je `hotel.price = 0`.

## Riešenie

### 1. Helper v `src/lib/webhook-types.ts`

Pridať `getHotelPricing(hotel: WebhookHotel)` ktorý vráti:

- `basePrice` (per noc):
  - ak `hotel.price > 0` → `hotel.price` (pôvodné správanie)
  - inak → **najvyssia** cena spomedzi dostupných meal plánov (= najdrahsi balík hotel+strava za noc)
- `baseMeal: MealKey | null` — kľúč mealu zahrnutého v `basePrice` (len keď `hotel.price = 0`)
- `mealPrices: Partial<Record<MealKey, number>>` — denný príplatok pre každý dostupný meal:
  - ak `baseMeal` existuje → `baseMeal` má **0**, ostatné meals = `cena_mealu - basePrice`...

> Korekcia po príklade používateľa: Ravenala má `hb=185` (najdrahsia, = base), `ai=80` ktoré je už **priamo príplatok** (nie absolútna cena). Takže `aiCena` netreba odpočítavať — berie sa tak ako je. Pravidlo:
>
> - `baseMeal` = meal s **najdrahsou**`cena` (to je full denná cena balíka)
> - ostatné meals → ich `cena` sa berie ako **denný príplatok** priamo
> - `baseMeal` sám má príplatok 0

- ak `baseMeal` neexistuje (`hotel.price > 0`) → `mealPrices[k] = micros(hotel[kCena])` (pôvodné správanie nezmenené)

### 2. Úprava `src/components/wizard-steps/step2-accommodation.tsx`

**a) Karta hotela** — `od {basePrice}€ / noc` (z helpera).

**b) `handleChange("hotel", value)**`:

- `hotelPrice = basePrice`
- ak `baseMeal` existuje → automaticky predvybrať `meals: mealLabels[baseMeal]`

**c) `getAvailableMeals()**` — denné príplatky čítať z `mealPrices` helpera.

**d) Label dlaždice mealu** — keď je hotel s `baseMeal`, zobraziť `+{price}€/deň` (pre baseMeal `+0€/deň`). Inak ponechať pôvodný formát `od {price}€/deň`.

### 3. Cenová kalkulácia ostáva zachovaná

Existujúci výpočet `hotelPrice * nights + mealPrice * nights` funguje korektne:

- Ravenala + HB: `185×nights + 0×nights` = 185×nights ✓
- Ravenala + AI: `185×nights + 80×nights` = 265×nights ✓
- Klasický hotel s `price > 0`: úplne bez zmeny ✓

## Súbory

1. `src/lib/webhook-types.ts` — pridať `getHotelPricing()`
2. `src/components/wizard-steps/step2-accommodation.tsx` — použiť helper v kartách hotelov, `handleChange`, `getAvailableMeals`; auto-select baseMeal