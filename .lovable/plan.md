

# Restructure App: Wizard as Homepage + New Navbar

## Overview
Remove the landing page content, make the configurator wizard the homepage, replace `SiteNavigation` with an adapted `Navbar_1.tsx` from the reference site, and align the visual style (colors, fonts) with bright-trip-studio.lovable.app.

## Changes

### 1. Copy logo assets to project
- Copy `user-uploads://logo-color.png` to `src/assets/logo-color.png`
- Copy `user-uploads://logo-white.png` to `src/assets/logo-white.png`

### 2. Install framer-motion
- Add `framer-motion` dependency for navbar animations

### 3. Create new Navbar component (`src/components/navbar.tsx`)
Based on the uploaded `Navbar_1.tsx`, adapted for this project:
- Logo switches between `logo-color` (scrolled) and `logo-color` (always, since no hero image behind nav anymore -- wizard page has white background)
- Nav links as **external links** (`<a>` tags) pointing to:
  - Tripy → `https://bright-trip-studio.lovable.app/trips`
  - Lidri → `https://bright-trip-studio.lovable.app/leaders`
  - O nas → `https://bright-trip-studio.lovable.app/o-nas`
  - Kontakt → `https://bright-trip-studio.lovable.app/kontakt`
- CTA button "Zacat planovat trip" (scrolls to top / no-op since already on wizard)
- Mobile hamburger menu with framer-motion animations
- Since the wizard page has a white background (not a hero image), the navbar will always show the "scrolled" state (dark text, colored logo) -- no transparent-to-opaque transition needed
- Add `variant: "hero"` to button variants: gradient brand style matching the reference site (green-to-teal gradient)

### 4. Add button "hero" variant (`src/components/ui/button.tsx`)
Add a new variant matching the reference CTA style:
```
hero: "bg-gradient-to-r from-[#43E97B] to-[#38F9D7] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
```

### 5. Simplify `src/pages/Index.tsx`
- Remove the `currentStep` state machine for "landing" step
- Default directly to wizard view
- Remove all landing page content (hero, benefits, how-it-works sections)
- Keep only: Navbar + ConfiguratorWizard + SummaryPage flow
- Two states: "wizard" (default) and "summary"

### 6. Delete unused files
- `src/pages/Landing.tsx` -- redundant page
- `src/components/welcome-screen.tsx` -- no longer used
- `src/components/site-navigation.tsx` -- replaced by new Navbar

### 7. Update `src/App.tsx` routes
- Remove `/landing` route
- Keep `/` (Index), `/preview/:slug`, and catch-all

### 8. Update design tokens in `src/index.css`
Align with reference site's color scheme:
- `--primary`: keep navy `215 65% 11%` (matches reference `--primary: 217 91% 22%` -- close enough, or update to exact match)
- Add `gradient-brand` utility class for the green gradient used on CTAs
- Add `shadow-glow` and `shadow-soft` utilities from reference

### 9. Update font
The reference site uses `"Plus Jakarta Sans"` font. Add Google Fonts import and update body font-family to match.

## File summary
| File | Action |
|------|--------|
| `src/assets/logo-color.png` | Create (copy) |
| `src/assets/logo-white.png` | Create (copy) |
| `src/components/navbar.tsx` | Create |
| `src/components/ui/button.tsx` | Edit (add hero variant) |
| `src/pages/Index.tsx` | Rewrite (wizard-first, no landing) |
| `src/App.tsx` | Edit (remove /landing route) |
| `src/index.css` | Edit (add gradient/shadow utilities, font) |
| `index.html` | Edit (add Google Fonts link) |
| `src/pages/Landing.tsx` | Delete |
| `src/components/welcome-screen.tsx` | Delete |
| `src/components/site-navigation.tsx` | Delete |

