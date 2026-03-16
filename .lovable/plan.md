

## Fix: Add `destinationName` to flight prices webhook payload

The n8n workflow expects a `destinationName` field (the original Slovak name like "Taliansko") but currently only receives `destination` (the ISO country code like "IT").

### Change

**`src/components/configurator-wizard.tsx`** — line 77-83, add `destinationName`:

```typescript
const webhookData = {
  destination: destinationToCountryCode[configuration.destination] || configuration.destination,
  destinationName: configuration.destination,
  months: convertMonthsToWebhookFormat(configuration.months || []),
  duration: Number.parseInt(configuration.duration) || 0,
  participants: configuration.participants || "",
  campType: configuration.campType || "",
};
```

Single line addition. No other files need changes.

