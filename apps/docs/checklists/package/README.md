# Package page feature docs

Backend checklists for what the public package detail page (`/trek/{trekSlug}/{packageId}`) needs from the API.

- [`package-ascent-descent-stats-checklist.md`](./package-ascent-descent-stats-checklist.md) — Ascent and Descent stat cards. A package owns its own stats (a vendor's variation of a route template), so they need fields on `Package`, prefilled from the route template and exposed in the public package response.
- [`package-tagging-checklist.md`](./package-tagging-checklist.md) — a tagging and badge system for packages: derived facts, computed badges (Most Popular, Top Rated), vendor-chosen tags and platform badges, and where each should live.
- [`package-guide-profile-checklist.md`](./package-guide-profile-checklist.md) — the trek leader card: the API sends only name and avatar, while certifications, years, rating, review count and a testimonial are missing from the response.
- [`package-highlights-checklist.md`](./package-highlights-checklist.md) — the Highlights list: `Package` has no `highlights` field, so a vendor-written string list is proposed.

Related, kept under [`../master-trek/`](../master-trek/): [`trek-packages-listing-checklist.md`](../master-trek/trek-packages-listing-checklist.md) (packages for a master trek, with filters).
