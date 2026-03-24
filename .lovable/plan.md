

## Úprava Navbar na 1:1 zhodu s referenčným štýlom

### Rozdiely (aktuálny vs. referenčný)

| Vlastnosť | Aktuálny | Referenčný |
|---|---|---|
| Pozícia | `relative` | `fixed top-0 left-0 right-0` |
| Z-index | `z-30` | `z-50` |
| Transition | žiadny na kontajneri | `transition-all duration-300` |
| Background | inline `style` | Tailwind `bg-background/95 backdrop-blur-md` |
| Border | inline `style` | `border-b border-border/50` |
| Shadow | inline `style` | `shadow-soft` utility |
| Wrapper | `max-w-7xl mx-auto px-6` | `container px-4 md:px-6 lg:px-8` |
| Link hover | inline JS `onMouseEnter/Leave` | Tailwind `hover:text-primary` |
| Link transition | `transition-colors` | `transition-all duration-300` |
| CTA button | chýba | `Button variant="hero" size="sm"` na pravej strane |
| Layout | logo + links + spacer (2 sekcie) | logo + links + CTA (3 sekcie) |
| Mobile toggle farba | inline `style` | Tailwind `text-foreground` |

### Zmeny v `src/components/navbar.tsx`

**1. Kontajner nav:**
- `relative z-30` → `fixed top-0 left-0 right-0 z-50 transition-all duration-300`
- Odstrániť inline `style` a nahradiť Tailwind triedami: `bg-background/95 backdrop-blur-md shadow-soft border-b border-border/50`
- Pridať padding na `<main>` v `Index.tsx` (alebo `pt-16 md:pt-20`) aby obsah nebol pod fixným headerom

**2. Wrapper div:**
- `max-w-7xl mx-auto px-6` → `container px-4 md:px-6 lg:px-8`

**3. Desktop linky:**
- Odstrániť `onMouseEnter`/`onMouseLeave` handlery
- Bežné linky: `text-sm font-medium transition-all duration-300 text-foreground hover:text-primary`
- Pill link (Tripy): `bg-primary/10 text-primary font-bold px-3 py-1 rounded-full`

**4. Pridať CTA button:**
- Odstrániť spacer div
- Pridať `<div className="hidden md:flex items-center gap-3">` s `<Button variant="hero" size="sm">` (import z `@/components/ui/button`)
- Text CTA podľa potreby (napr. "Vytvoriť camp")

**5. Mobile toggle:**
- Odstrániť inline `style`, použiť `text-foreground`

**6. Pridať offset v `src/pages/Index.tsx`:**
- Na hlavný wrapper pridať `pt-16 md:pt-20`

### Dopad
2 súbory: `navbar.tsx` (kompletný refaktor štýlov), `Index.tsx` (padding-top pre fixed header).

