

## Mobile Fixes for Wizard

### Problem 1: Stepper not responsive on mobile
Currently the stepper bar has Back/Next buttons + 5 step circles + connector lines all in one row. At 390px this overflows and "Ďalej" button is cut off.

**Solution:** On mobile (`md` breakpoint):
- Hide the Back/Next buttons from the sticky stepper bar (they already exist at the bottom of the content area)
- Show only the step circles + connector lines (no labels, which are already `hidden md:inline`)
- This gives the circles enough room at 390px width

### Problem 2: Summary sidebar not visible on mobile
The summary sidebar is in a `lg:grid` column that stacks below content on mobile — user has to scroll past all form content to see it.

**Solution:** On mobile, render the summary as a fixed bottom bar:
- Fixed to bottom of screen (`fixed bottom-0 left-0 right-0`)
- Collapsed by default: show only the price line (e.g. "~ 850 €") as a compact bar
- Tappable to expand into a slide-up sheet/drawer showing full summary details
- Add `pb-16` padding to main content so nothing is hidden behind the bar
- On `lg+` screens, keep current sticky sidebar behavior

### Technical approach

**File:** `src/components/configurator-wizard.tsx`

1. **Stepper buttons:** Add `hidden md:flex` to both Back/Next buttons in the sticky stepper. The bottom navigation buttons remain visible on all screens.

2. **Mobile summary bar:** 
   - Add a `useIsMobile()` check
   - On mobile: render summary as `fixed bottom-0` compact bar with price, expandable via state toggle
   - On desktop: keep existing `lg:col-span-1` sidebar
   - Add bottom padding to prevent content overlap

3. **Expandable state:** Simple `useState<boolean>` for toggling the mobile summary open/closed with a chevron icon.

