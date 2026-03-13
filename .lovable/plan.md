

# Design Alignment: Wizard App with bright-trip-studio.lovable.app

## Current Gaps

After comparing the reference site with the current wizard, here are the key visual mismatches:

1. **Accent color mismatch** -- The wizard uses coral/red (`5 100% 69%` = `#FF6F61`) for selected states and highlights, but the reference site uses the green-to-teal gradient brand and navy primary. The coral accent clashes with the green CTA buttons.

2. **Selection button styling** -- Wizard buttons use `border-accent bg-accent/10 text-accent` (coral tint) for selected states. Should use the brand green or navy for selected states to match the reference.

3. **Step indicator bar** -- Current stepper is minimal circles + lines. The reference site uses more polished, rounded-full pill styles with backdrop blur effects.

4. **Card styling** -- Wizard cards lack the subtle shadow and refined border radius (rounded-2xl) used across the reference site. Cards should have `shadow-soft` and `rounded-2xl`.

5. **Typography hierarchy** -- Section headers in the wizard are `text-2xl font-bold`, while the reference uses larger, bolder headings with proper subtitle spacing.

6. **Top navigation + wizard spacing** -- The Spat/Dalej buttons at the top look disconnected. They should be integrated more cleanly.

7. **Summary sidebar** -- Plain card with no visual distinction. Should use the navy primary background (like the reference's dark CTA sections) to stand out.

## Proposed Changes

### 1. Update accent color to match brand (`src/index.css`)
Change `--accent` from coral `5 100% 69%` to a green that matches the gradient brand: `145 78% 45%`. Update `--ring` to match. This makes all selected states (months, destinations, durations) use green instead of clashing coral.

### 2. Refine card and button styling across wizard steps
- All `Card` wrappers: add `shadow-soft rounded-2xl border-0` for cleaner look
- Selection buttons (months, duration, participants): change selected state from `border-accent bg-accent/10 text-accent` to `border-primary bg-primary text-primary-foreground` (navy fill when selected, matching reference's category pill style)
- Destination cards: increase height from `h-24` to `h-28`, use `rounded-2xl`

### 3. Redesign step indicator (`configurator-wizard.tsx`)
- Use rounded-full pills with labels inside (not separate text)
- Active step gets `gradient-brand` background
- Completed steps get `bg-primary` (navy)
- Add subtle backdrop-blur container around stepper

### 4. Polish navigation buttons
- Move Spat/Dalej into a cleaner bar with `bg-muted/30 rounded-2xl p-4`
- "Dalej" button uses `variant="hero"` (gradient brand) instead of plain accent
- "Spat" stays as outline

### 5. Upgrade summary sidebar (`configurator-wizard.tsx`)
- Use `bg-primary text-primary-foreground` (navy dark card) to match reference's dark sections
- Price highlight uses `text-secondary` (green/teal) instead of accent
- Add `rounded-2xl` and subtle border

### 6. Minor typography and spacing tweaks
- Step titles: `text-3xl font-bold` instead of `text-2xl`
- Add subtitle text under titles with `text-muted-foreground text-base`
- Increase vertical spacing in card content from `space-y-8` to `space-y-10`

## Files to modify

| File | Change |
|------|--------|
| `src/index.css` | Update `--accent` to green, update `--ring` |
| `src/components/configurator-wizard.tsx` | Redesign stepper, nav buttons, summary sidebar |
| `src/components/wizard-steps/step1-basic.tsx` | Update card/button selection styles, rounded-2xl |
| `src/components/wizard-steps/step2-accommodation.tsx` | Same selection style updates |
| `src/components/wizard-steps/step3-business.tsx` | Same style updates, slider accent |
| `src/components/wizard-steps/step4-trainer-info.tsx` | Same style updates |
| `src/components/wizard-steps/step5-program.tsx` | Same style updates |

