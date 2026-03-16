

## Oprava nesúladu dát medzi konfigurátorom a AI promptom + mockovacie dáta

### Identifikované problémy

1. **`programDescription` vs `dailyProgram`** — prompt používa `configuration.programDescription`, ale wizard ukladá pole ako `dailyProgram`
2. **`specialActivities` chýba** — wizard zbiera špeciálne aktivity, ale prompt ich neposiela AI
3. **`budgetPerPerson` neexistuje** — prompt referencuje `configuration.budgetPerPerson`, ale konfigurátor toto pole nikdy nenastavuje. Správne by mal použiť vypočítanú cenu alebo aspoň realistický fallback
4. **`hotelTitle` / `hotelLocation` nie sú v prompte** — AI nevie o názve a lokácii hotela, takže vygeneruje generický text pre luxury sekciu
5. **Žiadne mockovacie dáta** — ak tréner nevyplní nepovinné polia (certifikáty, bio, špecializáciu), AI dostane "neuvedené" a výsledok je slabý

### Zmeny v `supabase/functions/generate-camp-preview/index.ts`

#### Opravy mapovaní polí:
- `configuration.programDescription` → `configuration.dailyProgram`
- Pridať `configuration.specialActivities` do promptu
- Pridať `configuration.hotelTitle` a `configuration.hotelLocation` do promptu
- `configuration.budgetPerPerson` → použiť `configuration.estimatedPrice` ak existuje, inak fallback 599€

#### Mockovacie dáta (defaults ak tréner nevyplní):
Pred zostavením promptu pripraviť default hodnoty:

```text
trainerExperience: fallback "5+ rokov"
trainerSpecialization: odvodeníé z campType (napr. "Fit camp" → "Funkčný tréning a kondičné cvičenia")
trainerCertificates: fallback "Certifikovaný osobný tréner"
trainerBio: fallback generovaný z mena + špecializácie, napr. "[Meno] je skúsený tréner, ktorý sa venuje ..."
dailyProgram: fallback s typickým programom podľa campType
```

Mapovanie campType → defaultná špecializácia:
- "Fit camp" → "Funkčný tréning, HIIT a kondičné cvičenia"
- "Yoga retreat" → "Joga, meditácia a dychové cvičenia"
- "Lifestyle" → "Wellness, výživa a zdravý životný štýl"
- "Komunitný pobyt" → "Skupinové aktivity a team building"
- default → "Fitness a wellness"

### Súhrn zmien
Jeden súbor: `supabase/functions/generate-camp-preview/index.ts` — oprava 4 field mappingov + pridanie bloku s mockovacími dátami pre prázdne polia

