# Packages for a master trek — list + filters, review checklist for backend

**Status:** Proposal, pending backend review. Frontend is currently unblocked by a hardcoded mock (see "Frontend workaround" below) so UI work isn't waiting on this.

**Audience:** Backend team, before adding any master-trek-scoped package listing.

**Related:** [`popular-treks-checklist.md`](./popular-treks-checklist.md) — this doc needs the same booking-count rollup that doc already proposes (§3–4 there), plus a rating rollup it flags as an open gap (§6 there). Don't build either rollup twice — one computation, used by both features.

---

## 1. Current situation

There is no **dedicated** API to fetch the packages that belong to a given `MasterTrek`, although the public master trek response already embeds them (see §1a). Checked every route on `PackageRoutes` (`apps/api/src/routes/package.route.ts`):

- `GET /package/search` — public search, but filters are generic (`search`, `difficulty`, `startDate`/`endDate`, `minPrice`/`maxPrice`, `minDuration`/`maxDuration`, `page`/`limit`). No `masterTrekId` param.
- `GET /package/location/{locationId}` — packages by **location**, a different axis entirely.
- `GET /package/public/{id}` — a single package by its own id.
- `GET /package/upcoming-departures` — a separate cross-trek "popular upcoming departures" feed (already covered by `featured-treks-checklist.md`), not scoped to one trek.

`masterTrekId` exists on `Package` (`packages/database/prisma/schema.prisma`) and is used internally (creation, a few repository lookups), but is never exposed as a public filter or list endpoint. This is the literal gap behind the trek detail page's "Featured Packages" carousel and its "View All" button, and the "Check All Options" button in `booking-cta.tsx` — both buttons exist in the UI today with **no destination**, because there's nothing to link to yet.

## 1a. What the master trek response already sends

`GET /master-trek/public/slug/{slug}` returns a `packages[]` array: every `PUBLISHED` and `PUBLIC` package for the trek, each with its `OPEN` future schedules (`master-trek.repository.ts`). It is a raw database include, and it exists mainly so the backend can work out the trek's `startingPrice`. Compared with what a package card needs:

| Gap | Detail |
|---|---|
| **Unbounded and unordered** | No limit, no sort. A trek with many vendors returns all of them, each with a full gallery list, description, inclusions and schedules. |
| **No guide** | Only `createdByUserId`; no guide name or avatar. |
| **No rating** | No per-package average rating and no review count. |
| **No per-package starting price** | The client has to work it out from the schedules. |
| **Internal fields leak** | `createdByUserId`, `teamId`, `status`, schedule `cancellationReason` and `cancelledAt`, and more, because nothing shapes the rows. |
| **Packages with no open departure are included** | Their `schedules` array is empty, so there is no price to show. |

The frontend now uses this array for the carousel (see §6), which is a stopgap rather than a contract.

## 1b. Embed in the trek response, or a separate endpoint?

**Recommendation: a separate endpoint**, `GET /package/master-trek/{masterTrekId}` as in §3, and keep only `startingPrice` (and optionally a `packageCount`) on the trek response.

- **Size.** The trek response is fetched on every trek page render. Embedding unbounded package rows makes it grow with every vendor that runs the trek.
- **A clean shape.** A dedicated endpoint returns a shaped card payload (guide, rating, starting price) instead of raw rows with internal fields.
- **Different freshness.** Seats and departures change much more often than trek content. A separate call can be cached for a different time, or streamed in after the main content.
- **One query for every consumer.** The "View All" and "Check All Options" listing page needs filters, sorting and pagination anyway. The carousel is the same endpoint with a small `limit`, so there is one package list API instead of two.
- **Where curation lives.** Which packages the trek page gets is a query concern (default sort and limit, see §5), and belongs in that endpoint.

The cost is one extra request. The trek page is a server component, so it can fetch the trek and the packages in parallel, and the page is not slower.

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

### 4b. Rating — partly solved

The package search and location endpoints already compute a per-package average on read (one decimal, `null` when there are no reviews; `searchPublicPackagesService` in `package.service.ts`), but the package detail response does not return it, no review count is returned anywhere, and it can't be used to filter or sort yet.

`Review.rating` is keyed to `packageId` directly (not via a booking rollup to `MasterTrek` like bookings are) — so a per-package average rating is a direct `AVG(Review.rating) WHERE packageId = X` query, much simpler than the booking rollup. Still currently **zero rows** in `Review` (per `popular-treks-checklist.md` §2), so `minRating`/`sort=rating_desc` can't be validated against real data yet, and a package with zero reviews needs a defined behavior (excluded from `minRating` filtering entirely, or treated as unrated and always passing the filter — recommend the latter, so new packages aren't invisible just for lacking reviews yet, mirroring the cold-start concern already raised for popularity).

### 4c. Booking count — defer to `popular-treks-checklist.md`'s rollup

`sort=bookings_desc` needs the exact same `PackageBooking → PackageSchedule → Package` rollup that doc already designs (recommending the same precompute/cache approach, not a live aggregation per request) — just keyed at the `Package` level instead of summed further to `MasterTrek`. If that rollup is built with `packageId` as an intermediate field (as that doc's §2 already recommends denormalizing), a per-package count falls out before the trek-level sum does — build it once, use it in both places.

## 5. Open questions for backend to decide

1. **What makes a package "featured" on the trek page?** The card data looks the same however packages are chosen; the open decision is *which* packages the backend sends. Options: all open packages sorted by one rule and capped at N; an admin-curated flag on `Package` (like the trek-level flag in `featured-treks-checklist.md`); one package per vendor; only packages with open seats and a future departure. Pick a sort too (soonest departure, lowest price, rating, most booked). This sets the endpoint's default `sort` and `limit`, and whether `Package` needs a featured flag at all.
2. Confirm the route shape in §3 — `/package/master-trek/{masterTrekId}` as a sibling to the existing `/package/location/{locationId}`, or folding this into `/package/search` with an added `masterTrekId` query param instead of a new path. Either is workable; pick whichever keeps `/search`'s filter logic from being duplicated.
3. `sort` values needed (§3) — confirm the list, and default sort order when none is specified (recommend `newest` or `bookings_desc`, not an arbitrary DB order).
4. Rating rollup (§4b) — confirm per-package `AVG(Review.rating)`, computed live (cheap — reviews are rare today) or cached like the booking rollup once review volume grows.
5. Zero-review and zero-booking behavior for `minRating`/`sort=bookings_desc` (§4b) — should a package with no signal yet be excluded, ranked last, or treated as neutral?
6. Does the trek-detail carousel (#1 in §2) get a dedicated `limit`-only call to the same endpoint, or does frontend need a distinct lightweight "preview" response (fewer fields) for performance? Recommend the same full response — these are small lists (single-digit to low-double-digit packages per trek), not worth a second response shape.

## 6. Frontend workaround

The trek page carousel now uses the `packages[]` array embedded in the trek response, through `getTrekPackageCards` in `apps/web/lib/trek-package-cards.ts`. Each card shows the package title, first gallery image, duration, distance, the trek's altitude, the lowest open-schedule price, and links to `/trek/{trekSlug}/{packageId}`. The API sends no guide and no rating. **The rating is left off the cards.** The guide comes from a **mock vendor lookup** (`apps/web/lib/package-vendor-mock.ts`) that maps the package's `createdByUserId` to a name and avatar for the four seeded demo vendors. A package from any other vendor shows no guide. The lookup is only a stand-in: `getTrekPackageCards` already prefers a real `trekLeader` on each package, so once the backend sends one (in the trek response or the dedicated endpoint), delete the mock file and nothing else changes. Packages with no open departure are skipped, the order the API sends is kept, and the whole section is hidden when a trek has no packages. The mock list is gone from the trek page.

The homepage "Popular Upcoming Departures" carousel still uses mock data, since that is a different cross-trek endpoint (`GET /package/upcoming-departures`).

The "View All" button and `booking-cta.tsx`'s "Check All Options" button still have no destination. Once the endpoint in §3 exists: swap `getTrekPackageCards(trek)` for a call to it (server-side, in parallel with the trek fetch), and give both buttons a target, presumably a new `/trek/{trekSlug}/packages` listing route that calls the same endpoint with the filter UI from §3. That listing page does not exist yet and is not scoped here beyond needing to exist.
