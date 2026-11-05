# "Featured Treks" data — backend checklist

**Status:** Proposal, pending backend review. Frontend already has a working mock (`apps/web/lib/featured-treks-mock.ts`) consumed by two components — see "Frontend workaround" below — so no new mock is needed, just a swap-out once this ships.

**Audience:** Backend team, before adding any curation flag to `MasterTrek`.

---

## 1. Current situation

There is no "featured treks" endpoint, and no featured/curation flag anywhere on `MasterTrek`. Two frontend components currently render the same hardcoded mock array (`MOCK_FEATURED_TREKS`):

- `components/home/featured-treks.tsx` — homepage section, grid layout, header "Featured Treks" / "Handpicked Treks for the Ultimate Experience".
- `components/trek/trek-details/featured-treks.tsx` — trek detail page section, carousel layout, same copy, rendered near the bottom of the page.

Both are **the same data, same ranking, different presentation (grid vs. carousel) and placement**. This is a distinct concept from `apps/docs/popular-treks-checklist.md`, which proposes a *computed* "most booked" ranking — "featured" here is a manual, admin-curated flag, independent of booking volume. A trek could be featured on day one with zero bookings; a heavily-booked trek might not be featured if it's not the kind of trek marketing wants to showcase.

## 2. Proposed data model: manual flag, not a computed score

Because this is curation (an admin decision), not an aggregation, the simplest correct model is a boolean (or small ranked list) directly on `MasterTrek`:

```prisma
model MasterTrek {
  // ...
  isFeatured        Boolean   @default(false)
  featuredRank      Int?      // optional: explicit ordering among featured treks; null = unranked
  featuredUpdatedAt DateTime?
}
```

- `isFeatured` — toggled by an admin through whatever admin UI/endpoint already manages `MasterTrek` fields (no new write path needed if admin trek-edit already exists).
- `featuredRank` — optional. Without it, ties fall back to a documented order (e.g. `featuredUpdatedAt` desc, then `createdAt` desc). Needed only if the homepage grid and the trek-detail carousel must show treks in a specific, curated order rather than "whatever's featured, newest first."

This needs no cron, no rollup, no booking data — it's a direct field read, which also makes it trivial to query (`WHERE isFeatured = true`).

## 3. API surface

```
GET /api/master-trek/public/featured?limit=8
```

Returns treks where `isFeatured = true`, ordered by `featuredRank` (nulls last) then `featuredUpdatedAt` desc, then `createdAt` desc, capped at `limit`. Same endpoint serves both consumers — the homepage grid and the trek-detail carousel just request the same data and lay it out differently; `limit` lets each caller ask for as many cards as its layout needs (e.g. 4 on the grid's first row vs. 8 for the carousel).

Response shape should match what `TrekCard` already needs (see `apps/web/lib/featured-treks-mock.ts` for the exact current shape): `id`, `slug`, `title`, `image`, `location`, `durationDays`, `distanceKm`, `maxAltitudeFt`, `rating`, `price`, `oldPrice?`. Note `rating` and `oldPrice` have the same "no real source yet" gap flagged in §6 of `popular-treks-checklist.md` — not blocking here, but will surface the same way once this endpoint serves real treks.

## 4. Open questions for backend to decide

1. **Does `featuredRank` matter**, or is "featured, newest-first" an acceptable order? Affects whether the admin UI needs a reorder control or just a toggle.
2. **Minimum/maximum featured count** — should there be a cap enforced server-side (e.g. admin can't feature more than N treks at once), or is that left to editorial discipline?
3. **Fallback when fewer than `limit` treks are featured.** Should the endpoint pad with non-featured treks (e.g. newest) to always fill the section, or is it acceptable for the section to render fewer cards (or be hidden) when curation hasn't caught up yet? Frontend currently always has exactly 8 mock entries, so this hasn't been exercised.
4. **Same flag for both placements, confirmed.** Explicitly: homepage and trek-detail-page "Featured Treks" are intended to be the exact same curated set (just different layouts), not two independently curated lists. Flagging so it's a deliberate decision, not an assumption baked in silently — if backend wants separate curation per placement, that's two flags (or one flag + a `placement` enum), not one.

## 5. Frontend workaround (no change needed right now)

Both components already consume the shared mock `MOCK_FEATURED_TREKS` from `apps/web/lib/featured-treks-mock.ts`, which is already marked `// TEMPORARY: replace with an API response once featured treks exist in the backend.` — nothing new needs to be built on the frontend to stay unblocked. Once this endpoint exists, the swap is: replace the import in both `components/home/featured-treks.tsx` and `components/trek/trek-details/featured-treks.tsx` with a real `getFeaturedTreks()` call (SSR, same pattern as the main trek/location fetches — this is visible on initial page load, not click-triggered).
