# Zovšeobecnenie textov vo wizarde (líder, nielen tréner)

Cieľ: formulár musí znieť univerzálne — pre akýkoľvek trip s lídrom (fitness tréner, cukrárka, fotograf, sommelier…). Žiadne dátové kľúče (`trainerName`, `trainerExperience`, …) sa **nemenia**, aby ostala plná spätná kompatibilita s edge funkciou aj DB. Menia sa iba **viditeľné texty, poradie polí a placeholder návrhy**.

## 1. `src/components/wizard-steps/step4-trainer-info.tsx`

**Nadpis a podnadpis**
- „O vás ako trénerovi" → **„O vás ako lídrovi tripu"**
- Podnadpis: „Pomôžte nám lepšie pochopiť vaše skúsenosti a špecializáciu, aby sme mohli vytvoriť presvedčivý popis vášho tripu." (zachovať, je už neutrálny)

**Prehodenie poradia polí** (špecializácia ide pred skúsenosti):
1. Vaše meno a priezvisko *(bez zmeny)*
2. **Špecializácia / téma tripu** *  → naviazané na `trainerSpecialization`
   - placeholder: `napr. Cukrárstvo, fotografia, joga, wine tasting, funkčný tréning`
3. **Roky skúseností v danej špecializácii** *  → naviazané na `trainerExperience`
   - placeholder: `napr. 5 rokov`
4. **Certifikáty, kvalifikácie alebo ocenenia** *(nepovinné)* → `trainerCertificates`
   - placeholder: `Vypíšte certifikáty, kurzy, ocenenia alebo úspechy vo vašom odbore...`
   - hint pod poľom: „Nepovinné, ale pomôže to zvýšiť dôveryhodnosť" *(bez zmeny)*
5. **Váš príbeh** → `trainerBio`
   - placeholder: `Popíšte, čo vás k téme priviedlo, čo vás motivuje a prečo by sa účastníci mali prihlásiť práve na váš trip...`
   - hint: „Tento text použijeme pre vytvorenie autentického a presvedčivého popisu" *(bez zmeny)*

## 2. `src/components/configurator-wizard.tsx`

- Názov kroku v steps poli: `{ title: "O trénerovi", … }` → **`{ title: "O lídrovi", … }`**

## 3. `src/components/wizard-steps/step3-business.tsx`

- „Model odmeny **trénera** — Garantovaná odmena na osobu" → **„Model odmeny lídra — Garantovaná odmena na osobu"**
- Ostatné texty (Odmena za jedného účastníka, Spolu zarobíš…) ostávajú.

## 4. `src/components/wizard-steps/step5-program.tsx`

Placeholder programu zovšeobecniť, aby nesugeroval len fitness:
```
Napríklad:

8:00 — Raňajky a privítanie
9:30 — Hlavná aktivita dňa (workshop, výlet, ochutnávka…)
12:30 — Obed
15:00 — Popoludňajší program (prechádzka, voľný čas, druhá session)
18:00 — Večera
20:00 — Spoločenský večer alebo voľný program
```

## 5. `src/components/summary-page.tsx`

- Toast pri chýbajúcom mene: „Chýba meno **trénera**" / „… vyplňte meno **trénera** v kroku 4." → **„Chýba meno lídra"** / **„… vyplňte meno lídra v kroku 4."**
- Veta s prístupovým kódom: „Prístupový kód je meno **trénera**:" → **„Prístupový kód je meno lídra:"**

## Čo sa NEMENÍ

- Žiadne premenné, kľúče v `configuration`, validation keys (`trainerName`, `trainerExperience`, `trainerSpecialization`, `trainerReward`, `trainerBio`, `trainerCertificates`).
- Edge funkcia `generate-camp-preview` ani DB stĺpec `trainer_name` — interná logika a AI prompt zostávajú; názvoslovie v prompte je pre AI a netreba meniť pre používateľa.
- Štruktúra wizardu, dizajn, validácie, error UI.
