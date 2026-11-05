// TEMPORARY: the package API doesn't send ascent/descent yet — see
// apps/docs/checklists/package/package-ascent-descent-stats-checklist.md.
// A package owns these numbers (a vendor's variation of a route template);
// the figures below are placeholders per master trek, roughly in line with each
// seeded package's total distance.
//
// Swap-out plan: once PublicPackageDetail returns ascentDistanceKm / ascentTime /
// descentDistanceKm / descentTime, delete this file and pass `pkg` fields straight
// to <PackageStats ascent={...} descent={...} />. getAscentDescent already prefers
// real API values, so nothing else changes.
import type { PackageDetail } from "@/api/package/package.types";

export interface AscentDescent {
  ascentDistanceKm: number | null;
  ascentTime: string | null;
  descentDistanceKm: number | null;
  descentTime: string | null;
}

const MOCK_BY_TREK_NAME: Record<string, AscentDescent> = {
  "Kedarkantha Trek": { ascentDistanceKm: 11, ascentTime: "9 - 10 hours", descentDistanceKm: 9, descentTime: "6 - 7 hours" },
  "Brahmatal Trek": { ascentDistanceKm: 12, ascentTime: "10 - 11 hours", descentDistanceKm: 10, descentTime: "7 - 8 hours" },
  "Hampta Pass Trek": { ascentDistanceKm: 14, ascentTime: "12 - 14 hours", descentDistanceKm: 12, descentTime: "9 - 10 hours" },
  "Valley of Flowers Trek": { ascentDistanceKm: 21, ascentTime: "14 - 16 hours", descentDistanceKm: 17, descentTime: "10 - 12 hours" },
  "Sandakphu Trek": { ascentDistanceKm: 18, ascentTime: "14 - 16 hours", descentDistanceKm: 14, descentTime: "10 - 12 hours" },
  "Roopkund Trek": { ascentDistanceKm: 28, ascentTime: "22 - 26 hours", descentDistanceKm: 25, descentTime: "16 - 18 hours" },
};

export function getAscentDescent(pkg: PackageDetail): AscentDescent | null {
  const hasRealValues =
    pkg.ascentDistanceKm != null ||
    pkg.ascentTime != null ||
    pkg.descentDistanceKm != null ||
    pkg.descentTime != null;

  if (hasRealValues) {
    return {
      ascentDistanceKm: pkg.ascentDistanceKm ?? null,
      ascentTime: pkg.ascentTime ?? null,
      descentDistanceKm: pkg.descentDistanceKm ?? null,
      descentTime: pkg.descentTime ?? null,
    };
  }

  return MOCK_BY_TREK_NAME[pkg.trekInfo.name] ?? null;
}
