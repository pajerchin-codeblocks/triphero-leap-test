

## Dynamické načítanie destinácií z webhooku

### Problém
Destinácie sú hardcoded v `step1-basic.tsx`. Potrebujeme volať webhook na získanie len tých destinácií, ktoré majú aktívny hotel.

### Riešenie

#### 1. Nová edge funkcia `supabase/functions/fetch-destinations/index.ts`
- Proxy na webhook `https://n8n.codeblocks.sk/webhook/2b1bdb2e-2c9f-4c0a-9f5f-2f7d7b0c3a1e`
- Štandardné CORS hlavičky, GET/POST request na n8n
- Vráti pole destinácií z webhooku

#### 2. `src/components/wizard-steps/step1-basic.tsx`
- Odstrániť hardcoded `initialMainDestinations` a `additionalDestinations`
- Pridať prop `availableDestinations` (pole `{ id, label, image }`)
- Zobraziť loading spinner kým sa destinácie načítavajú
- Ak webhook vráti prázdny zoznam alebo zlyhá, zobraziť fallback správu
- Odstrániť "Všetky krajiny →" popup (už nie je potrebný — zobrazujú sa len aktívne destinácie)

#### 3. `src/components/configurator-wizard.tsx`
- Na mount zavolať edge funkciu `fetch-destinations`
- Uložiť výsledok do stanu `availableDestinations`
- Odovzdať do `Step1Basic` ako prop
- Webhook odpoveď: predpokladáme pole objektov s `id`/`name`/`image` alebo country code — zmapovať na UI formát pomocou `countryCodeToDestination` ak treba

#### 4. `src/lib/destination-mapping.ts`
- Prípadne rozšíriť mapping ak webhook vráti nové krajiny

### Otvorená otázka
Aký formát vracia webhook? Budeme potrebovať otestovať response a prispôsobiť parsing. Implementácia bude predpokladať pole objektov a prispôsobí sa podľa skutočnej odpovede.

