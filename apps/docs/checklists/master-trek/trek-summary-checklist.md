# Master trek summary — backend checklist

**Status:** Proposal, pending backend review. Frontend is unblocked by a small mock (see "Frontend workaround" below).

**Audience:** Backend team, before touching `MasterTrek` or its admin form.

---

## 1. What the UI needs

The "Show More" overview modal on the master trek page ends with a highlighted summary box (a bold italic callout with a coloured left border), for example:

> The trail is 9 km one way. A fit walker completes the ascent in 3-4 hours; a relaxed pace with stops takes 5-6 hours. Descent is typically 2-3 hours.

It is a short, admin-written summary of the trek. It is **a plain string, nothing structured**.

## 2. Current situation

`MasterTrek` has `shortDescription`, `tagline`, `overview` and `description`, but nothing for this callout. Each of those already has a job elsewhere (page metadata, gallery quote, the overview body), and `howToReach` is travel directions with its own modal, so none of them is a fit. An earlier frontend change wrongly fed `howToReach` into this box; that has been removed.

## 3. Proposed change

```prisma
model MasterTrek {
  // ...existing fields...
  summary String?
}
```

- Plain text, nullable. A trek without a summary is valid, and the box simply doesn't render.
- Admin enters it in the master trek form, and the public master-trek response (`/master-trek/public/slug/{slug}`) returns it as `summary`.

## 4. Open questions

1. Is a length cap needed (it renders as a large callout, so a sentence or two works best)?
2. Should the master trek admin form validate it as required for published treks, or leave it optional?

## 5. Frontend workaround

`apps/web/lib/trek-summary-mock.ts` supplies placeholder summaries for the seeded treks, keyed by slug. `getTrekSummary` already prefers a real `trek.summary`, so once the API sends it you delete the mock file and nothing else changes. The box renders only when a summary exists.
