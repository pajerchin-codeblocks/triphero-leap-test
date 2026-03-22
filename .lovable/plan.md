## Kompaktnejší súhrn 

### Zmeny v `src/components/summary-page.tsx`

**1. Layout: 3 karty v jednom rade**

- Zmeniť grid z `grid-cols-1 md:grid-cols-2` + samostatný centered div na `grid-cols-1 md:grid-cols-3`
- Všetky 3 karty (Základné info, Ubytovanie, Biznis) budú v jednom rade
- Odstrániť obalový `flex flex-col` a `flex justify-center` wrapper okolo biznis karty
- Biznis karta dostane plnú šírku v gridu (`w-full` namiesto `md:w-1/2`)
- &nbsp;

**2 Buttony centrované pod kartami**

- Zmeniť `<div className="flex gap-4">` na `<div className="flex gap-4 justify-center">`

### Výsledná štruktúra

```text
┌──────────────┬──────────────┬──────────────┐
│  Základné    │  Ubytovanie  │    Biznis    │
│  informácie  │  a služby    │  nastavenia  │
└──────────────┴──────────────┴──────────────┘
          [ ← Upraviť ]  [ Vygenerovať ]
```

### Dopad

Jeden súbor, kompaktnejší layout.