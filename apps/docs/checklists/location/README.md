# `Location` feature docs — read in this order

These three checklists all build on the same entity (`Location` in `packages/database/prisma/schema.prisma`) and are written to be read **in sequence**, not independently — each one assumes the previous is done. Don't start building #2 or #3 against a `Location` table that hasn't had #1's fields added; the ancestor-walk and nearby-places queries both read fields #1 proposes, and neither is useful without real content to walk or look up.

## 1. [`location-page-checklist.md`](./location-page-checklist.md) — do this first

Adds what's missing on `Location` itself: `slug`, coordinates (needed by doc #3's geographic-distance option), and content fields (`tagline`, `overview`, `backdrop`, `highlights`, `generalInfo`). This is the admin-curation step — someone logs a `Location` row and fills in its content. Every `MasterTrek`/`Package` that links to a location, and every feature below, depends on this pool existing first.

## 2. [`location-ancestor-chain-checklist.md`](./location-ancestor-chain-checklist.md) — build once #1's rows exist

A read-only walk up the `parentId` chain already logged in #1, exposed as a reusable function so trek/package breadcrumbs (and the location page's own breadcrumb) can call it. No new content, no admin action — purely a query over the hierarchy #1 populates.

## 3. [`nearby-places-dynamic-lookup-checklist.md`](./nearby-places-dynamic-lookup-checklist.md) — build once #1's rows exist, independent of #2

A read-only proximity query over the same `Location` pool #1 populates (by hierarchy adjacency and/or the coordinates #1 adds). Doesn't depend on #2's ancestor walk, but depends on #1 the same way #2 does: there's nothing to look up "near" until locations have been logged with real data (and coordinates, if the geographic-distance option is used).

`location-page-checklist.md` §3 ("popular treks for a location") is an applied case of #3, not a fourth document — don't build it before #3 ships.

## Why this order matters

All three were previously written and reviewed as if they were independent concerns, which let #2 and #3 get ahead of #1 in review even though neither can actually be implemented first — there's no hierarchy to walk and no pool to search until `Location` rows carry real data. Flagging the order explicitly here so a backend dev picking one of these up at random doesn't start mid-chain.
