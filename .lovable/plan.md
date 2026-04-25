## Cieľ

V AI preview sa nesmú objavovať vymyslené fakty, ktoré tréner nezadal. AI má slúžiť len ako "marketingový copywriter" — preformulovať to, čo tréner vyplnil, do krajšieho, pravopisne správneho a marketingovo zaujímavého jazyka. Žiadne nové aktivity, vlastnosti hotela, certifikáty, programové sloty, benefity ani fakty navyše.

## Súbor

`supabase/functions/generate-camp-preview/index.ts`

## Princíp ("strict mode")

Pre každé pole vstupu rozlišujeme dva stavy:

- **ZADANÉ trénerom** → AI len **preformuluje** (gramatika, štýl, marketing tón), zachová význam, počet položiek, časy, fakty.
- **NEZADANÉ** → AI **NESMIE vymýšľať konkrétne fakty**. Buď pole vynechá (vráti prázdne pole / `null`), alebo použije len **všeobecnú, neutrálnu marketingovú formuláciu** založenú výhradne na typu tripu a destinácii (bez konkrétnych čísel, mien, miest, certifikátov, vybavenia, aktivít).

Frontend (`Preview.tsx`) už polia bezpečne renderuje cez optional chaining, takže prázdne polia nespôsobia chybu — len sa daná podsekcia nevykreslí (overím pri implementácii a v prípade potreby skryjem prázdne sekcie).

## Konkrétne pravidlá podľa sekcie

1. **trainerProfile**
   - `bio`: ak je `trainerBio` zadané → preformuluj. Ak nie → vygeneruj len neutrálny marketingový text založený výhradne na mene, špecializácii a rokoch skúseností (bez vymyslených úspechov, klientov, miest pôsobenia).
   - `credentials`: zostáva ako dnes — ak nie sú zadané, prázdne pole `[]`. Žiadne vymýšľanie.
   - `philosophy`: ak `trainerBio` nie je zadané, vráť prázdny string `""` (nevymýšľaj filozofiu).
   - `specialization`, `experience`: použi presne to, čo tréner zadal.

2. **dayTimeline**
   - Ak `dailyProgram` zadaný → parsuj sloty z textu, použi PRESNE rovnaký počet, časy aj typ aktivity. Marketingovo vylepši len **popis aktivity** (formulácia), nie samotnú aktivitu.
   - Ak `dailyProgram` NEZADANÝ → vráť **prázdne pole** `[]`. Nevymýšľaj sloty.

3. **luxuryExperience.amenities** (vybavenie hotela)
   - Použi výhradne to, čo prišlo z webhooku v `hotelDescription` / `hotelMealOptions`. Ak hotel popis obsahuje konkrétne amenity, AI ich len marketingovo preformuluje.
   - Ak nie sú konkrétne info → vráť prázdne pole `[]`. Nevymýšľaj bazén, spa, pláž, fitness atď.
   - `description`: stručná preformulácia `hotelDescription`. Ak chýba → prázdny string.

4. **whatMakesItSpecial**
   - `uniquePoints`: odvodené iba z reálne zaškrtnutých vecí (typ tripu, špeciálne aktivity, extras). Ak nič nie je → prázdne pole.
   - `groupDynamics`: odvodené iba z `participants`. Bez vymýšľania.
   - `exclusivity`: ak nie je dôvod (napr. malý počet účastníkov, prémiový hotel podľa `hotelStars`) → prázdny string.

5. **investmentBreakdown**
   - `whatYouGet`: deterministicky generované zo zaškrtnutých polí — ubytovanie (z hotela), strava (`meals`), transfer (ak true), letenka (existujúci safety net), extras, špeciálne aktivity, tréning podľa `campType`. AI ich len marketingovo preformuluje. Žiadne pridávanie ("welcome drink", "darček na privítanie" atď.) ak to tréner nezadal.
   - `notIncluded`: rovnako deterministické (letenka, ak nie je vybraná; transfer, ak nie je vybraný; strava, ak nie je vybraná). Bez vymýšľania ďalších položiek typu "cestovné poistenie", "víza", "osobné výdavky" — iba ak vyplývajú z toho, čo tréner NEvybral.

6. **practicalInfo**
   - `targetAudience`: odvodené iba z `campType` a `participants`.
   - `fitnessLevel`: odvodené iba z `campType`. Žiadne konkrétne čísla (napr. "musíte zabehnúť 5 km").
   - `whatToBring`: všeobecný neutrálny zoznam viazaný na `campType` (napr. pre Joga: "podložka, pohodlné oblečenie, fľaša na vodu") — bez konkrétnych značiek a vymyslených špecifík.
   - `faq`: max 3 otázky odvodené iba z reálnych údajov (cena, termín, strava, letenka). Žiadne vymyslené otázky o veciach, ktoré nikto nezadal.

7. **storyHook, transformation, hero, closingStory**
   - Sú to čisto marketingové sekcie — AI tu môže písať voľne, ale **nesmie uvádzať konkrétne fakty**, ktoré nepochádzajú zo vstupu (žiadne mená, čísla, miesta, certifikáty, konkrétne aktivity, ktoré tréner nezadal). Iba emocionálny, všeobecný copywriting nadviazaný na destináciu, typ tripu a meno trénera.

## Zmeny v prompte

Prepíšem celú sekciu **DÔLEŽITÉ PRAVIDLÁ** v `prompt` premennej tak, aby presne pomenovala "strict no-hallucination mode" a vymenovala pre každú sekciu, čo sa smie a čo nie. Hlavné pravidlá:

- "Tvoja jediná úloha je preformulovať a marketingovo vylepšiť to, čo poskytol tréner. NEPRIDÁVAJ žiadne fakty, ktoré nie sú vo vstupe."
- "Pre každé pole, ktoré je označené ako NEZADANÉ, vráť prázdny string `\"\"` alebo prázdne pole `[]` — okrem hero/storyHook/transformation/closingStory, kde môžeš písať všeobecný emocionálny copywriting bez konkrétnych faktov."
- "Zakázané vymýšľať: certifikáty, konkrétne hotelové vybavenie, programové sloty, špecifické aktivity, mená, čísla, miesta, klientov, úspechy."
- "Povolené: gramatické opravy, marketingový tón, synonymá, emotívne formulácie, štruktúrovanie."

Pridám aj vstup pre wizard polia, ktoré v prompte momentálne chýbajú (`participants`, `extras`), s explicitnými značkami `(ZADANÉ)` / `(NEZADANÉ)` rovnako ako pri trénerských poliach.

## Deterministická post-processing vrstva (safety net)

Po `JSON.parse(...)` (rozšírim existujúci safety-net blok pre letenku) urobím:

1. **credentials** — ak `trainerCertificates` nezadané, vynúť `previewData.trainerProfile.credentials = []`.
2. **dayTimeline** — ak `dailyProgram` nezadaný, vynúť `previewData.dayTimeline = []`.
3. **luxuryExperience.amenities** — ak `hotelDescription` prázdne, vynúť `[]`.
4. **investmentBreakdown.whatYouGet / notIncluded** — rozšírim súčasný flight safety net o:
   - transfer (zaradí podľa `configuration.transfer`),
   - strava (zaradí podľa `configuration.meals`),
   - extras (zaradí podľa `configuration.extras`).
   Logika: zo zoznamu odstráň položky, ktoré nezodpovedajú zaškrtnutej voľbe; ak chýba povinná položka, doplň ju neutrálnym textom.
5. **trainerProfile.philosophy** — ak `trainerBio` nezadané, prepíš na `""`.

## Frontend úprava (drobná)

V `src/pages/Preview.tsx` prejdem renderovanie sekcií, ktoré teraz môžu vrátiť prázdne polia/strings a pridám podmienky `condition && (<section>…</section>)`, aby sa neukázali prázdne sekcie (napr. "Čo si vziať so sebou", "Filozofia trénera", "Vybavenie hotela", "Program dňa"). Toto bude minimálny rozsah — iba ošetriť prázdne stavy, žiadny redizajn.

## Test po implementácii

Vygenerujem dva nové preview pomocou existujúceho test toolingu:

- **Lucia (Mallorca)** — s vyplnenými všetkými trénerskými poľami a programom → očakávame, že obsah bude verný vstupu, len krajšie napísaný.
- **Marek (Kréta)** — s minimom údajov (žiadny dailyProgram, žiadne certifikáty, žiadne bio) → očakávame, že príslušné sekcie budú prázdne / skryté a nikde sa neobjavia vymyslené fakty.

Aktualizujem slugy v `src/pages/TestPreviews.tsx` a vo whitelist v `src/pages/Preview.tsx`.

## Mimo scope

- Žiadny redizajn preview stránky.
- Žiadne nové polia vo wizarde.
- Cena a flight logika ostávajú ako sú.
