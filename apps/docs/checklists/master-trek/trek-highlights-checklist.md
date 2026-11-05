# Master trek highlights — backend checklist

**Status:** Proposal, pending backend review. There is currently **no data source at all**, and the trek page is showing the wrong content because of it (see §2).

**Audience:** Backend team, before touching `MasterTrek` or its admin form.

**Related:** [`../package/package-highlights-checklist.md`](../package/package-highlights-checklist.md) — highlights for a vendor's package. That is a separate field with a separate owner; this doc is only about the master trek page.

---

## 1. What the UI needs

A **Highlights** section on the master trek page, titled "{Trek name} Highlights": a grid of short check-marked cards about what makes this trek special, for example:

```
Roopkund Trek Highlights
[✓ Witness the hauntingly beautiful mystery of Skeleton Lake.]   [✓ 360-degree views of Trishul and Nanda Ghunti peaks.]
[✓ Walk through the twin alpine meadows: Ali and Bedni Bugyal.]  [✓ Challenge yourself with high-altitude glacial terrain.]
```

Each item is a plain string.

## 2. Current situation

- **`MasterTrek` has no `highlights` field**, and nothing in `apps/api` or the Prisma schema mentions highlights. The public trek response has none.
- **Every trek page shows the same four lines.** The page renders `<TrekHighlights trekName={trek.name} />` and never passes highlights, so the component's built-in fallback list (written for Roopkund) appears on every trek. For example the Kedarkantha page shows "Witness the hauntingly beautiful mystery of Skeleton Lake", which is wrong for that trek.

## 3. Proposed change

```prisma
model MasterTrek {
  // ...existing fields...
  highlights String[]
}
```

A plain string array with an empty default, entered by an admin in the master trek form (the same form that holds `overview`, `howToReach` and the other informational fields). An empty list is valid.

Return it as `highlights: string[]` on the public master trek response (`/master-trek/public/slug/{slug}`), and accept it on the admin create and update endpoints.

## 4. Open questions for backend and product

1. **Limits:** a maximum number of items (the design shows four) and a maximum length per line.
2. **Empty state:** when a trek has no highlights, the section should be hidden. Showing another trek's text, as happens today, should not be the fallback.
3. **Seeding:** the existing master treks have no highlights. Who writes them, or should the seed script add placeholder entries so the section can be checked?
4. **Relation to packages:** this field and `Package.highlights` are independent. Whether a new package should start from a copy of its trek's highlights is a decision for the package checklist, not this one.

## 5. Frontend workaround

None yet. `TrekHighlights` already accepts an optional `highlights` prop, so once the API returns the field the page passes it through. Until then the page keeps showing the hard-coded Roopkund fallback on every trek. Removing that fallback and hiding the section when the list is empty is a small frontend change that can ship at the same time as the API field, or sooner if wrong text on live trek pages is a concern.
