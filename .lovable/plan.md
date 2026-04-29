## Hotel list improvements (Step 2 — Ubytovanie)

Three changes to the hotel grid in `src/components/wizard-steps/step2-accommodation.tsx`.

### 1. Hide hotels priced at 0 €

A hotel is hidden when its effective base price (after running `getHotelPricing(hotel)`) is `0` — covers both:
- `hotel.price === 0` AND no available meal has a price > 0, or
- only meals are present but all of their `cena` values are 0.

Apply the same filter to the static `hotelsByDestination` fallback (filter out `pricePerNight <= 0`).

### 2. Show first 4 hotels, then "Zobraziť viac"

- Add local state `const [showAll, setShowAll] = useState(false)`.
- Slice the filtered list to 4 by default; render full list when `showAll` is true.
- Show a centered ghost button below the grid only when more than 4 hotels exist:
  - "Zobraziť viac (+N)" → expands
  - "Zobraziť menej" → collapses
- Reset `showAll` automatically when destination changes (same hook scope as `customExtra`).

### 3. Hotel photo gallery + full-page lightbox

**Data shape**
- Extend `WebhookHotel` in `src/lib/webhook-types.ts` with optional `images?: string[]`.
- Helper `getHotelImages(hotel)` returns `hotel.images?.length ? hotel.images : [hotel.image]` (deduped, falsy filtered).
- Static `hotelsByDestination` hotels stay single-image (wrapped in array via the same helper).

**On the hotel tile**
- Replace the single `<img>` with a swipeable image container:
  - State per tile: `const [idx, setIdx] = useState(0)` lifted into a small inner `<HotelTile />` component to keep state isolated.
  - Show current image; if `images.length > 1`, render two overlay buttons (left/right chevrons from `lucide-react`) absolutely positioned, vertically centered, with `bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5`.
  - Clicking a chevron stops propagation and changes index (wraps around). The tile's main click still selects the hotel.
  - Add small dot indicators at the bottom when > 1 image.
- Clicking the image area (not the chevrons) opens the lightbox AND selects the hotel.

**Full-page lightbox**
- Use existing `Dialog` from `@/components/ui/dialog`. Configure `DialogContent` with `max-w-screen w-screen h-screen p-0 bg-black/95 border-0 rounded-none` and remove default close styling overrides where needed.
- Inside: large centered `<img>` (`max-h-[90vh] max-w-[95vw] object-contain`), close button top-right, prev/next chevron buttons (only when > 1 image), counter "x / N" bottom-center.
- Keyboard support: `ArrowLeft`, `ArrowRight`, `Escape` via a `useEffect` listener active while the dialog is open.
- Lightbox state lives in the parent step (`openGalleryHotelId`, `galleryIndex`) so any tile can open it.

### Test previews

Updates are confined to `step2-accommodation.tsx` and the type file, both of which are already used by `TestPreviews.tsx` indirectly (the wizard mounts the same step). No additional changes needed there — they automatically pick up the new behavior.

### Files touched

- `src/lib/webhook-types.ts` — add `images?: string[]` and `getHotelImages` helper.
- `src/components/wizard-steps/step2-accommodation.tsx` — filtering, paging, `HotelTile` subcomponent with carousel arrows, lightbox dialog.

### Open question

The backend currently sends a single `image` per hotel in our captured network response. Plan assumes the field for multiple photos is `images: string[]`. If the n8n webhook uses a different key (e.g. `gallery`, `photos`, `imageUrls`), tell me the exact name and I'll wire it through `getHotelImages`.
