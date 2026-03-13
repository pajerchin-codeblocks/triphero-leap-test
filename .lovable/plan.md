

# Make Summary Sidebar Compact — Price Always Visible

## Problem
When hotel + meals are selected on step 2, the summary card grows too tall and the estimated price (the most important info) gets pushed below the fold.

## Changes (`src/components/configurator-wizard.tsx`)

### 1. Compact layout — inline key-value rows
Replace the current vertical label+value blocks with a compact horizontal layout:
- Each summary item becomes a single row: `flex justify-between` with label on left, value on right
- Remove separate `<p>` for label and value — use one row per item
- Reduce `space-y-4` to `space-y-2`
- Use `text-xs` for labels, `text-sm font-medium` for values

### 2. Pin estimated price at the bottom
- Move the price section **outside** the scrollable content area
- Use a sticky/pinned bottom section within the card with `border-t` separator
- Price always visible regardless of how many items are in the summary

### 3. Reduce padding
- Change `px-6 py-6` to `px-4 py-4` on CardContent
- Reduce header from `text-lg` to `text-base`

### Result
Summary fits on one screen even with all fields filled. Price is always the last visible element, pinned at the bottom of the card.

