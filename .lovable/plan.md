

# Zjednotenie dizajnu s v0-triphero.vercel.app

## Co je problem

Aktualny projekt pouziva nespravne HSL hodnoty farieb v `src/index.css`. Layout a struktura stranky (`Index.tsx`) uz zodpovedaju referencnemu webu, ale farby nie su spravne nastavene podla dizajn systemu.

Konkretne rozdiely:
- **Primary** je `228 70% 12%` (modra), ma byt `215 65% 11%` (~#0A1A2F navy)
- **Accent** je `14 100% 60%` (~#FF5C33), ma byt `5 100% 69%` (~#FF6F61 coral)
- **Foreground** je `0 0% 5%` (takmer cierna), ma byt `0 0% 10%` (~#1A1A1A)
- **Muted foreground** je `0 0% 40%`, ma byt `0 0% 48%` (~#7A7A7A)
- Dark mode farby su tiez nespravne
- Chyba `xl` border-radius v tailwind konfigu

## Co sa zmeni

### 1. `src/index.css` -- Light mode farby

Oprava vsetkych HSL hodnot podla dizajn system exportu:

| Token | Aktualne | Nove |
|-------|----------|------|
| --primary | 228 70% 12% | 215 65% 11% |
| --foreground | 0 0% 5% | 0 0% 10% |
| --card-foreground | 0 0% 5% | 0 0% 10% |
| --popover-foreground | 0 0% 5% | 0 0% 10% |
| --secondary-foreground | 228 70% 12% | 215 65% 11% |
| --muted-foreground | 0 0% 40% | 0 0% 48% |
| --accent | 14 100% 60% | 5 100% 69% |
| --accent-foreground | 0 0% 100% | 0 0% 100% (bez zmeny) |
| --ring | 14 100% 60% | 5 100% 69% |
| --input | 0 0% 96% | 0 0% 94% |
| --destructive | 0 84% 60% | 0 74% 57% |
| sidebar hodnoty | aktualizovane rovnako |

### 2. `src/index.css` -- Dark mode farby

| Token | Aktualne | Nove |
|-------|----------|------|
| --background | 228 70% 12% | 215 65% 11% |
| --card | 228 60% 16% | 213 55% 17% |
| --popover | 228 70% 12% | 215 65% 11% |
| --primary-foreground | 228 70% 12% | 215 65% 11% |
| --secondary | 228 50% 20% | 215 51% 22% |
| --muted | 228 40% 24% | 215 45% 27% |
| --muted-foreground | 0 0% 60% | 0 0% 64% |
| --accent | 14 100% 60% | 5 100% 69% |
| --ring | 14 100% 60% | 5 100% 69% |
| --border | 228 50% 20% | 215 51% 22% |
| --input | 228 60% 16% | 215 51% 22% |
| sidebar hodnoty | aktualizovane rovnako |

### 3. `tailwind.config.ts` -- Doplnenie xl radius

Pridanie chybajucej hodnoty:
```
xl: "calc(var(--radius) + 4px)"
```

## Co sa NEMENI

- **Index.tsx** -- uz zodpoveda referencnemu webu (rovnaky layout, sekcie, texty, step kroky)
- **SiteNavigation** -- rovnaka struktura
- **Komponenty** (`Button`, `Card`, atd.) -- pouzivaju tokeny, automaticky preberaju nove farby
- **Landing.tsx** -- stary landing na `/landing` route, neovplyvneny

## Technicke detaily

Zmeny su cisto v CSS premennych a Tailwind konfigu. Vsetky komponenty uz referencuju tieto tokeny (`text-accent`, `bg-primary`, `text-foreground/70` atd.), takze po aktualizacii CSS sa farby opravia globalene napriec celym projektom -- wizard, summary, preview stranka, vsetko.

