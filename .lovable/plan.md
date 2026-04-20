## Úprava Navbar podľa nových inštrukcií

### Súbor

`src/components/navbar.tsx`

### Zmeny

**1. Aktualizácia `navLinks`:**

```ts
const navLinks = [
  { label: "Naše tripy", href: "https://www.triphero.sk/nase-tripy", isPill: true },
  { label: "Lídri", href: "https://www.triphero.sk/lidri" },
  { label: "O TripHero", href: "https://www.triphero.sk/o-triphero" },
  { label: "Kontakt", href: "https://www.triphero.sk/kontakt" },
]
```

**2. Logo link** → `https://www.triphero.sk/` (zachovať existujúci `h-8 md:h-10` + výška navbaru `h-16 md:h-20` ostáva).

**3. Desktop CTA tlačidlo:**

- Label: `Začať plánovať trip`
- Href: `https://ai.triphero.sk/`
- Zachovať `variant="hero" size="sm"`

**4. Mobile menu — vylepšenia podľa inštrukcií:**

- Overlay: zmeniť `bg-background` → `bg-background/98 backdrop-blur-lg`
- Pill štýl pre "Naše tripy": `bg-primary/10 text-primary px-4 py-1 rounded-full` (self-start aby pill nezaberal celú šírku)
- Aktívne odkazy: `text-foreground` (default) — možnosť `text-primary` ak treba aktívny stav (momentálne nie je tracking aktívneho linku, takže ostáva default)
- Pridať CTA tlačidlo na konci mobile menu: `variant="hero" size="lg"` + `w-full`, label `Začať plánovať trip`, smeruje na `https://ai.triphero.sk/`
- Animácia stagger 0.1s ostáva (`delay: i * 0.1`), pridať CTA ako posledný stagger item

**5. Desktop nav links** — zachovať existujúce štýly:

- Default: `text-foreground hover:text-primary`
- Pill ("Naše tripy"): `bg-primary/10 text-primary font-bold px-3 py-1 rounded-full`

**6. Hamburger ikona** — `text-foreground` (už je správne).

### Header background

Už zodpovedá špecifikácii (`bg-background/95 backdrop-blur-md shadow-soft border-b border-border/50`) — bez zmeny.

### Bez zmeny

- Framer-motion animácia navbaru (initial y: -100)
- Body overflow lock pri otvorenom mobile menu
- Výška navbaru a layout padding v `Index.tsx` (`pt-16 md:pt-20`)