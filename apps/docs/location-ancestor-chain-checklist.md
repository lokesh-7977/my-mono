# Generic location ancestor-chain lookup — review checklist for backend

**Status:** Proposal, pending backend review. Frontend is currently unblocked by a small per-record mock (see "Frontend workaround" below) so UI work isn't waiting on this.

**Audience:** Backend team, before wiring any feature's response to the `Location` hierarchy.

**Related:** [`nearby-places-dynamic-lookup-checklist.md`](./nearby-places-dynamic-lookup-checklist.md) — a separate feature (computing what's physically near a trek), but one of several consumers of the same capability this doc asks for.

---

## 0. Correction to an earlier framing

An earlier version of this doc (and an earlier ask to seed the `Location` table from a full India LGD dataset) assumed `Location` should be a complete, pre-populated administrative-boundary tree, and treated "every trek only links to a DISTRICT row, not a city" as a gap to close by re-pointing treks deeper.

**That's not the model.** `Location` is an admin-curated log, not a reference dataset: an admin adds a `Location` row only when they need one, and when they link a `MasterTrek`, `Package`, `NearbyPlace`, or (in future) an `Activity` to a location, they pick whatever row already exists at whatever depth makes sense to them — state, district, city, or anything else — not a depth decided by a schema rule. Bulk-preloading a full government dataset doesn't change this: an admin can still choose to link to the STATE row even if DISTRICT and city-level rows exist underneath it.

**Consequence for any feature built on this:** there is no fixed shape. A breadcrumb is `Home > Treks > {Trek}` for one trek, `Home > Treks > {State} > {Trek}` for another, and `Home > Treks > {State} > {District} > {City} > {Trek}` for a third — all equally valid, all permanent, not a temporary seeding gap waiting to be filled in. Every consumer (frontend and backend) has to render/handle whatever depth actually exists, every time — never assume N levels.

## 1. What already exists

- **The hierarchy is structurally real.** `Location` (`packages/database/prisma/schema.prisma`) is a proper self-referencing tree — every row has a `parentId` pointing at its parent, with `LocationType` values `COUNTRY`, `STATE`, `DISTRICT`, `SUBDISTRICT`, `URBAN_LOCAL_BODY` (no literal `CITY`/`TOWN` — that level is `URBAN_LOCAL_BODY`).
- **The ancestor walk is already written, once.** `apps/api/src/services/location.service.ts`'s `getLocationByIdService` walks `parentId` up to the root and returns a `breadcrumb: {id, name, type}[]` array — however deep that particular chain happens to go. It's exposed today only via the standalone `GET /location/{id}` ("get location by id with hierarchy").
- **Every record that references a place already has a `locationId`.** `MasterTrek`, `Package`, and `NearbyPlace` each point at exactly one `Location` row (whatever depth the admin chose when creating that record).

## 2. What's missing

This single walk is useful everywhere a `Location` is referenced, but today it's wired to nothing except its own standalone endpoint:

1. **No shared, reusable "resolve ancestor chain" step.** `getLocationByIdService`'s walk isn't exposed as something other services can call internally — it's an HTTP-route-shaped function, not a reusable one. Trek breadcrumbs, package breadcrumbs, nearby-places region labels, and future activity breadcrumbs would all need this exact same walk, and right now each would have to reinvent it or make a second network call per record.
2. **Trek and package reads don't use it.** `master-trek.repository.ts` and `package.service.ts` only ever fetch/return a trek or package's single `Location` row, usually reduced to `{id, name}` in the public response — never the chain above it.
3. **No response shape accounts for variable depth.** Nothing in the current types (`LocationHierarchyItem`, `PublicPackageNearbyPlace`, etc.) is shaped with "this array can be 0 to N items, consumer must not assume a fixed length" as an explicit contract — worth making that an explicit, documented guarantee rather than an implicit one, since every consumer depends on it.
4. **Bulk LGD import may be solving the wrong problem.** `packages/database/prisma/location-seed.ts` preloaded ~13,000 India LGD rows (COUNTRY→STATE→DISTRICT→SUBDISTRICT→URBAN_LOCAL_BODY) as a one-time seed. Given `Location` is meant to be admin-curated rather than a reference dataset, it's worth the backend team deciding whether that bulk import should stay as a convenience (so an admin linking a trek has real rows to pick from instead of typing a new one every time) or should be reconsidered — it's not itself wrong, but it shouldn't be read as "the hierarchy is fully populated, so every trek should link at the deepest available level."

## 3. The actual ask

One small, reusable capability, usable by any feature that has a `locationId`:

> Given a `locationId`, return its ancestor chain up to the root — however many levels that is (could be zero, could be five) — as something other backend services can call directly (a function/service method), not only as an HTTP round-trip.

Then, each consumer attaches it where it's actually needed:

- **Trek/package breadcrumbs** — `master-trek`/`package` services call it with their own `locationId` and attach the result (e.g. a `locationAncestors` field) to their existing response. See §4 on why this should ride along rather than be a separate per-record call.
- **Nearby places** — already has its own, larger set of open questions (geospatial radius, data source — see the linked doc), but whenever a `NearbyPlace`'s region needs labeling beyond its own `location.name`, it's the same walk, not a separate one.
- **Future: activities** — whatever shape an `Activity`'s location reference takes, it reuses the same lookup rather than a copy of it.

## 4. Where it should live

**Ride along on each feature's existing read endpoint** (e.g. `locationAncestors` added to the trek/package response), not a dedicated per-record endpoint the frontend calls separately. The trek page is server-rendered and fetches trek data in one shot, cached for 5 minutes (`revalidate = 300`) — a second round-trip per trek just for its breadcrumb would add latency with no caching benefit over embedding it in the response that's already being fetched and cached. `GET /location/{id}` should stay exactly as it is for its own standalone use (e.g. an admin location picker) — that's a different consumer with a different need (look up any location by id on demand), not the same thing as "this trek's/package's own chain."

## 5. Open questions for backend to decide

1. Extract `getLocationByIdService`'s walk into a plain function other services can call directly (e.g. `resolveLocationAncestors(locationId)`), so `master-trek`, `package`, and future `activity` services share one implementation instead of each reimplementing it?
2. Confirm: should every consumer treat the returned chain as variable-length with no minimum, including zero (a location with no parent, or no `locationId` set at all)?
3. Does the bulk LGD seed (§2.4) stay as-is, get trimmed, or get documented as "reference data an admin may optionally link to," so it's not mistaken for a target hierarchy every record is expected to reach?
4. Should the ancestor array include the record's own location as the last element, or stop at its parent (i.e., does the trek page need to be told "and here's your own district" again, or does it already have `location.name` separately)?

## 6. Frontend workaround

`apps/web/lib/trek-breadcrumb-mock.ts` adds one parent level (state) above whatever single district-level location name the real trek API already returns, for the handful of districts currently seeded — explicitly as a stand-in for the real per-record walk, not as a claim that every trek has (or should have) exactly two levels. A trek whose district isn't in that small map falls back to a one-level breadcrumb, which is the same "handle whatever depth exists" behavior this doc asks the real implementation to guarantee. `components/shared/breadcrumb.tsx` already takes an arbitrary-length `items` list, so no frontend rework is needed beyond passing in the real chain once it exists.
