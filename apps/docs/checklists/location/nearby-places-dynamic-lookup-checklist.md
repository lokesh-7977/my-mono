# "Nearby Places" — dynamic location-proximity lookup, review checklist for backend

**Status:** Proposal, pending backend review. Frontend is currently unblocked by a small mock (see "Frontend workaround" below) so UI work isn't waiting on this.

**Audience:** Backend team, before building out `NearbyPlace` / `TrekNearbyPlace` admin tooling further — this doc argues that tooling may be the wrong direction entirely (see §1).

**Build order:** this is doc 3 of 3 in [`./README.md`](./README.md) — depends on [`location-page-checklist.md`](./location-page-checklist.md) adding real content (and coordinates, for the geographic-distance option) to `Location` rows first. Independent of doc 2's ancestor walk.

**Related:** [`location-ancestor-chain-checklist.md`](./location-ancestor-chain-checklist.md) — a different lookup direction (a location's ancestors, for breadcrumbs), but the same underlying entity (`Location`) and the same "admin-curated, not a fixed reference dataset" model this doc leans on.

---

## 1. Correction to the original model

Earlier versions of this doc treated "nearby places" as its own curated content type (`NearbyPlace`: name, description, image, rating — manually linked to a trek via `TrekNearbyPlace`) and framed the problem as "how do we compute distance/auto-populate this content type." That's the wrong shape for what was actually asked.

**What "nearby places" actually means here:** a *place* is just another `Location` an admin has already logged — nothing more. When an admin logs West Bengal, then Darjeeling, then Kolkata, then Siliguri as `Location` rows, those logged locations become the pool "nearby places" draws from. There's no separate place entity to curate — the `Location` table an admin is already building for an entirely different reason (so other records can link to a place) **is** the source of "nearby places" content.

**Worked example (from the original ask):** an admin creates `MasterTrek` "Sandakphu Trek" and links it to the `Location` "Darjeeling" (their choice — could have picked West Bengal or a city instead, per [`location-ancestor-chain-checklist.md`](./location-ancestor-chain-checklist.md)). Separately, the admin has logged "Kolkata" and "Siliguri" as their own `Location` rows (for their own unrelated treks/packages). The Sandakphu trek page's "Nearby Places to Visit" section should show Kolkata and Siliguri — **not** because anyone manually linked Sandakphu to them, but because they're `Location` rows that are *near* Darjeeling, looked up dynamically every time the page renders.

**This is also not trek-only.** The same lookup — "what other logged `Location`s are near this one?" — applies anywhere a `Location` is in view, including the location page itself ([`apps/web/app/(main-app)/location/[locationSlug]/page.tsx`](../../apps/web/app/(main-app)/location/%5BlocationSlug%5D/page.tsx)): viewing the Himachal Pradesh location page should show other nearby logged locations, computed the same way, not a hand-picked list specific to that one page either.

## 2. Why hand-curating per-trek (or per-location) links doesn't work

1. **It doesn't scale.** With potentially 13,000+ `Location` rows (per the LGD-derived data already in the table) and every trek, package, and location page needing its own "nearby" list, hand-linking is not something a person can do, or keep accurate, at that scale.
2. **It goes stale the moment the data changes.** Add a new `Location` near an existing trek, and it won't show up in that trek's nearby list until someone remembers to go back and link it. Delete or merge a `Location`, and every hand-made link to it becomes an orphaned reference someone has to find and clean up. A dynamic lookup has neither problem — a new location appears instantly everywhere it's geographically relevant, and a deleted one disappears everywhere, with no manual bookkeeping.
3. **`NearbyPlace`/`TrekNearbyPlace` duplicate data that already lives in `Location`.** A `NearbyPlace` row's `name` and `locationId` largely re-describe a `Location` that may already exist — maintaining both is redundant work, and the two can drift out of sync (e.g. a `NearbyPlace` named "Manali" existing independently of whatever `Location` row actually represents Manali).

## 3. What a dynamic lookup actually requires

### 3a. A real proximity query

Given a `Location`, find other `Location` rows "near" it. Two ways to define "near," and they're not mutually exclusive:

- **Geographic distance** — needs `Location` to carry `latitude`/`longitude` (it doesn't today — only `MasterTrek` and `NearbyPlace` have coordinates currently; `Location` itself has none). With that, a radius or k-nearest query (haversine in application code, or a proper MongoDB `2dsphere` index) returns the closest N locations regardless of administrative hierarchy.
- **Hierarchy adjacency** — "near" via the tree instead of the map: siblings under the same parent (other districts in the same state), or descendants of a sibling, using the `parent`/`children` relation that already exists on `Location`. Needs no new data, but is coarser — administratively close isn't always geographically close, and vice versa (e.g. a district on a state border may be geographically closer to a neighboring state's district than to its own state's capital).
- Likely both have a role: hierarchy adjacency as an always-available fallback, geographic distance as the more precise option once `Location` coordinates exist.

### 3b. What a "place card" needs to render

Today's UI mock shows a name, an image, a rating, and a region label per place. Against real `Location` data:

- **Name** — `Location.name`, already there.
- **Link target** — `/location/{slug}` (this app's own location page), not an external reference. This means a "nearby place" card is really just a link to another `Location`'s own page, with that page holding the full description. Worth confirming `Location` gets a `slug` field (it doesn't currently — only `name`/`id`) if nearby-place cards are meant to be clickable.
- **Image** — `Location` has no image field today. Needs either a new optional field on `Location` (e.g. `coverImageUrl`) populated as admins log locations, or a fallback (no image, or borrow one from a trek/package associated with that location) when unset.
- **Rating** — no backend equivalent, and no real source for one (user reviews? Not of a `Location` itself). Worth deciding whether this ships at all; it may simply not apply to a `Location`-backed nearby place.

## 4. Open questions for backend to decide

1. Confirm the reframing in §1: should "nearby places" be powered by querying `Location` directly (by proximity), rather than via `NearbyPlace`/`TrekNearbyPlace`? If so, are the existing `NearbyPlace`/`TrekNearbyPlace` models deprecated, or kept for some other purpose?
2. Hierarchy adjacency, geographic distance, or both (§3a)? If geographic, does `Location` need `latitude`/`longitude` added?
3. Does `Location` need a `slug` and an optional cover image field, so a nearby-place card can link and render without borrowing data from an unrelated trek/package?
4. Where does this lookup live — a method any feature can call with a `locationId` (trek pages, package pages, the location page itself, future activity pages), analogous to the ancestor-walk in the linked doc, or a dedicated endpoint?
5. Result count / radius expectations — the frontend currently shows up to 8 per section in a carousel.
6. Does `rating` ship at all, given there's no real source for one against a `Location`?

## 5. Frontend workaround

`apps/web/lib/nearby-places-mock.ts` has a static list of real place names shown identically on every trek (and now also the location page), as a stand-in for the dynamic lookup above — not a demonstration of per-trek curation. The `NearbyPlaces` component is already shared between the trek page and the location page, so swapping the mock for a real per-location dynamic result needs no further frontend rework beyond passing in the real data.
