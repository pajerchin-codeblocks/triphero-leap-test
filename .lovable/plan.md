

## Odstránenie AI Chat kroku

### Zmeny

#### 1. `src/pages/Index.tsx`
- Odstrániť import `AIChat` a `hotelsByDestination`
- Zmeniť typ `Step` na `"wizard" | "summary"` (bez `"chat"`)
- Odstrániť `buildTripData` funkciu
- Odstrániť `chat` vetvu z renderingu
- Odstrániť `onChat` prop zo `SummaryPage`

#### 2. `src/components/summary-page.tsx`
- Odstrániť `onChat` z props interfejsu
- Odstrániť tlačidlo "Pokračovať na AI Chat"
- Ponechať len tlačidlo "Upraviť"

#### 3. `src/components/ai-chat.tsx`
- Zmazať celý súbor

#### 4. `supabase/functions/generate-camp-preview/index.ts`
- Zmazať edge function (bola len pre AI chat)

