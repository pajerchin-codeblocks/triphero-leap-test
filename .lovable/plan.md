

## Pridanie disclaimeru k cene za osobu

### Čo sa zmení
Pridať malý text pod/vedľa zobrazenej ceny za osobu informujúci, že konečná cena sa môže líšiť.

### Zmeny v `src/components/configurator-wizard.tsx`

**Desktop sidebar** (riadky 575-580) — pridať pod cenu riadok:
```
<p className="text-[10px] text-muted-foreground mt-1">* Konečná cena sa môže líšiť</p>
```

**Mobile floating bar** (riadok 610) — pridať pod cenu v collapsed bare rovnaký text menším písmom, prípadne na tom istom riadku vedľa ceny:
```
<div className="text-right">
  <span className="text-lg font-bold text-accent">~ {estimatedPricePerPerson} €</span>
  <p className="text-[9px] text-muted-foreground">* Cena sa môže líšiť</p>
</div>
```

### Dopad
Jeden súbor, 2 miesta. Text bude dostatočne malý aby nerušil UX, ale jasne informoval o orientačnosti ceny.

