

## Použitie fotiek hotela z webhooku v preview

### Problém
Webhook vracia pre každý hotel pole `image` (URL fotky), ale táto informácia sa nikde neukladá do `preview_data` a Preview stránka používa hardcoded statickú fotku (`/luxury-beach-resort-sunset-aerial-view.jpg`).

### Riešenie
Preniesť webhook hotel data (hlavne `image`, `title`, `location`) cez konfiguráciu až do edge function a uložiť ich do `preview_data`. Preview stránka potom použije tieto fotky namiesto statických.

### Zmeny

#### 1. `src/components/configurator-wizard.tsx`
- Pri výbere hotela uložiť do konfigurácie aj `hotelImage`, `hotelTitle` a `hotelLocation` z webhook hotela (okrem `hotel` ID ktorý sa už ukladá)

#### 2. `supabase/functions/generate-camp-preview/index.ts`
- Prevziať `hotelImage`, `hotelTitle`, `hotelLocation` z konfigurácie
- Zahrnúť tieto hodnoty do `fullPreviewData` (mimo AI generovaného obsahu) ako nové pole `hotelImages`

#### 3. `src/pages/Preview.tsx`
- Rozšíriť `CampPreviewData` interface o `hotelImages?: { hero: string; title: string; location: string }`
- Hero sekcia: použiť `campData.hotelImages?.hero` namiesto statického obrázka
- Luxury Experience sekcia: zobrazenie hotel image ak je k dispozícii
- Fallback na statický obrázok ak webhook data chýbajú
- Tréner fotky: nahradiť neexistujúce lokálne súbory ilustračnými Unsplash URL

