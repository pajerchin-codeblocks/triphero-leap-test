

## Uloženie preview do databázy s jednoduchým prístupovým kódom

### Koncept

Namiesto plnej registrácie/loginu použijeme jednoduchý prístupový kód odvodený z mena trénera. Preview sa uloží do databázy a tréner k nemu pristúpi cez URL + zadanie svojho mena.

### Zmeny

#### 1. Databáza — nová tabuľka `camp_previews`

```sql
CREATE TABLE public.camp_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  preview_data JSONB NOT NULL,
  access_code TEXT NOT NULL,
  trainer_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS off — prístup riadime cez edge function
ALTER TABLE public.camp_previews ENABLE ROW LEVEL SECURITY;
```

#### 2. Edge function `preview-access` — uloženie a načítanie

- **POST** (uloženie): prijme `{ slug, previewData, trainerName }`, odvodí `access_code` z mena (lowercase, bez diakritiky), uloží do DB
- **GET** (načítanie): prijme `{ slug, accessCode }`, overí kód, vráti `preview_data`

Používa service role key, takže RLS sa obíde.

#### 3. Preview.tsx — prístupový formulár

- Namiesto čítania z `localStorage` sa zobrazí input "Zadajte vaše meno a priezvisko"
- Po zadaní sa zavolá edge function, overí access code, a ak sedí, zobrazí preview
- Pridá sa `<meta name="robots" content="noindex, nofollow">` aby Google neindexoval

#### 4. Uloženie preview po vygenerovaní

- V AI chat flow (alebo v `generate-camp-preview` edge function), po vygenerovaní preview dát sa zavolá uloženie do DB
- Access code = meno trénera z konfigurácie (lowercase, bez diakritiky, bez medzier)

#### 5. robots.txt — blokovanie crawlerov

```
Disallow: /preview/
```

### Tok

```text
Tréner vyplní wizard → AI chat vygeneruje preview
  → preview sa uloží do DB (slug + access_code z mena)
  → tréner dostane link /preview/{slug}
  → pri otvorení linku zadá svoje meno → overí sa → zobrazí sa preview
```

### Súbory
- Nová tabuľka: `camp_previews`
- Nový edge function: `supabase/functions/preview-access/index.ts`
- Upravené: `src/pages/Preview.tsx` (DB fetch + prístupový formulár)
- Upravené: `public/robots.txt` (disallow /preview/)
- Upravené: flow kde sa generuje preview (uloženie do DB)

