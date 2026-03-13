

# UI Tweaks: Sticky Top, Buttons in Stepper, Conditional Summary

## Changes (`src/components/configurator-wizard.tsx`)

### 1. Sticky sidebar positioning
Change `sticky top-6` to `sticky` with inline `style={{ top: '4.5rem' }}` and add `mt-[10rem]` margin-top.

### 2. Merge nav buttons into the stepper bar
Remove the separate nav buttons div (lines 231-242). Instead, integrate the Back/Next buttons into the stepper bar (line 202) — add them as part of the same `flex items-center justify-between mb-8 bg-muted/40 backdrop-blur-sm rounded-2xl p-4` container. Back button on the left (hidden on step 0), stepper indicators in the middle, Next button on the right.

### 3. Show summary only when something is selected
Add a `hasSummaryData` check: `configuration.destination || configuration.months?.length > 0 || configuration.duration || ...`. Wrap the entire summary sidebar column content in this conditional so nothing renders until the user makes a selection.

## Structure after changes

```text
┌─────────────────────────────────────────────────────┐
│ [← Späť]  ①──②──③──④──⑤  [Ďalej →]               │  ← single bar
└─────────────────────────────────────────────────────┘
┌──────────────────────────┐  ┌──────────────────────┐
│ Step content             │  │ Summary (if data)    │
│                          │  │ mt-[10rem]           │
│                          │  │ sticky top-4.5rem    │
└──────────────────────────┘  └──────────────────────┘
```

### Files
- `src/components/configurator-wizard.tsx` — all three changes

