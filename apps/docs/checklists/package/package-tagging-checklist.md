# Package tagging system — backend checklist

**Status:** Discussion draft, pending backend and product review. Nothing is built; the package page header currently builds a few chips from existing data (see §2).

**Audience:** Backend team and product, before adding any tag or badge field to `Package`.

**Related:**
- [`../master-trek/popular-treks-checklist.md`](../master-trek/popular-treks-checklist.md) — the booking-count rollup that a "Most Popular" badge would reuse.
- [`../master-trek/trek-packages-listing-checklist.md`](../master-trek/trek-packages-listing-checklist.md) — the package list and filters; tags would become a filter there.
- [`package-ascent-descent-stats-checklist.md`](./package-ascent-descent-stats-checklist.md) — another set of per-package fields the vendor owns.

---

## 1. What the UI shows

The package detail design has a row of chips under the title, for example:

```
[Most Popular]  Route 1  •  Beginner Friendly  •  5 Days
```

The same kind of label could also appear on the shared package card, and as a filter on the package list. "Tag" here means any short label attached to a package. Not all of them are the same kind of thing, which is the main point of this doc (§3).

## 2. Current situation

- **`Package` has no tag field of any kind**, and there is no `Tag` model in the schema.
- **`MasterTrek` has `beginnerFriendly`** (a boolean) and `Activity` links (`activityIds`; `Activity` has a name and icon). Those describe the trek, not a vendor's package.
- **The package page header builds its chips from existing data today** (`PackageHeader` takes a plain `badges: string[]`): "Beginner Friendly" from the master trek flag, "N days" from `durationDays`, and the location name. "Most Popular" and "Route 1" are not shown because nothing supplies them.
- **One display rule already lives in the frontend:** the dates modal marks a departure "Limited seats left" when `availableSeats <= 5`. That threshold is a business rule and should not be hard-coded on the client.

## 3. Four different kinds of tag

Treating all chips as one "tags" list is what makes this hard. They differ in who decides them and where they should be computed:

| Kind | Examples | Decided by | Storage |
|---|---|---|---|
| **Derived facts** | "5 Days", difficulty, "Beginner Friendly", location, route name | Existing data | None. Computed on read. |
| **Computed badges** | "Most Popular", "Top Rated", "New", "Almost full" | A rule over bookings, reviews, dates, seats | A periodic job or on-read rule, not stored by hand |
| **Vendor-chosen tags** | "Weekend getaway", "Camping", "Snow", "Family friendly", "Women only", "Photography" | The vendor, when creating the package | A stored list on the package |
| **Platform badges** | "Editor's pick", "Verified", "Featured" | An admin | A stored flag or list the vendor cannot edit |

Only the last two need new storage. The first two need a rule and a place to run it.

## 4. Proposed approach

### 4.1 Controlled vocabulary, not free text

For vendor-chosen and platform tags, use a managed list rather than free-text strings. Free text produces near-duplicates ("Family friendly", "family-friendly", "Families") that can't be filtered reliably.

```prisma
model Tag {
  id               String  @id @map("_id")
  slug             String  @unique
  label            String
  kind             TagKind        // VENDOR | PLATFORM
  vendorAssignable Boolean @default(true)
  isActive         Boolean @default(true)

  packageIds String[]
  packages   Package[] @relation(fields: [packageIds], references: [id])
}

model Package {
  // ...existing fields...
  tagIds String[]
  tags   Tag[] @relation(fields: [tagIds], references: [id])
}
```

This mirrors the `activityIds` / `Activity` pattern already used on the master trek. Admins own the list; vendors pick from the ones marked assignable when creating the package. Platform badges are the same table with `vendorAssignable: false`.

### 4.2 Computed badges are rules, not data

"Most Popular", "Top Rated", "New" and "Almost full" should be computed by the backend and returned already resolved. A manually set "Most Popular" goes stale, and it would duplicate the booking rollup that `popular-treks-checklist.md` already designs. Reuse that rollup (and the rating rollup in `trek-packages-listing-checklist.md` §4b) rather than building a second one.

### 4.3 One resolved `tags` array in the responses

Return a single ordered array on the public package detail and the package list, so the frontend does not need to know where each label came from or re-implement thresholds:

```ts
tags: {
  key: string;                          // stable id or slug
  label: string;
  source: "derived" | "computed" | "vendor" | "platform";
}[]
```

The backend decides the order (promotional badges first, then attributes) and the cap, so the page and the card agree.

### 4.4 Filtering

Add a `tag` query parameter (slug, repeatable) to the package list and search endpoints. Only vendor and platform tags need filtering; derived facts already have their own filters (difficulty, duration).

## 5. Open questions for backend and product

1. **Which tags do we want at launch?** The design shows four; this doc assumes more will follow.
2. **Tags vs activities.** Master treks already have `Activity` (what you do on the trek, with an icon). Should package tags be a separate list (this doc's assumption: activities describe the trek, tags describe the offering and audience), or reuse `Activity`?
3. **Who can create new tags?** Admin only (recommended), or can vendors propose new ones for approval?
4. **Computed badge rules.** What counts as "Most Popular", "Top Rated", "New" and "Almost full"? A booking window, a minimum review count, a days-since-creation cutoff and a seat threshold all need numbers. The "Limited seats" threshold should move from the frontend to here.
5. **Display cap and order.** How many chips fit on the header and on the card, and which win when there are too many?
6. **Route chip.** The design shows "Route 1". A package's itinerary is the vendor's own variation of a route template (see the ascent/descent checklist), so is the route name still meaningful to show, and should it be a derived fact from the template the vendor started from?
7. **Platform vs vendor boundary.** Which badges are admin-only? A vendor must not be able to give themselves "Verified" or "Editor's pick".

## 6. Frontend workaround

None needed. `PackageHeader` already accepts a plain `badges: string[]`, built today from derived data. Once the API returns the resolved `tags` array (§4.3), the page passes the labels straight in, and the same array can feed the package card.
