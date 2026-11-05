# Location detail page — content & data structure, review checklist for backend

**Status:** Proposal, pending backend review. Frontend is currently unblocked by a full static mock (see "Frontend workaround" below) so UI work isn't waiting on this.

**Audience:** Backend team. `Location` today is a bare admin-curated hierarchy node (id, name, type, parent) — this doc covers what it's missing to support its own detail page, `/location/{slug}`.

**Build order:** this is doc 1 of 3 in [`./README.md`](./README.md) — do this one first; the other two depend on the fields it adds.

**Related:**
- [`location-ancestor-chain-checklist.md`](./location-ancestor-chain-checklist.md) — the breadcrumb/ancestor-walk capability. A location page needs this for its own breadcrumb, same as a trek page does.
- [`nearby-places-dynamic-lookup-checklist.md`](./nearby-places-dynamic-lookup-checklist.md) — "nearby places" is a dynamic lookup over other logged `Location` rows, not admin-curated content. This doc's §3 below is a direct dependency on that one.

---

## 1. What exists today vs. what the page needs

`Location` (`packages/database/prisma/schema.prisma`) currently carries only hierarchy and identity:

```prisma
model Location {
  id   String       @id @map("_id")
  name String
  type LocationType
  sourceCode    String
  localBodyType String?
  parentId String?
  // ...relations...
}
```

This is enough to be a link target (a `MasterTrek`/`Package` pointing at it — not `NearbyPlace`, which [`nearby-places-dynamic-lookup-checklist.md`](./nearby-places-dynamic-lookup-checklist.md) proposes deprecating in favor of looking up `Location` directly) and an ancestor-chain node. It is **not** enough to render its own page. The frontend mock (`apps/web/lib/location-mock.ts`) shows what the page actually needs per location:

```ts
interface LocationData {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  whatToKnow: string;       // long-form overview copy
  backdropTitle: string;
  backdrop: string;         // long-form history/context copy
  highlights: { title: string; description: string }[];
  generalInfo: { label: string; title: string; description: string }[];
  experiences: LocationExperience[]; // separately covered, see §4
}
```

None of `slug`, `tagline`, `heroImage`, `whatToKnow`, `backdropTitle`, `backdrop`, `highlights`, or `generalInfo` exist on `Location` today. Flagging this explicitly because **this gap is easy to miss**: `Location` already looks "done" from the ancestor-chain and nearby-places work (both of which only need `id`/`name`/`parentId`), so a backend dev picking up only those two docs could reasonably assume `Location` needs no further schema work. It does, for this page specifically.

## 2. Proposed schema additions

All content fields optional/nullable — most `Location` rows (e.g. a `DISTRICT` an admin logged only so a trek could link to it) will never get a detail page written for them, and the page needs a defined fallback behavior rather than treating a missing field as a bug (see §2a).

```prisma
model Location {
  // ...existing fields...

  slug String? @unique   // needed as soon as this location is linkable as its own page, not just an ancestor-chain label

  tagline      String?
  heroImageUrl String?
  overview     String?   // frontend's "whatToKnow"; long-form, likely markdown or rich text
  backdropTitle String?
  backdrop      String?  // long-form; same format question as overview

  highlights   LocationHighlight[]   // embedded/sub-document, not a separate top-level model — see §2b
  generalInfo  LocationGeneralInfo[] // same
}
```

- **`slug`** is the one field that isn't just "content" — without it, a `Location` can be an ancestor-chain breadcrumb entry or a nearby-place lookup result, but can't be linked to as its own page (the frontend route is `/location/{slug}`). This needs deciding regardless of how much of the rest of this doc ships, since both related docs' features (ancestor chain, nearby places) are expected to render clickable links to other `Location` pages.
- **`highlights`** and **`generalInfo`** are small repeated structures (title+description, or label+title+description) with no independent identity or behavior of their own — modeling them as embedded arrays on `Location` (Prisma's MongoDB embedded-document support) avoids the overhead of two more top-level collections and join-style queries for data that's always read as a whole alongside its parent `Location`, never independently.

### 2a. Fallback behavior for unwritten locations

Given most `Location` rows won't have page content, the page needs a documented degraded state rather than 404ing or rendering empty sections. The frontend mock already demonstrates this shape (`genericLocation()` in `location-mock.ts`): generic placeholder tagline/overview copy, one generic highlight, a short fixed `generalInfo` list, when the real fields are null. Whether that fallback text lives in the frontend (current mock approach) or the backend returns a documented "uncurated" flag/default is backend's call — but the contract needs to be explicit: **a `Location` with no content fields set is a valid, expected state, not an error.**

### 2b. Open question: rich text vs. plain string

`overview` and `backdrop` are multi-paragraph copy (the mock uses `\n\n` for paragraph breaks). Decide once, consistently: plain string with a documented paragraph-break convention (simplest, what the mock currently assumes), markdown, or a rich-text/block format. This affects every consumer that renders these fields, so it shouldn't be decided implicitly by whatever the first admin-authoring tool happens to produce.

## 3. "Popular treks" for a location: an applied case of nearby places, not separate curation

The location page needs a "treks you can do here / nearby" section. **This should not be its own curated link** (e.g. no `LocationFeaturedTrek` join table) — it's a derived view over the nearby-places lookup already proposed in [`nearby-places-dynamic-lookup-checklist.md`](./nearby-places-dynamic-lookup-checklist.md):

> Given a `Location`, find its nearby `Location`s (by the proximity method that doc settles on — hierarchy adjacency and/or geographic distance). Then, of that same `Location` plus its nearby set, return whichever ones have at least one `MasterTrek` linked to them (`MasterTrek.locationId` pointing at that `Location`).

Concretely, reusing that doc's own worked example: viewing the Darjeeling location page, the lookup already returns Kolkata and Siliguri as nearby logged locations. "Popular treks near Darjeeling" is the same result set, filtered down to whichever of {Darjeeling, Kolkata, Siliguri} actually have a `MasterTrek` pointing at them, then those treks returned (not just the location names). No admin ever manually says "feature this trek on this location page" — if a trek's `Location` is in the nearby set and has treks, it shows up; if an admin later adds a new trek linked to a location in that set, it appears automatically on next render, with no one having to remember to link it.

This means: **do not build this as a separate feature or schema addition.** It's a query shape (nearby locations → filter to ones with `MasterTrek`s → return those treks), implemented once the nearby-places lookup itself exists. Building a manual-curation version of this first would create exactly the stale-data problem §2 of the nearby-places doc already argues against, and would need to be torn out once the dynamic lookup ships anyway.

**Dependency ordering, explicit:** this section's backend work cannot start before the nearby-places dynamic lookup (linked doc) is designed, since it is literally that lookup plus one more filter — building it earlier would mean building the proximity query twice.

## 4. `experiences` — flagged, not scoped here

The mock's `experiences` array (short-duration bookable activities tied to a location, e.g. "River Clean Up Drive," distinct from multi-day treks) has no backend equivalent at all — no model resembling it exists in the schema. Not scoped in this doc since it looks like a different content type from everything else here (closer to `Package` than to `MasterTrek`), but flagging it so it isn't silently dropped: if "experiences" are meant to ship as part of the location page, they need their own design doc before backend starts, likely covering whether they're a new model or a specialization of `Package`.

## 5. Open questions for backend to decide

1. Confirm the schema shape in §2 (fields directly on `Location` vs. a separate one-to-one content model) — a separate `LocationContent` model is also reasonable if backend wants to keep `Location` itself lean and hierarchy-only, with content joined in only for the detail-page read.
2. `slug` generation and uniqueness — auto-derived from `name` (with collision handling, since multiple states can contain same-named districts) or admin-entered?
3. Rich text format for `overview`/`backdrop` (§2b).
4. Confirm the fallback-content contract in §2a: does the API return `null` for unset fields (frontend decides fallback copy), or does the backend itself return placeholder content for uncurated locations?
5. Confirm §3's dependency and approach: "popular treks" on a location page is the nearby-places lookup filtered to locations with `MasterTrek`s, built after that lookup exists — not separate curated content.
6. Whether `experiences` (§4) is in scope at all for the current milestone, and if so, who owns designing its data model.

## 6. Frontend workaround

`apps/web/lib/location-mock.ts` is a full static mock: one fully-written location (Himachal Pradesh) plus a `genericLocation()` placeholder generator reused for every other location currently linked from breadcrumbs or the homepage. This is a stand-in for the entire feature in this doc, not a demonstration of per-location admin curation — every `genericLocation()` call produces near-identical copy with the location's name substituted in. `apps/web/app/(main-app)/location/[locationSlug]/page.tsx` and its section components (`LocationHero`, `LocationOverview`, `LocationBackdrop`, `LocationHighlights`, `LocationGeneralInfoSection`) already consume this shape directly, so once a real endpoint exists, the swap is replacing `getLocationBySlug()` with a real fetch — no component rework needed as long as the response shape matches (or the fetch layer adapts it to match) `LocationData`.
