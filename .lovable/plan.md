

## Oprava: AI preview ignoruje vybranú letenku v sekcii "Nie je zahrnuté"

### Problém
V `supabase/functions/generate-camp-preview/index.ts` prompt pre Gemini nedostáva informáciu o tom, či používateľ vybral letenku (`configuration.selectedFlight`). AI preto defaultne pridáva "spiatočná letenka" do poľa `notIncluded`, hoci letenka môže byť v cene.

Tiež chýba pravidlo pre `whatYouGet` / `notIncluded`, aby sa letenka konzistentne zaradila podľa toho, či bola vybraná.

### Súbor
`supabase/functions/generate-camp-preview/index.ts`

### Zmeny

**1. Vypočítať flight info pred promptom (pred riadkom 94):**

```ts
const flightSelected = !!configuration.selectedFlight?.price;
const flightPrice = configuration.selectedFlight?.price;
const flightMonth = configuration.selectedFlight?.month;
const flightInfo = flightSelected
  ? `Spiatočná letenka${flightMonth && flightMonth !== "default" ? ` (${flightMonth})` : ""}${flightPrice ? ` — približne ${flightPrice}€` : ""} — ZAHRNUTÁ V CENE`
  : "Letenka NIE JE zahrnutá v cene (účastník si rieši sám)";
```

**2. Pridať do promptu (sekcia s parametrami, okolo riadku 109-118)** nový riadok:
```
Letenka: ${flightInfo}
```

**3. Doplniť do `DÔLEŽITÉ PRAVIDLÁ` (riadky 96-101)** nové pravidlo:
```
- Letenka: ak je ZAHRNUTÁ V CENE, MUSÍ byť uvedená vo "whatYouGet" a NESMIE sa objaviť v "notIncluded". Ak NIE JE zahrnutá, MUSÍ byť uvedená v "notIncluded" a NESMIE sa objaviť vo "whatYouGet". Toto pravidlo je absolútne.
```

**4. (Voliteľné, ale odporúčané) Post-processing safety net** — po parsovaní AI odpovede odfiltrovať/pridať položku letenky aby sme garantovali správanie aj keby AI zlyhalo:

```ts
// po `const parsed = JSON.parse(...)` 
const ib = parsed.investmentBreakdown;
if (ib) {
  const flightRegex = /letenk|flight/i;
  ib.whatYouGet = (ib.whatYouGet || []).filter((x: string) => flightSelected || !flightRegex.test(x));
  ib.notIncluded = (ib.notIncluded || []).filter((x: string) => !flightSelected || !flightRegex.test(x));
  if (flightSelected && !ib.whatYouGet.some((x: string) => flightRegex.test(x))) {
    ib.whatYouGet.unshift(`Spiatočná letenka${flightMonth && flightMonth !== "default" ? ` (${flightMonth})` : ""}`);
  }
  if (!flightSelected && !ib.notIncluded.some((x: string) => flightRegex.test(x))) {
    ib.notIncluded.unshift("Spiatočná letenka");
  }
}
```

### Očakávaný výsledok
- Ak používateľ vyberie letenku v kroku 2 → v preview pod "Čo dostaneš" sa objaví "Spiatočná letenka (mesiac)" a v "Nie je zahrnuté" letenka chýba.
- Ak nevyberie → letenka zostáva v "Nie je zahrnuté".

### Mimo scope
Cena letenky sa do `pricePerPerson` už počíta v `configurator-wizard.tsx` (overené v predchádzajúcich krokoch), tak tam zmeny nie sú potrebné.

