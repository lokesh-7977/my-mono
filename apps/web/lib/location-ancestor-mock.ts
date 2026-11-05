// TEMPORARY: stands in for the generic ancestor-chain lookup described in
// apps/docs/checklists/location/location-ancestor-chain-checklist.md. `Location` is an
// admin-curated log, not a fixed hierarchy — a trek, package, or (later)
// activity can link to a location at ANY depth (state, district, city, or
// nothing at all), and that's permanent, not a gap waiting to be seeded
// deeper. This map only fills in whatever parent happens to be known for the
// handful of locations seeded today; anything not listed here falls back to
// a 1-level chain, which is the same "handle whatever depth exists" behavior
// the real backend lookup needs to guarantee once it exists.
//
// Reused wherever a location needs to render as a chain, not just trek
// breadcrumbs — e.g. nearby places, and future activity breadcrumbs.
const PARENT_BY_LOCATION_NAME: Record<string, string> = {
  "Uttar Kashi": "Uttarakhand",
  Chamoli: "Uttarakhand",
  Kullu: "Himachal Pradesh",
  Darjeeling: "West Bengal",
};

// Every ancestor chain entry links to its own /location/{slug} page, so a
// name without a known slug here renders as plain text instead — same
// "only claim what's actually known" rule as the parent lookup above.
const LOCATION_SLUG_BY_NAME: Record<string, string> = {
  Uttarakhand: "uttarakhand",
  "Himachal Pradesh": "himachal-pradesh",
  "West Bengal": "west-bengal",
  "Uttar Kashi": "uttar-kashi",
  Chamoli: "chamoli",
  Kullu: "kullu",
  Darjeeling: "darjeeling",
};

export interface LocationCrumb {
  label: string;
  href?: string;
}

interface LocationLike {
  name: string;
}

function toCrumb(name: string): LocationCrumb {
  const slug = LOCATION_SLUG_BY_NAME[name];
  return slug ? { label: name, href: `/location/${slug}` } : { label: name };
}

/** Returns a location's ancestor chain (closest-known parent first, then itself), as deep as is actually known — never a fixed number of levels. */
export function getLocationAncestorCrumbs(location: LocationLike | null | undefined): LocationCrumb[] {
  if (!location) return [];

  const parent = PARENT_BY_LOCATION_NAME[location.name];
  if (!parent) return [toCrumb(location.name)];

  return [toCrumb(parent), toCrumb(location.name)];
}
