# `howToReach` data structure — review checklist for backend

**Status:** Proposal, pending backend review. Frontend is currently unblocked by a temporary mock data file (see "Frontend workaround" below) so UI work isn't waiting on this.

**Audience:** Backend team, before touching `MasterTrek.howToReach` or any admin CRUD for it.

---

## 1. Current situation

`MasterTrek.howToReach` is a single nullable string:

```prisma
model MasterTrek {
  // ...
  howToReach String?
}
```

The 6 treks currently seeded in the database have this field populated with ad-hoc text that I (the agent backfilling legacy data) formatted like this:

```
By Train: Dehradun Railway Station (DDN) is well-connected to major cities across India. Popular trains include...

By Bus: Dehradun is well-connected by road, with several state-run and private buses operating from major cities...

By Flight: Jolly Grant Airport (DED) is located about 30 kilometers from Dehradun city center...
```

**This `"By {Mode}: {description}"` + double-newline format is not an API contract.** It's a convention I invented when writing a one-off seed script (`packages/database/add-how-to-reach.ts`) to shove the legacy app's structured CSV data (`how_to_reach` column — already an array of `{term, desc}` objects) into the one flat string field the schema provides. Nothing enforces this format, nothing validates it, and the schema has no idea it exists.

## 2. Why this is a problem for the frontend

1. **No structural guarantee.** The frontend has no contract that a `howToReach` string is even organized by transport mode, let alone that it uses `"By {Mode}: "` as a separator. A future edit to this field (manual DB edit, a different seed script, an admin form that's just a `<textarea>`) could easily produce text with no structure at all, or a different format, and nothing would catch it.
2. **Rendering requires parsing free text, or doesn't happen.** The intended UI (see §4) renders each transport mode as its own paragraph with a bold label — "**By Train:** ...". To do that from today's field, the frontend would have to regex-split on `"By (Train|Bus|Flight):"` or similar, which breaks the moment a trek's mode is named anything else ("By Shared Jeep", "By Helicopter", "By Road" vs "By Bus") or an admin types `"Train —"` instead of `"By Train:"`.
3. **No room for admin editing per item.** If/when there's an admin UI for this, editing "just the Train paragraph" or reordering modes, or adding a 4th mode, is impossible against a single opaque string — the only possible UI is one giant textarea for the whole field.
4. **Inconsistent with how the rest of this schema models "multiple structured things per trek."** `TrekItineraryDay` (itinerary), `MasterTrekFaq` (FAQs), and `NearbyPlace`/`TrekNearbyPlace` are all modeled as proper structured records, not flattened strings. `howToReach` is the odd one out — it's shaped like a raw CMS export because it literally was one (pulled directly from the legacy app's CSV and then flattened by my seed script, instead of being given its own structure like itinerary/FAQs got).

## 3. Proposed structure

Two realistic options — **recommending Option A.**

### Option A (recommended): MongoDB composite type, embedded array

```prisma
type TransportOption {
  mode        String   // e.g. "By Train", "By Bus", "By Flight" — free text, not an enum (trek-specific modes vary: "By Shared Jeep", "By Helicopter", etc.)
  description String
}

model MasterTrek {
  // ...
  howToReach TransportOption[]   // replaces howToReach: String?
}
```

- Array order **is** display order — no separate `order` field needed (unlike `MasterTrekFaq`, which needs one because a Mongo "has many via relation" has no inherent order).
- No separate collection, no relation, no cascade-delete to manage. A transport option has zero independent identity — it's never queried, filtered, or paginated outside the context of its parent trek — so embedding is the natural fit on MongoDB rather than a relational-style separate model.
- **Tradeoff:** composite types don't get an auto-generated `id` the way `@id`-annotated models do. If admin CRUD needs to target "delete item 2 of 3" by a stable key rather than array index, add an `id String` field and populate it manually (e.g. `uuidv7()`) at write time.
- **Tradeoff:** slightly inconsistent with this schema's existing style, where every other "has many" (routes, itinerary days, FAQs, nearby places) is a separate model + relation, not a composite type. Worth a deliberate team decision, not just going with whatever's already there — several of those existing models arguably could/should have been composite types too, since none of them are queried independently of their parent trek either.

### Option B: Separate model + relation (mirrors `MasterTrekFaq`)

```prisma
model TrekTransportOption {
  id           String @id @map("_id")
  masterTrekId String

  mode        String
  description String
  order       Int      @default(0)

  masterTrek MasterTrek @relation(fields: [masterTrekId], references: [id], onDelete: Cascade)
}
```

- Matches the established pattern for FAQs exactly, which may be preferable just for consistency / least surprise to anyone who already knows this schema.
- Needs an explicit `order` field, a relation, and a cascade-delete rule — more ceremony for data that, per above, has no real independent existence.

**Open questions for backend to decide:**
- Option A vs B?
- Does `mode` need to be constrained (enum) rather than free text? (Recommend free text — trek-specific transport varies too much for a clean enum, per the legacy data: treks use "By Train" / "By Bus" / "By Flight" / "By Road" / "By Air" inconsistently already.)
- If Option A: does admin CRUD need a stable per-item `id`, or is array-index-based editing (replace the whole array on save) acceptable? Simplest admin UX is usually "edit the whole list as a form array, save the whole list" — no per-item id needed in that case.
- Backfill: the 6 currently-seeded treks' `howToReach` strings should be *re-derived from the original source* (`packages/database/trek-raw-data/*.json`'s `how_to_reach` field — already `{term, desc}[]`), not parsed back out of my concatenated string. I can provide/re-run this migration once the schema lands.

## 4. How this renders on the frontend (for context)

Each transport mode renders as its own paragraph inside a "How to Reach" modal, bold mode label inline with the description — not tabs, not cards, not a table (contrast with the separate "Things to Carry" modal, which *does* use tabs — these are two different UI patterns for two different kinds of data):

> **By Flight:** The nearest airport to Rishikesh is Jolly Grant Airport in Dehradun, located about 20 kilometers away...
>
> **By Train:** Rishikesh has its own railway station, but it handles limited trains...
>
> **By Bus:** Rishikesh is well-connected by road. From Delhi, around 240 kilometers away...

This requires exactly the `{ mode, description }[]` shape above — no further nesting, no HTML in `description` (plain text, the frontend adds its own paragraph spacing).

## 5. Frontend workaround (temporary, until backend ships this)

To avoid blocking UI work on this backend decision, the "How to Reach" modal is currently wired to a local mock file (`apps/web/lib/how-to-reach-mock.ts`) with hardcoded `{ mode, description }[]` data, **not** the real `trek.howToReach` field from the API. This is explicitly a placeholder:

- Once backend ships either Option A or B, the API response for `GET /api/treks/public/slug/{slug}` should return `howToReach` as `{ mode: string; description: string }[]` instead of `string | null`.
- The frontend swap is then a one-line change: replace the mock import in the trek page with `trek.howToReach` from the real API response. The modal component itself (`HowToReachModal`) already expects exactly this shape, so no component changes are needed — just removing the mock and passing real data through.
