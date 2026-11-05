# Package highlights — backend checklist

**Status:** Proposal, pending backend review. Frontend is unblocked by a mock (see "Frontend workaround" below).

**Audience:** Backend team, before adding a highlights field to `Package`.

**Scope:** the **package detail page only**.

**Related:** [`package-ascent-descent-stats-checklist.md`](./package-ascent-descent-stats-checklist.md) — another per-package field the vendor owns and edits.

---

## 1. What the UI needs

A **Highlights** section on the package page, directly under Inclusions and Exclusions: a short list of check-marked lines about what makes this package special, for example:

```
Highlights   ✓ Reach the mysterious Roopkund skeleton lake at about 16,500 ft.
             ✓ Walk across Ali and Bedni Bugyal, among the largest alpine meadows in Asia.
             ✓ Panoramic views of Trishul and Nanda Ghunti.
```

It is a list of plain strings. The section is hidden when a package has none.

## 2. Current situation

- **`Package` has no `highlights` field**, and the public package detail response has none.
- **The package page uses a mock** (`apps/web/lib/package-highlights-mock.ts`), keyed by master trek name.

## 3. Proposed change

Highlights belong to the package, written by the vendor, because each vendor's variation of a trek may emphasise different things.

```prisma
model Package {
  // ...existing fields...
  highlights String[]
}
```

A plain string array with an empty default. An empty list is valid and hides the section.

## 4. API changes

- Return `highlights: string[]` on the **public package detail** response.
- Let the vendor edit it with the rest of the package's list-style content. `PATCH /package/{id}/inclusions` already handles inclusions, exclusions and the packing list, so highlights fit there, or in the package basics update. Pick one place and add the field to that validator.

## 5. Open questions for backend and product

1. **Where does the vendor edit it:** the existing inclusions step, or the basics step?
2. **Limits:** a maximum number of items (the design shows 3 to 5) and a maximum length per line.
3. **Moderation:** can a vendor write anything, or are highlights reviewed before the package is published?
4. **Starting point:** should the vendor start from an empty list, or from suggested lines? That would need a source for suggestions, which is a separate decision.

## 6. Frontend workaround

`apps/web/lib/package-highlights-mock.ts` has placeholder highlights for the six seeded treks. `getPackageHighlights` already prefers a real `pkg.highlights`, so once the API returns it you delete the mock file and nothing else changes. `PackageInfoSections` renders the section only when it receives a non-empty list.
