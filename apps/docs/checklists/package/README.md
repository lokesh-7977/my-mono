# Package page feature docs

Backend checklists for what the public package detail page (`/trek/{trekSlug}/{packageId}`) needs from the API.

- [`package-ascent-descent-stats-checklist.md`](./package-ascent-descent-stats-checklist.md) — Ascent and Descent stat cards. A package owns its own stats (a vendor's variation of a route template), so they need fields on `Package`, prefilled from the route template and exposed in the public package response.

Related, kept under [`../master-trek/`](../master-trek/): [`trek-packages-listing-checklist.md`](../master-trek/trek-packages-listing-checklist.md) (packages for a master trek, with filters).
