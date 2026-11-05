# Packages for a master trek — list + filters, review checklist for backend

**Status:** Proposal, pending backend review. Frontend is currently unblocked by a hardcoded mock (see "Frontend workaround" below) so UI work isn't waiting on this.

**Audience:** Backend team, before adding any master-trek-scoped package listing.

**Related:** [`popular-treks-checklist.md`](./popular-treks-checklist.md) — this doc needs the same booking-count rollup that doc already proposes (§3–4 there), plus a rating rollup it flags as an open gap (§6 there). Don't build either rollup twice — one computation, used by both features.

---

## 1. Current situation

There is no API to fetch the packages that belong to a given `MasterTrek`. Checked every route on `PackageRoutes` (`apps/api/src/routes/package.route.ts`):

- `GET /package/search` — public search, but filters are generic (`search`, `difficulty`, `startDate`/`endDate`, `minPrice`/`maxPrice`, `minDuration`/`maxDuration`, `page`/`limit`). No `masterTrekId` param.
- `GET /package/location/{locationId}` — packages by **location**, a different axis entirely.
- `GET /package/public/{id}` — a single package by its own id.
- `GET /package/upcoming-departures` — a separate cross-trek "popular upcoming departures" feed (already covered by `featured-treks-checklist.md`), not scoped to one trek.

`masterTrekId` exists on `Package` (`packages/database/prisma/schema.prisma`) and is used internally (creation, a few repository lookups), but is never exposed as a public filter or list endpoint. This is the literal gap behind the trek detail page's "Featured Packages" carousel and its "View All" button, and the "Check All Options" button in `booking-cta.tsx` — both buttons exist in the UI today with **no destination**, because there's nothing to link to yet.

## 2. The two consumers, same data and filters

Two different UI entry points need the same underlying capability, scoped two different ways:

1. **Trek detail page carousel** ("Featured Packages") — `masterTrekId` fixed to the current trek, small `limit` (currently 8 in the mock), no user-facing filter controls, just a "View All" link out.
2. **A dedicated packages-for-a-trek search/listing page** — reached via "View All" (carousel) or "Check All Options" (booking CTA) from #1. Same `masterTrekId` scope, but with real pagination and the full filter set in §3, since a user has navigated here specifically to compare options.

**This should be one endpoint, not two.** The carousel is just that same endpoint called with a small `limit` and no filters applied — not a separate "preview" API. This mirrors how `featured-treks-checklist.md` reuses one `FeaturedPackages`-shaped component/endpoint for two placements (homepage grid, trek carousel) with only presentation differing.

## 3. Proposed API surface

```
GET /api/package/master-trek/{masterTrekId}
```

Query params, extending the existing `SearchPackagesQuerySchema` shape rather than inventing a new one (same filter vocabulary a user already sees on `/package/search`):

| Param | Source | Notes |
|---|---|---|
| `difficulty` | already exists | |
| `startDate` / `endDate` | already exists | filters by schedule availability |
| `minPrice` / `maxPrice` | already exists | reads from `PackageSchedule.price`/`adultPrice`, not `Package` itself — see §4 |
| `minDuration` / `maxDuration` | already exists | |
| `minRating` | **new** | needs the rating rollup in §4 |
| `sort` | **new** | e.g. `price_asc`, `price_desc`, `rating_desc`, `bookings_desc` (most booked), `newest` |
| `page` / `limit` | already exists | |

Response: same package-card shape the trek page's mock (`featuredPackagesList` in `apps/web/components/trek/trek-details/featured-packages.tsx`) already assumes — `id`, `slug`, `title`, `image`, `durationDays`, `distanceKm`, `maxAltitudeFt`, `rating`, `price`, `guideName`, `guideAvatarUrl` — plus whatever `/package/search` already returns for consistency, since both are now meant to share one card component eventually.

## 4. Two rollups this depends on — don't compute them twice

Both are **per-package** (or per-package summed up), not per-trek — the trek-level numbers in `popular-treks-checklist.md` are a further rollup *of these same numbers* up to `MasterTrek`. Compute once, reuse at both levels:

### 4a. Price — already partially solved

`PackageSchedule.price`/`adultPrice`/`childPrice` already exist; `package.service.ts` already has `getStartingPriceAndCurrency`/`getStartingPrice` helpers that reduce a package's schedules down to one displayable starting price. `minPrice`/`maxPrice` filtering against that same derived value is new work (today's `/search` filter may already do this — confirm it's reusable here, not reimplemented).

### 4b. Rating — not solved anywhere yet

`Review.rating` is keyed to `packageId` directly (not via a booking rollup to `MasterTrek` like bookings are) — so a per-package average rating is a direct `AVG(Review.rating) WHERE packageId = X` query, much simpler than the booking rollup. Still currently **zero rows** in `Review` (per `popular-treks-checklist.md` §2), so `minRating`/`sort=rating_desc` can't be validated against real data yet, and a package with zero reviews needs a defined behavior (excluded from `minRating` filtering entirely, or treated as unrated and always passing the filter — recommend the latter, so new packages aren't invisible just for lacking reviews yet, mirroring the cold-start concern already raised for popularity).

### 4c. Booking count — defer to `popular-treks-checklist.md`'s rollup

`sort=bookings_desc` needs the exact same `PackageBooking → PackageSchedule → Package` rollup that doc already designs (recommending the same precompute/cache approach, not a live aggregation per request) — just keyed at the `Package` level instead of summed further to `MasterTrek`. If that rollup is built with `packageId` as an intermediate field (as that doc's §2 already recommends denormalizing), a per-package count falls out before the trek-level sum does — build it once, use it in both places.

## 5. Open questions for backend to decide

1. Confirm the route shape in §3 — `/package/master-trek/{masterTrekId}` as a sibling to the existing `/package/location/{locationId}`, or folding this into `/package/search` with an added `masterTrekId` query param instead of a new path. Either is workable; pick whichever keeps `/search`'s filter logic from being duplicated.
2. `sort` values needed (§3) — confirm the list, and default sort order when none is specified (recommend `newest` or `bookings_desc`, not an arbitrary DB order).
3. Rating rollup (§4b) — confirm per-package `AVG(Review.rating)`, computed live (cheap — reviews are rare today) or cached like the booking rollup once review volume grows.
4. Zero-review and zero-booking behavior for `minRating`/`sort=bookings_desc` (§4b) — should a package with no signal yet be excluded, ranked last, or treated as neutral?
5. Does the trek-detail carousel (#1 in §2) get a dedicated `limit`-only call to the same endpoint, or does frontend need a distinct lightweight "preview" response (fewer fields) for performance? Recommend the same full response — these are small lists (single-digit to low-double-digit packages per trek), not worth a second response shape.

## 6. Frontend workaround

`apps/web/components/trek/trek-details/featured-packages.tsx` has a hardcoded `featuredPackagesList` array (8 entries, reused/duplicated trek data), rendered identically regardless of which `MasterTrek` page it's on — not scoped to the actual trek at all today. Its "View All" button and `booking-cta.tsx`'s "Check All Options" button currently have no `href` / destination. Once this endpoint exists: (a) swap the mock array for a real `getPackagesForTrek(masterTrekId)` call (SSR, same pattern as the trek fetch itself), and (b) both buttons need an actual target — presumably a new `/trek/{trekSlug}/packages` (or similar) listing route that calls the same endpoint with the full filter UI from §3. That listing page doesn't exist yet and isn't scoped here beyond needing to exist — it's a new route, not a new API concern.
