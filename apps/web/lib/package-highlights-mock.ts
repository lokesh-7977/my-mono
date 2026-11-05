// TEMPORARY: Package has no `highlights` field yet — see
// apps/docs/checklists/package/package-highlights-checklist.md. These placeholder
// highlights (keyed by master trek name) fill the Highlights section for the seeded
// demo packages.
//
// Swap-out plan: once PublicPackageDetail returns `highlights`, delete this file and pass
// `pkg.highlights` straight to <PackageInfoSections highlights={...} />. getPackageHighlights
// already prefers the real value, so nothing else changes.
import type { PackageDetail } from "@/api/package/package.types";

const MOCK_BY_TREK_NAME: Record<string, string[]> = {
  "Kedarkantha Trek": [
    "Stand on the Kedarkantha summit at 3,800 m for 360-degree views of the Himalayan peaks.",
    "Camp beside the frozen Juda-ka-Talab lake.",
    "Walk through snow-laden pine and oak forests.",
    "A gentle, beginner-friendly winter trek with a comfortable pace.",
  ],
  "Brahmatal Trek": [
    "Views of Mt Trishul and Nanda Ghunti from the Brahmatal ridge.",
    "Visit the frozen Bekaltal and Brahmatal lakes.",
    "Camp among oak and rhododendron forests.",
    "A beginner-friendly winter trek with easy gradients.",
  ],
  "Hampta Pass Trek": [
    "Cross Hampta Pass at about 14,000 ft, from Kullu's green valley into Lahaul's barren landscape.",
    "Optional detour to the turquoise Chandratal Lake.",
    "Camp in the high meadows of Chika and Balu ka Ghera.",
    "One of the most dramatic scenery changes of any short Himalayan trek.",
  ],
  "Valley of Flowers Trek": [
    "Walk through the UNESCO-listed Valley of Flowers during the monsoon bloom.",
    "Visit the Hemkund Sahib gurdwara on the same trip.",
    "Spot rare Himalayan flowers and alpine meadows.",
    "Stay at Ghangaria, the base for both the valley and Hemkund Sahib.",
  ],
  "Sandakphu Trek": [
    "See four of the world's five highest peaks, including Everest and Kanchenjunga, from Sandakphu.",
    "Walk the Singalila ridge along the India-Nepal border.",
    "Watch the Sleeping Buddha profile of the Kanchenjunga range at sunrise.",
    "Stay in trekkers' huts and local homestays along the way.",
  ],
  "Roopkund Trek": [
    "Reach the mysterious Roopkund skeleton lake at about 16,500 ft.",
    "Walk across Ali and Bedni Bugyal, among the largest alpine meadows in Asia.",
    "Panoramic views of Trishul and Nanda Ghunti.",
    "A summit day over snow and glacial terrain that tests your resolve.",
  ],
};

export function getPackageHighlights(pkg: PackageDetail): string[] {
  if (pkg.highlights && pkg.highlights.length > 0) return pkg.highlights;
  return MOCK_BY_TREK_NAME[pkg.trekInfo.name] ?? [];
}
