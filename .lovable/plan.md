

## Generovanie PDF špecifikácie projektu TripHERO

### Postup

Vytvorím Python skript pomocou `reportlab`, ktorý vygeneruje štruktúrovaný PDF dokument s kompletnou projektovou špecifikáciou.

### Obsah PDF

1. **Titulná strana** - TripHERO Camp Configurator, dátum
2. **Účel a ciele** - popis aplikácie
3. **Architektúra** - frontend (React/Vite/TS), backend (Supabase Edge Functions), databáza, AI integrácia
4. **Technológie a závislosti** - kompletný zoznam z package.json
5. **Dátové modely** - camp_previews tabuľka, WebhookHotel interface, CampPreviewData
6. **Edge Functions** - fetch-destinations, fetch-flight-prices, generate-camp-preview, preview-access
7. **Biznis logika** - cenový kalkulátor (INSTAGYM_COMMISSION, trainer reward, hotel/flight/meals/transfer)
8. **Integrácie** - n8n webhooky, Lovable AI Gateway (Gemini 3 Flash)
9. **Environment premenné** - zoznam všetkých secretov
10. **História projektu** - rekonštrukcia z kódu a konverzácie
11. **Migračný plán** - kroky, riziká, poradie
12. **Checklist** - overenie po migrácii

### Technické detaily

- Jeden Python skript s reportlab (SimpleDocTemplate + Platypus)
- Výstup: `/mnt/documents/triphero-specification.pdf`
- A4 formát, profesionálne formátovanie s farebnými nadpismi
- QA cez pdftoppm konverziu

