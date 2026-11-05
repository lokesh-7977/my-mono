// TEMPORARY: the package API only sends the trek leader's name and avatar — see
// apps/docs/checklists/package/package-guide-profile-checklist.md. Certifications,
// years of experience, rating, review count and the testimonial quote below are
// placeholders for the four seeded demo vendors, keyed by name.
//
// Swap-out plan: once PublicPackageDetail.trekLeader returns these fields, delete this
// file and pass them straight to <PackageProvider />. getGuideProfile already prefers
// real API values, so nothing else changes.
import type { PackageDetail } from "@/api/package/package.types";

export interface GuideProfile {
  badges: string[];
  experienceYears: number | null;
  rating: number | null;
  reviewCount: number | null;
  quote: string | null;
}

const MOCK_BY_NAME: Record<string, GuideProfile> = {
  "Rishabh Singh": {
    badges: ["Eco Certified", "IMF Certified"],
    experienceYears: 12,
    rating: 5.0,
    reviewCount: 2000,
    quote:
      "The last 2 kilometers are definitely the hardest, but once you reach the top and see the peaks right in front of you, every drop of sweat is worth it. Great guide!",
  },
  "Aditi Rao": {
    badges: ["Eco Certified"],
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 1200,
    quote: "Aditi kept the whole group safe and cheerful, and her knowledge of the trail made every stop special.",
  },
  "Karan Mehta": {
    badges: ["IMF Certified"],
    experienceYears: 6,
    rating: 4.8,
    reviewCount: 860,
    quote: "Well organised, always on time, and he picked the best campsites. Would trek with him again.",
  },
  "Priya Nair": {
    badges: ["Eco Certified", "IMF Certified"],
    experienceYears: 10,
    rating: 4.9,
    reviewCount: 1600,
    quote: "Priya's pacing was perfect for a first high-altitude trek. I felt looked after the whole way.",
  },
};

export function getGuideProfile(pkg: PackageDetail): GuideProfile | null {
  const leader = pkg.trekLeader;
  const hasRealValues =
    (leader.badges?.length ?? 0) > 0 ||
    leader.experienceYears != null ||
    leader.rating != null ||
    leader.reviewCount != null ||
    leader.quote != null;

  if (hasRealValues) {
    return {
      badges: leader.badges ?? [],
      experienceYears: leader.experienceYears ?? null,
      rating: leader.rating ?? null,
      reviewCount: leader.reviewCount ?? null,
      quote: leader.quote ?? null,
    };
  }

  return (leader.name && MOCK_BY_NAME[leader.name]) || null;
}
