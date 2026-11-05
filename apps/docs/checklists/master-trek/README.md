# `MasterTrek` feature docs

Backend checklists for features that hang off `MasterTrek`/`Package` (`packages/database/prisma/schema.prisma`). Unlike the docs in [`../location/`](../location/), these are mostly independent of each other and can be picked up in any order, with one dependency called out below.

- [`how-to-reach-data-structure-checklist.md`](./how-to-reach-data-structure-checklist.md) — `MasterTrek.howToReach` data structure.
- [`weather-conditions-modal-checklist.md`](./weather-conditions-modal-checklist.md) — "Check Weather" modal data. Same reasoning as the `howToReach` doc (composite type, not a separate collection).
- [`featured-treks-checklist.md`](./featured-treks-checklist.md) — manual, admin-curated `isFeatured` flag for the homepage/trek-page "Featured Treks" sections. Independent of booking volume.
- [`popular-treks-checklist.md`](./popular-treks-checklist.md) — computed "most booked" ranking, rolled up from `PackageBooking` through `PackageSchedule`/`Package` to `MasterTrek`. A different concept from "featured" above — don't conflate the two.
- [`trek-packages-listing-checklist.md`](./trek-packages-listing-checklist.md) — `GET` endpoint + filters for "packages belonging to this trek." **Depends on** the booking-count rollup `popular-treks-checklist.md` designs (§4c there) — build that rollup once, reuse it at both the per-package level (this doc) and the per-trek level (that doc).
