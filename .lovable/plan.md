## Bloomreach (Exponea) tracking + email/consent gate

### 1. Vloženie Exponea snippetu (`index.html`)
Do `<head>` v `index.html` pridáme presne dodaný `<script>` blok s konfiguráciou:
- target: `https://api-analytics.pelikan.sk`
- token: `fea0907c-443c-11ef-816c-6aee3afd3a28`
- `experimental.non_personalized_weblayers: true`
- volanie `exponea.start()`

Snippet sa nemodifikuje. `customer` ostane zakomentovaný (anonymný user až do identify).

Pre TypeScript pridáme do `src/vite-env.d.ts` deklaráciu:
```ts
declare global {
  interface Window {
    exponea?: any;
  }
}
```

### 2. Úprava súhrnnej stránky (`src/components/summary-page.tsx`)
Nad existujúcou dvojicou tlačidiel (Upraviť / Vygenerovať preview) pridáme formulár s:
- **Email input** (typ `email`, povinný, validovaný cez `zod`)
- **Povinný checkbox** s textom súhlasu so spracovaním údajov a marketingovými účelmi
- Tlačidlo **„Vygenerovať preview"** ostáva primárne (premiestnené pod formulár), tlačidlo **„Upraviť"** ostáva sekundárne vedľa neho

Tlačidlo „Vygenerovať preview" je `disabled` kým:
- email je prázdny / nevalidný, alebo
- checkbox nie je zaškrtnutý, alebo
- prebieha generovanie

Po skrytí formulára (keď už `previewLink` existuje) zostane viditeľný len výsledok + tlačidlo „Vygenerovať znova" (bez opätovného vyžadovania consentu v rámci tej istej session).

### 3. Validácia v `handleGeneratePreview`
Pred súčasným volaním `supabase.functions.invoke(...)`:
1. Validovať email cez `zod` schému (`z.string().trim().email().max(255)`).
2. Ak checkbox nie je `true` → toast „Súhlas je povinný" a return.
3. Ak email nevalidný → toast s konkrétnou chybou a return.

### 4. Bloomreach volania (po validácii, pred `invoke`)
```ts
if (window.exponea) {
  window.exponea.identify(
    { registered: email },                 // hard ID
    { email, registered: email }           // soft attributes
  );
  window.exponea.update({ email });
  window.exponea.track('registered', { email, consent: true });
  window.exponea.track('consent', {
    action: 'accept',
    category: 'all',
    identification: email,
    source: 'triphero_builder',
    valid_until: 'unlimited',
  });
}
```
Volania obalíme do `try/catch` aby zlyhanie trackeru nikdy nezablokovalo generovanie preview.

### 5. Technické detaily
- Žiadne nové závislosti (zod už je v projekte cez shadcn form).
- Žiadne secrets (token je publishable a patrí priamo do `index.html`).
- Žiadne zmeny v edge functions, DB ani v Preview stránke.
- Email a consent sa zatiaľ neukladajú do našej DB — len posielajú do Bloomreach (ak budeš chcieť perzistenciu, doplníme samostatne).

### Dotknuté súbory
- `index.html` — Exponea snippet v `<head>`
- `src/vite-env.d.ts` — typ pre `window.exponea`
- `src/components/summary-page.tsx` — formulár (email + consent), validácia, Bloomreach volania
