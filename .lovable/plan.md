

# UI Tweaks: Hide Back Button on Step 1, Hide Navbar CTA, Align Summary Sidebar

## Changes

### 1. Hide "Späť" button on first step (`configurator-wizard.tsx`, line ~230)
- Conditionally render the back button: only show when `currentStep > 0`
- On step 0, render an empty div to maintain flex layout

### 2. Hide "Začať plánovať trip" CTA in navbar (`navbar.tsx`)
- Remove or hide the CTA button since user is already on the wizard page

### 3. Align summary sidebar to start at same height as step content (`configurator-wizard.tsx`)
- Currently the summary sidebar is inside the same grid as step content, but the nav buttons row above pushes the content down
- Move the "Späť / Ďalej" buttons row **inside** the left column (above the step content) instead of being a full-width row above the grid
- This way the summary card in the right column starts at the same vertical position as the step title/content on the left

## Files

| File | Change |
|------|--------|
| `src/components/configurator-wizard.tsx` | Hide back button on step 0; move nav buttons inside left column |
| `src/components/navbar.tsx` | Remove CTA button |

