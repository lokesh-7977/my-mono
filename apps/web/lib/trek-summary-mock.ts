// TEMPORARY: MasterTrek has no `summary` field yet — see
// apps/docs/checklists/master-trek/trek-summary-checklist.md. The admin will write
// this as a plain string; until then these placeholders (keyed by trek slug)
// fill the highlighted box in the overview modal.
//
// Swap-out plan: once the trek API returns `summary`, delete this file and pass
// `trek.summary` straight to <TrekContent summary={...} />. getTrekSummary already
// prefers the real value, so nothing else changes.
import type { Trek } from "@/api/trek/trek.types";

const MOCK_SUMMARY_BY_SLUG: Record<string, string> = {
  "kedarkantha-trek":
    "The trail is about 20 km in total. A fit walker completes the ascent in 9-10 hours across the trek; the descent takes 6-7 hours.",
  "brahmatal-trek":
    "The trail is about 22 km in total. A fit walker completes the ascent in 10-11 hours across the trek; the descent takes 7-8 hours.",
  "hampta-pass-trek":
    "The trail is about 26 km in total. A fit walker completes the ascent in 12-14 hours across the trek; the descent takes 9-10 hours.",
  "valley-of-flowers-trek":
    "The trail is about 38 km in total. A fit walker completes the ascent in 14-16 hours across the trek; the descent takes 10-12 hours.",
  "sandakphu-trek":
    "The trail is about 32 km in total. A fit walker completes the ascent in 14-16 hours across the trek; the descent takes 10-12 hours.",
  "roopkund-trek":
    "The trail is about 53 km in total. A fit walker completes the ascent in 22-26 hours across the trek; the descent takes 16-18 hours.",
};

export function getTrekSummary(trek: Trek): string | null {
  return trek.summary ?? MOCK_SUMMARY_BY_SLUG[trek.slug] ?? null;
}
