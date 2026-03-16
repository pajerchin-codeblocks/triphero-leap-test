

## Pridanie hotel description do promptu a metadata

### Problém
Webhook hotel objekt (`WebhookHotel`) obsahuje pole `description`, `rating`, `price`, `transfer`, `transferPrice` a informácie o strave (`bb/hb/fb/ai` + ceny), ale do `configuration` sa ukladá len `hotelImage`, `hotelTitle`, `hotelLocation` a `hotelStars`. AI prompt tak nemá dostatočný kontext o hoteli.

### Zmeny

**1. `src/components/wizard-steps/step2-accommodation.tsx`** — pri výbere hotela uložiť aj ďalšie polia:
- `hotelDescription` (z `wh.description` alebo `staticHotel.description`)
- `hotelPrice` (z `wh.price` alebo `staticHotel.pricePerNight`)
- `hotelRating` (raw string z `wh.rating`, napr. `"RATING_4"`)
- `hotelTransfer` (boolean)
- `hotelTransferPrice` (z micros)
- `hotelMealOptions` (zoznam dostupných typov stravy, napr. `"Raňajky, Polpenzia, All inclusive"`)

**2. `supabase/functions/generate-camp-preview/index.ts`** — rozšíriť prompt o nové polia:
```text
Hotel: ${configuration.hotelTitle || 'neuvedený'}
Popis hotela: ${configuration.hotelDescription || 'neuvedený'}
Lokalita hotela: ${configuration.hotelLocation || 'neuvedená'}
Trieda hotela: ${configuration.hotelStars || 'neuvedená'} hviezdičiek
Cena hotela za noc: ${configuration.hotelPrice || 'neuvedená'}€
```

A rozšíriť `hotelImages` metadata o `description`:
```text
hotelImages: {
  hero: ...,
  title: ...,
  location: ...,
  description: configuration.hotelDescription || '',
}
```

### Dopad
AI bude mať kompletné info o hoteli a vygeneruje presnejšiu `luxuryExperience` sekciu a celkovo relevantnejší obsah landing page.

