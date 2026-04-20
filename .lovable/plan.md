

## Úprava zobrazenia ceny meal planu pri hoteli s cenou z meal planu

Keď cena hotela je odvodená z meal planu (`hotel.price === 0`, `baseMeal` je nastavený), chceme na dlaždiciach meal planov zobrazovať zrozumiteľnejšiu informáciu namiesto "+0€/deň" pri base meal.

### Súbor
`src/components/wizard-steps/step2-accommodation.tsx`

### Zmeny

V sekcii **Strava** (dlaždice meal plans) upraviť zobrazenie sublabelu:

Nová logika pre zobrazenie textu pod názvom stravy (platí iba ak `selectedHotelPricing.baseMeal` existuje, t.j. cena hotela je odvodená z meal planu):

1. **Ak meal dlaždica = base meal** → zobraz `"v cene ubytovania"`
2. **Ak meal dlaždica ≠ base meal a používateľ má vybraný iný typ** → vypočítaj rozdiel oproti aktuálne vybranému typu stravy a zobraz znamienko `+`/`−`:
   - Ak je aktuálne vybraný base meal: zobraz `+{price}€/deň` (štandard)
   - Ak je vybraný iný (non-base) meal: zobraz rozdiel `{selectedSurcharge - thisSurcharge}€/deň` so znamienkom (pre base meal to bude negatívne, t.j. lacnejšie)

Pre prípad keď `baseMeal` nie je nastavený (hotel má vlastnú cenu), ponechať existujúce správanie (`od {price}€/deň`).

### Pseudokód logiky sublabelu

```tsx
const currentlySelectedKey = mealLabelsMap[configuration.meals] // reverse lookup label → key
const selectedSurcharge = currentlySelectedKey 
  ? (selectedHotelPricing?.mealPrices[currentlySelectedKey] ?? 0) 
  : 0

// per tile
let sublabel: string
if (selectedHotelPricing?.baseMeal) {
  const thisMealKey = reverse lookup (label → key)
  const thisIsBase = thisMealKey === selectedHotelPricing.baseMeal
  const thisSurcharge = selectedHotelPricing.mealPrices[thisMealKey] ?? 0
  
  if (configuration.meals === label) {
    // this tile is currently selected
    sublabel = thisIsBase ? "v cene ubytovania" : `+${thisSurcharge}€/deň`
  } else {
    // showing delta vs currently selected
    const delta = thisSurcharge - selectedSurcharge
    if (delta === 0) sublabel = "v cene"
    else if (delta > 0) sublabel = `+${delta}€/deň`
    else sublabel = `${delta}€/deň` // already has minus sign
  }
} else {
  sublabel = `od ${price}€/deň`
}
```

### Detail

- Pridá sa lokálna mapa label → MealKey (inverzia `mealLabels`) aby sme z `configuration.meals` (label) dostali kľúč na lookup do `mealPrices`.
- Zmena je iba vizuálna, neovplyvňuje výpočet ceny v `configurator-wizard.tsx`.

### Očakávaný výsledok (príklad: hotel s cenou 0, baseMeal = AI, mealPrices: bb=30, hb=50, fb=70, ai=90)

- Default výber = AI:
  - Raňajky: `−60€/deň`
  - Polpenzia: `−40€/deň`
  - Plná penzia: `−20€/deň`
  - All inclusive (vybraté): `v cene ubytovania`
- Používateľ prepne na Polpenzia:
  - Raňajky: `−20€/deň`
  - Polpenzia (vybraté): `+50€/deň` (doplatok voči base meal)
  - Plná penzia: `+20€/deň`
  - All inclusive: `+40€/deň`

