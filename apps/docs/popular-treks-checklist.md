# "Popular Treks" data — backend checklist

**Status:** Proposal, pending backend review. Frontend's "Popular Trek Options" carousel is already a self-contained hardcoded mock (see "Frontend workaround" below), so no new mock is needed — just a swap-out once this ships.

**Audience:** Backend team, before building a "most booked" ranking for anything.

---

## 1. Current situation

There is no "popular treks" endpoint, and `MasterTrek` has no popularity signal of any kind — no view count, no booking count, no manual flag. The `PopularPackages` component on the trek detail page is fully hardcoded mock data (trek cards with made-up ratings and prices), unrelated to any real backend query.

The one `isPopular` field that exists in the schema is on `TrekRoute` (marks one route within a single trek as its popular route) — unrelated to "which treks are popular site-wide."

## 2. The core modeling problem: `MasterTrek` isn't purchasable, `Package` is

This is the important constraint that shapes everything else: a trek's popularity isn't a property of `MasterTrek` directly — it has to be derived by rolling up activity on the things that *are* purchasable (`Package` → `PackageSchedule` → `PackageBooking`) back up to their parent trek.

The chain, per the current schema:

```
PackageBooking.scheduleId → PackageSchedule.packageId → Package.masterTrekId
```

Note `PackageBooking` has no direct `packageId` or `masterTrekId` — only `scheduleId`. Counting "bookings per trek" today requires a two-hop join (booking → schedule → package), not a single grouped query. Worth denormalizing `masterTrekId` (and probably `packageId`) directly onto `PackageBooking` at write time, purely to make this and future reporting queries cheap — this is a safe, additive change regardless of which approach below is chosen.

**Also relevant and currently empty:** `Package`, `PackageSchedule`, `PackageBooking`, `Payment`, and `Review` all have **zero rows** in the database right now — there's no real booking flow exercised yet. Whatever's built here can't be validated against real data until that exists; plan to validate with seeded/test bookings first.

## 3. Proposed criterion: qualifying booking count, rolling window

"Most booked packages, rolled up to the parent trek" — concretely:

> For each trek, count `PackageBooking` rows with a qualifying `status`, across all of that trek's packages (a trek can have multiple vendors each running their own `Package` for it — bookings across all of them should sum together), within a rolling lookback window.

Needs backend to decide:
- **Which `BookingStatus` values qualify.** Recommend `CONFIRMED` + `COMPLETED`; exclude `PENDING` (not yet paid/confirmed) and `CANCELLED`.
- **Rolling window vs. all-time.** Recommend a rolling window (e.g. last 90 days) — an all-time count means a trek that was popular two years ago stays "popular" forever even if nobody's booked it since, which defeats the purpose of a "popular now" section.
- **Minimum threshold.** Should a trek need e.g. ≥3 qualifying bookings before it's eligible to appear at all? Without a floor, one early booking on an obscure trek could make it look falsely popular before there's a meaningful sample.

## 4. Computation approach: precompute + cache, not real-time counters

Following the same reasoning as the weather-feature proposal (`apps/docs/weather-conditions-modal-checklist.md`) — recommending **precomputed, not a live aggregation per request, and not a real-time increment/decrement counter either.** Two realistic options:

### Option A (recommended): periodic recompute job

A scheduled job (cron, e.g. hourly or daily — freshness tradeoff is backend's call) runs an aggregation across `PackageBooking` → `PackageSchedule` → `Package`, grouped by `masterTrekId`, counting qualifying bookings within the lookback window, and writes the result onto `MasterTrek`:

```prisma
model MasterTrek {
  // ...
  popularityScore     Int?       // qualifying booking count in the lookback window; null = not yet computed
  popularityUpdatedAt DateTime?
}
```

- **Self-healing.** If a bug ever produces a wrong count, the next scheduled run just overwrites it with a correct one — no drift to debug, no manual reconciliation.
- **Trivially supports changing the window or qualifying statuses later** — it's just a different query, not a migration.
- A trek with `popularityScore: null` simply hasn't been computed yet (e.g. brand new) — see the cold-start question below for how that should be handled in sort order.

### Option B: real-time counter cache (not recommended)

Increment/decrement a `bookingsCount` field on `Package`/`MasterTrek` directly inside the booking status-transition logic (`PENDING→CONFIRMED` increments, `→CANCELLED` decrements, etc.). Faster reads, no cron — but every status-transition code path (including refunds, which touch `Payment` not `PackageBooking` directly) has to remember to adjust the counter correctly, and a single missed path produces a permanently wrong number with no self-correction. Also doesn't naturally support a rolling time window (an incremented counter is inherently all-time unless paired with time-bucketed counters, which is significantly more complexity for marginal benefit here). Not recommended unless there's a specific reason real-time freshness matters for this feature — it doesn't; "popular treks" updating every hour is more than adequate.

## 5. Open questions for backend to decide

1. **Qualifying statuses and lookback window** (see §3).
2. **Minimum booking threshold for eligibility** (see §3).
3. **Cold-start / fairness problem.** A pure "most booked" sort means brand-new treks with zero booking history can never appear, no matter how good they are — they'd need months of sales before showing up in their own "popular" section. Needs a product decision: a separate "New & Noteworthy" shelf, a manual admin-pin escape hatch for new treks, or accepting that "Popular" genuinely means "proven," and newly published treks surface elsewhere (homepage "newest," category pages, etc.) instead.
4. **Recompute cadence** — hourly vs. daily is a load/freshness tradeoff, not a correctness one.
5. **Multi-vendor summing confirmed.** Explicitly: if 3 different vendors each run their own `Package` against the same `MasterTrek`, their booking counts sum into one trek-level score. Flagging so it's a deliberate decision, not an assumption baked in silently.

## 6. A gap this surfaces, worth flagging separately: trek-level `rating`

The existing `TrekCard` component (already in the frontend, used for the "Popular Trek Options" carousel and elsewhere) has a `rating: number` prop with **no real data source anywhere in the schema.** `Review` exists, but it's keyed to `packageId`/`bookingId`, not `masterTrekId` — same rollup problem as popularity, and currently also zero rows. Not blocking for this feature (the mock already fakes a rating), but since "Popular Treks" is the first real feature that will actually try to render `TrekCard` with live data, this gap will surface immediately once popularity is wired up. Worth deciding alongside this, or explicitly deferring and hiding the rating in the UI until it has a real source — recommend not shipping a fabricated rating number for a real, booked trek.

## 7. API surface (once computed)

```
GET /api/master-trek/public/popular?limit=8
```

Returns treks sorted by `popularityScore` desc, with a documented fallback order for `null`/tied scores (e.g. `createdAt` desc) so the endpoint always returns `limit` results even before any trek has booking history.

## 8. Frontend workaround (no change needed right now)

`PopularPackages` is already a fully self-contained mock, independent of this doc — nothing new needs to be built on the frontend to stay unblocked. Once this endpoint exists, the swap is: replace the hardcoded `featuredTreksList` array with a real `getPopularTreks()` call. Note this one is **not** a click-triggered modal like Things to Carry/How to Reach/Weather — it's visible on initial page load, so it should be fetched server-side (SSR, same pattern as the main trek fetch) rather than lazily on click.
