

## Loading obrazovka medzi krokom 1 a 2

### Problém
Pri prechode z kroku 1 do kroku 2 sa volá `sendStep1DataToWebhook()`, ale wizard okamžite prepne na krok 2 bez čakania na dáta. Používateľ vidí prázdny krok 2 kým sa hotely a letenky načítavajú.

### Riešenie

**Súbor: `src/components/configurator-wizard.tsx`**

1. Pridať stav `webhookLoading` (boolean)
2. V `handleNext` pri `currentStep === 0`:
   - Nastaviť `webhookLoading = true`
   - Počkať na `sendStep1DataToWebhook()`
   - Nastaviť `webhookLoading = false`
   - Až potom prepnúť na krok 2
3. Rovnako v `handleStepClick` ak prechádza cez krok 0 → ďalší
4. Ak `webhookLoading === true`, namiesto obsahu kroku zobraziť loading obrazovku:
   - Centrovaný spinner s animáciou
   - Text "Hľadáme najlepšie hotely a letenky pre tvoju destináciu..."
   - Prípadne progress bar alebo skeleton cards pre vizuálny feedback

### Dopad
Jeden súbor, cca 20 riadkov zmien. Používateľ uvidí príjemnú loading animáciu namiesto prázdneho kroku 2.

