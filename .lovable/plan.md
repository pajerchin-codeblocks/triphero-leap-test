

## Úprava AI promptu: rešpektovať čiastočné dáta, nevymýšľať certifikáty

### Zmeny v `supabase/functions/generate-camp-preview/index.ts`

**1. Flagy na detekciu user inputu (pred promptom):**
```typescript
const trainerExpProvided = !!configuration.trainerExperience
const trainerSpecProvided = !!configuration.trainerSpecialization  
const trainerCertProvided = !!configuration.trainerCertificates
const trainerBioProvided = !!configuration.trainerBio
const programProvided = !!configuration.dailyProgram
```

Fallbacky zostanú pre všetky polia **okrem certifikátov** — ak user nevyplní certifikáty, pošle sa prázdny string (AI si nesmie vymýšľať).

**2. Pravidlá do promptu:**
```
DÔLEŽITÉ PRAVIDLÁ:
- Polia označené (ZADANÉ TRÉNEROM) použi PRESNE. Nepridávaj, neupravuj.
- Polia označené (NEZADANÉ) môžeš voľne vymyslieť — OKREM certifikátov.
- Certifikáty: ak nie sú zadané, vráť PRÁZDNE pole []. Nikdy nevymýšľaj certifikáty.
- Pre dayTimeline: ak zadané napr. 2 sloty, vráť PRESNE tie 2.
- Pre credentials: ak zadaný 1 certifikát, vráť pole s 1 položkou.
```

**3. Sekcia Tréner v prompte — s flagmi:**
```
- Skúsenosti: ${trainerExperience} ${trainerExpProvided ? '(ZADANÉ TRÉNEROM)' : '(NEZADANÉ - vymysli)'}
- Špecializácia: ${trainerSpecialization} ${trainerSpecProvided ? '(ZADANÉ TRÉNEROM)' : '(NEZADANÉ - vymysli)'}
- Certifikáty: ${trainerCertificates} ${trainerCertProvided ? '(ZADANÉ TRÉNEROM - použi PRESNE tieto)' : '(NEZADANÉ - vráť prázdne pole, NEVYMÝŠĽAJ)'}
- Bio: ${trainerBio} ${trainerBioProvided ? '(ZADANÉ TRÉNEROM)' : '(NEZADANÉ - vymysli)'}
Program dňa: ${dailyProgram} ${programProvided ? '(ZADANÉ TRÉNEROM - použi PRESNE tieto sloty)' : '(NEZADANÉ - vymysli program)'}
```

**4. Odstrániť fallback pre certifikáty** — riadok kde sa nastavuje `trainerCertificates` na `'Certifikovaný osobný tréner'` sa zmení na prázdny string.

**5. Zmeniť dayTimeline v JSON šablóne** z pevných 8 slotov na dynamický popis.

### Dopad
Jeden súbor. Certifikáty sa nikdy nevymýšľajú. Ostatné polia sa vymýšľajú len ak sú úplne prázdne, čiastočný input sa rešpektuje presne.

