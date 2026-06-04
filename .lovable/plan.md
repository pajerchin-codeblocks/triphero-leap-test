## Changes to `src/components/configurator-wizard.tsx`

### 1. Add a small `getUserEmail()` helper
Reads `sessionStorage.getItem("triphero_email")` defensively (guards `window`, try/catch, trims, returns `null` if empty).

### 2. Thread email into `form_start`
Update the existing `useEffect` so it calls:
```ts
pushFormStart(steps[currentStep].title, getUserEmail());
```

### 3. Thread email into `form_submit` in `handleNext`
Change the existing call to:
```ts
pushFormSubmit(steps[currentStep].title, getUserEmail());
```

### 4. Fire `form_submit` for each passed step in `handleStepClick`
Inside the forward-jump branch, after the validation loop succeeds (and before changing `currentStep`), emit one `form_submit` per step being skipped over, in order:
```ts
const email = getUserEmail();
for (let s = currentStep; s < index; s++) {
  pushFormSubmit(steps[s].title, email);
}
```
This covers both the step-0 webhook path and the regular forward-jump path. No other behavior in `handleStepClick` changes.

## Not changed
- `src/lib/dataLayer.ts` — helpers already accept an optional `email`.
- `src/components/summary-page.tsx` — `generate_lead` already passes email correctly.
- `handlePrevious` — backward navigation correctly does not fire `form_submit`.
