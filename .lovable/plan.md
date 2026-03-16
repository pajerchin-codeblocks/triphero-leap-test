

## Oprava chýbajúceho názvu a triedy hotela v súhrne

### Problém
Summary stránka hľadá hotel len v statickej databáze (`hotelsByDestination`). Keď sa použijú webhook hotely, `getHotelDetails()` vráti `null` a názov aj hviezdy sa zobrazia ako "—".

### Riešenie
Uložiť aj `hotelStars` do konfigurácie v kroku 2 a v summary použiť `configuration.hotelTitle` / `hotelStars` namiesto statického lookupu.

### Zmeny

#### 1. `src/components/wizard-steps/step2-accommodation.tsx`
- Pri výbere hotela pridať do konfigurácie aj `hotelStars` (z `parseRatingStars(wh.rating)` pre webhook, alebo `staticHotel.stars` pre statický hotel)

#### 2. `src/components/summary-page.tsx`
- Zmeniť zobrazenie hotela: použiť `configuration.hotelTitle || hotelDetails?.name || "—"`
- Zmeniť zobrazenie triedy: použiť `configuration.hotelStars || hotelDetails?.stars` pre hviezdy
- Fallback na statický lookup ostáva pre prípad, že `hotelTitle`/`hotelStars` nie sú v konfigurácii

