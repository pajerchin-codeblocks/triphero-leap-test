

## Replace hardcoded hotels/meals with dynamic webhook data

The n8n webhook returns both `hotels` and `flights` in the response, but currently only `flights` are extracted. Step 2 still uses hardcoded data from `hotels-database.ts`. This plan replaces the static data with the real webhook response.

### Webhook hotel data structure

Each hotel from webhook has:
- `id`, `title`, `price` (per night), `image`, `location`, `description`, `rating` (e.g. "RATING_4")
- Meal availability: `bb`, `hb`, `fb`, `ai` (booleans)
- Meal prices: `bbCena`, `hbCena`, `fbCena`, `aiCena` (each `{ amountMicros, currencyCode }` — divide by 1,000,000 for EUR)
- `transfer` (boolean), `transferPrice` (`{ amountMicros, currencyCode }`)

### Changes

#### 1. `configurator-wizard.tsx` — extract and store webhook hotels

- Add new state: `webhookHotels` to hold the hotel array from the response
- In `sendStep1DataToWebhook`, parse the response object which has shape `{ hotels: [...], flights: [...] }` and store both
- Pass `webhookHotels` as a new prop to `Step2Accommodation`
- Update `calculateEstimatedPrice` to look up hotel price from `webhookHotels` instead of `hotelsByDestination`
- Update sidebar summary hotel name lookup to use `webhookHotels`

#### 2. `step2-accommodation.tsx` — use dynamic data

- Accept new prop `webhookHotels` (the array from webhook)
- **Hotels section**: Render `webhookHotels` instead of `hotelsByDestination[destination]`. Map `rating` ("RATING_4" → 4 stars), use `title`, `price`, `image`, `description`
- **Meals section**: When a hotel is selected, show only the meal types that hotel supports (`bb`→"Raňajky", `hb`→"Polpenzia", `fb`→"Plná penzia", `ai`→"All inclusive"). Show price from `amountMicros / 1_000_000`. Fall back to static `mealsPricing` if no webhook hotels
- **Transfer section**: Use selected hotel's `transfer` availability and `transferPrice.amountMicros / 1_000_000` instead of static `transferPrice`
- **Flights section**: Remove the condition requiring hotel+meals selection — show flights immediately since they come from the same webhook call

#### 3. Price calculation updates

- Hotel price: use `webhookHotel.price * duration` (price is per night)
- Meals price: use `amountMicros / 1_000_000` from the selected hotel's meal option (this is already total, or per day — need to check; the values like 18000000 = 18€ suggest per day)
- Transfer: use `transferPrice.amountMicros / 1_000_000` from selected hotel

#### 4. Fallback

- If `webhookHotels` is empty (webhook failed), fall back to existing `hotelsByDestination` so the app still works

### Files modified
- `src/components/configurator-wizard.tsx`
- `src/components/wizard-steps/step2-accommodation.tsx`

