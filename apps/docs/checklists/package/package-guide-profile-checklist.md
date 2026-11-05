# Package guide profile card — backend checklist

**Status:** Proposal, pending backend review. Frontend is unblocked by a mock (see "Frontend workaround" below); the card shows the guide's real name and avatar and placeholder values for everything else.

**Audience:** Backend team, before extending the public package-detail response.

**Related:**
- [`package-tagging-checklist.md`](./package-tagging-checklist.md) — platform badges and tags are a separate concept from the guide's certifications here; keep the two lists distinct.
- [`../master-trek/trek-packages-listing-checklist.md`](../master-trek/trek-packages-listing-checklist.md) — per-package rating rollup, which this card's rating should be consistent with.

---

## 1. What the UI needs

A card on the package page, between the inclusions/exclusions and the fitness section, introducing the trek leader who runs the package:

```
[photo]  Harish Dhanu
         [Eco Certified] [IMF Certified]   12 Yrs • ★ 5.0 • 2K Reviews
         "The last 2 kilometers are definitely the hardest, but once you reach the top ..."
```

Fields: name, photo, certification/badge chips, years of experience, rating, review count, and one testimonial quote.

## 2. Current situation

The public package detail returns only:

```ts
trekLeader: { id: string; name: string | null; avatarUrl: string | null }
```

(`apps/api/src/services/package.service.ts`, built from `Package.createdBy`.) Everything else on the card is missing from the response, although much of it already exists in the data:

| Card field | Where it could come from today | Gap |
|---|---|---|
| Certification chips | `UserCertification` (title, issuing organisation, `verificationStatus`) and platform `Badge` / `UserBadge` (name, icon) | Not exposed; needs a rule for which ones are public |
| Years of experience | `VendorProfile.experienceYears` (also `treksLed`) | Not exposed; self-declared at onboarding |
| Rating | `Review.rating`, via `GET /review/vendor/{userId}` (list only) | No aggregate; the package list computes a per-package average on read, but nothing at vendor level |
| Review count | Count of `Review` rows | Not returned anywhere |
| Testimonial quote | `Review.comment` | No selection rule; `Review` currently has zero rows |

## 3. Proposed changes

### 3.1 Expose a public-safe guide summary

Extend `trekLeader` on the public package detail:

```ts
trekLeader: {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  badges: string[];            // labels of public certifications / badges
  experienceYears: number | null;
  rating: number | null;       // null when the guide has no reviews
  reviewCount: number;
  quote: string | null;        // one testimonial, null when there is none
}
```

Return only these. Do not expose contact details or anything else from the user or vendor profile.

### 3.2 Which certifications show as chips

Show only **verified** items: `UserCertification` rows whose `verificationStatus` is approved, and awarded platform badges. A pending or rejected certificate must never appear as a chip. Decide whether a chip shows the certificate title or a short platform label ("IMF Certified" rather than the full certificate name), since the design uses short labels.

### 3.3 Rating and review count

Compute at the **guide** level, across all of their published packages' reviews, since the card is about the person. This is different from the per-package rating on package cards. Use the same rounding as the package list (one decimal) and return `null` for no reviews rather than 0. Compute on read at first; cache like the booking rollup if review volume grows.

### 3.4 Testimonial selection

Pick one review comment by a documented rule, for example the highest-rated recent review with a comment of a minimum length. Alternatively let the vendor choose a featured review. Either way it must be a real review, not text the vendor writes about themselves.

## 4. Open questions for backend and product

1. **Certification chips:** certificate titles, or a fixed set of platform labels? And is a self-declared `experienceYears` shown as is, or only once verified?
2. **Guide-level or package-level rating** on this card? This doc assumes guide level; the package page's other rating would be package level.
3. **Testimonial rule:** automatic (highest-rated recent) or vendor-featured? Minimum length? Moderation?
4. **Team packages:** a package can be created under a team (`Package.teamId`). Who is the "guide" then: the creating user, or the team? The card needs a defined answer.
5. **Empty states:** a new guide has no reviews and maybe no certificates. Confirm the card should still render with just name and photo (the frontend does this today).

## 5. Frontend workaround

`apps/web/lib/package-guide-mock.ts` supplies placeholder badges, years, rating, review count and a quote for the four seeded demo vendors, keyed by name. `getGuideProfile` already prefers real `trekLeader` fields, so once the API returns them you delete the mock file and nothing else changes. `PackageProvider` renders whatever it receives and shows only name and photo when the rest is missing.
