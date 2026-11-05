# Package ascent / descent stats — backend checklist

**Status:** Proposal, pending backend review. No frontend mock exists for this yet; the stat cards are designed (see §1) but not built, because the data doesn't exist at package level today.

**Audience:** Backend team, before touching `Package`, `TrekRoute` or the public package-detail response.

**Scope:** the **package detail page only**. The master trek page is not part of this ask.

**Related:** [`../master-trek/trek-packages-listing-checklist.md`](../master-trek/trek-packages-listing-checklist.md) — another change to what the public package responses expose.

---

## 1. What the UI needs

An **Ascent** card and a **Descent** card in the package page's stats row, next to Altitude and Grade:

```
ASCENT                     DESCENT
9 km / 3 - 4 hours         8 km / 2 - 3 hours
```

Each card needs a distance and a time range, and the two distances differ (9 km up, 8 km down in the design).

## 2. The model this doc assumes: template, then vendor-owned copy

- **`MasterTrek`** is an informational log book for a trek.
- **`TrekRoute`** is purely informational too. A trek can be reached in several distinct ways (say three), and each route is stored as a **template**.
- A vendor creating a **`Package`** uses a route as a starting point: take it as is, or pick one and add variation (an extra stop, a tea break, a different day split, activities). So a package's itinerary is always a stock route or a variation of one, in the vendor's own style.

The code already works this way:
- At creation, `Package` copies `title`, `description`, `difficulty`, `durationDays`, `distanceKm` and location from the master trek, and the vendor can edit them afterwards (`updatePackageBasics`).
- When the vendor builds the itinerary, they send their own `days` plus a `routeId`. The days are saved as the package's own `PackageItineraryDay` rows, which are individually editable (add, update and delete day endpoints exist). `Package.routeId` records which template was used; it is provenance, not a live source of data.

**Consequence:** a package's ascent and descent must belong to the **package**, not be read from its route. If the page read them from the route, a vendor's variation would still show the template's numbers.

## 3. Current situation and gaps

1. **No ascent or descent exists at package level.** `Package` has `distanceKm` but nothing for ascent or descent. `PackageItineraryDay` has `distanceKm`, `duration` (one text value), `altitude` and start/end location, with no ascent or descent either.
2. **The template side has partial fields.** `TrekRoute` has `ascentTime` and `descentTime` (free text, whole route) and one total `distanceKm`, but no separate ascent and descent distances. Its values are empty in the data today (Kedarkantha's only route has all of them null), and the CSV used for seeding carries none.
3. **The public package response exposes none of this**, and has no route data either (`findPublicPackageDetail` in `apps/api/src/repositories/package.repository.ts`).
4. **Units:** `elevationGain` (route) and `altitude` (day) have no documented unit.

## 4. Proposed changes

### 4.1 Package stores its own stats

```prisma
model Package {
  // ...existing fields...
  ascentDistanceKm  Float?
  ascentTime        String?   // e.g. "3 - 4 hours"
  descentDistanceKm Float?
  descentTime       String?
}
```

All nullable. A package without these values is valid, and the page simply omits the cards.

### 4.2 Prefill from the template, then let the vendor edit

- Add the same four fields to `TrekRoute` (`ascentDistanceKm`, `descentDistanceKm`, plus the existing `ascentTime` / `descentTime`) so a route can offer sensible defaults.
- When the vendor picks a route and creates the itinerary (the step that already copies the days and sets `routeId`), prefill the package's four fields from that route.
- Let the vendor edit them, in the package basics or itinerary step, since their variation may change the numbers. Add them to the package update schema.

### 4.3 Expose them on the public package detail

Add the four fields directly to `PublicPackageDetail`. There is no need to return a `route` object for this.

### 4.4 Alternative: derive instead of store

Give each itinerary day ascent and descent fields and sum them for the package. It keeps the numbers consistent with the day-by-day itinerary but is a bigger change, needs vendors to fill in every day, and runs into the granularity question below. Storing at package level (§4.1) is the smaller step.

## 5. Open questions for backend and product

1. **What do the cards mean on a multi-day trek?** Total ascent across all days, or the summit day? The design's numbers look like a one-day trek.
2. **Stored or derived?** Vendor-entered package values (§4.1), or computed from per-day fields (§4.4)? If stored, should they update when the vendor edits itinerary days, or stay manual?
3. Keep the times as free text (matches the design, can't be sorted) or structure them?
4. Where does the vendor edit them: the package basics step or the itinerary step?
5. Unit for `elevationGain` and day `altitude`: metres or feet?
6. Should the route template data be filled in for the real treks (a convenience for vendors), and who owns that? It is no longer a blocker for the page, but without it vendors start from empty fields.

## 6. Frontend workaround

None yet. The package page shows Duration, Distance, Altitude and Grade and omits Ascent and Descent rather than showing placeholder values. Once §4.3 ships, the cards can be built from the four fields with no further backend work. The seed script can set the values directly on the demo packages so the cards can be checked.
