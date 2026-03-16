

## Redizajn Preview stránky — Premium konverzný landing page

### Súčasný stav
Preview.tsx už renderuje dáta z `CampPreviewData` interfejsu (hero, trainerProfile, dayTimeline, transformation, investmentBreakdown, urgency, atď.). Dizajn je funkčný ale základný — chýba premium feel, vizuálna hierarchia a konverzné elementy.

### Plán zmien

**Jediný súbor: `src/pages/Preview.tsx`** — kompletný redizajn renderovanej časti (od riadku 190).

#### 1. Hero sekcia (full-width, immersive)
- Full-viewport hero s gradient overlay na obrázku
- Veľký headline + subheadline s animovaným fade-in
- Trainer badge (meno + krátky popis) v hero
- Floating CTA tlačidlo s benefit-driven textom
- Scarcity badge ("Zostáva X miest")

#### 2. Key highlights strip
- Horizontálne karty s ikonami: dátum, lokácia, kapacita, cena
- Scannable, vizuálne výrazné

#### 3. Story hook sekcia
- Transformation-first copy (opening → problem → solution)
- Veľká typografia, whitespace

#### 4. Trainer profile (premium card)
- Side-by-side foto + bio s gradient pozadím
- Credentials ako badge elementy
- Osobný quote/filozofia

#### 5. Day timeline (vizuálna timeline)
- Vertikálna čiara s bodkami, časy a aktivity
- Alternujúce strany na desktop

#### 6. Transformation sekcia
- Split: fyzické + mentálne benefity v 2 stĺpcoch
- Check ikony, benefit-driven jazyk

#### 7. What's included (ikony + grid)
- 3-stĺpcový grid s ikonami pre amenity/služby
- Vizuálne karty

#### 8. Investment breakdown
- Centered pricing card s "od XX€" prominentne
- Čo je zahrnuté vs. nie je zahrnuté

#### 9. Social proof placeholder
- Placeholder testimonial s hviezdičkami
- "Predchádzajúci účastníci hovoria..."

#### 10. Urgency + Final CTA
- Countdown/scarcity element
- Veľký gradient CTA s hover efektom
- Closing story narrative

#### 11. Sticky booking sidebar (desktop)
- Zostáva z aktuálneho dizajnu, ale s vylepšeným styling

### Technické detaily
- Všetky dáta z existujúceho `CampPreviewData` interfejsu — žiadne zmeny v dátovom modeli
- Používa existujúce Tailwind utility classes + design system (accent, primary, gradient-brand)
- Pridané: backdrop-blur, gradient overlays, micro-animations (hover states)
- Mobile-first responsive layout
- Access formulár a noindex meta tag zostávajú bez zmeny

