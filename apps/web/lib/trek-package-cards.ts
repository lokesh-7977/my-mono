import type { Trek, TrekPackage, TrekPackageSchedule } from "@/api/trek/trek.types";
import { getMockVendor } from "@/lib/package-vendor-mock";

export interface PackageCardData {
  id: string;
  href: string;
  title: string;
  image: string;
  durationDays: number;
  distanceKm?: number;
  maxAltitudeFt?: number;
  price: number;
  rating?: number;
  guideName?: string;
  guideAvatarUrl?: string;
}

const METRES_TO_FEET = 3.28084;

const scheduleDisplayPrice = (schedule: TrekPackageSchedule): number | null => {
  if (schedule.price != null) return schedule.price;
  if (schedule.adultPrice != null && schedule.childPrice != null) {
    return Math.min(schedule.adultPrice, schedule.childPrice);
  }
  return null;
};

const startingPrice = (pkg: TrekPackage): number | null => {
  const prices = pkg.schedules.map(scheduleDisplayPrice).filter((price): price is number => price !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
};

/**
 * Maps the packages embedded in the public trek response to package-card data.
 * Selection is the backend's job (see apps/docs/checklists/master-trek/trek-packages-listing-checklist.md);
 * a package with no open departure has no price to show and cannot be booked, so it is skipped here.
 * The order the API sends is preserved.
 */
export function getTrekPackageCards(trek: Trek): PackageCardData[] {
  const cards: PackageCardData[] = [];

  for (const pkg of trek.packages ?? []) {
    const price = startingPrice(pkg);
    const image = pkg.galleryImages[0];
    if (price === null || !image) continue;

    const mockVendor = getMockVendor(pkg.createdByUserId);

    cards.push({
      id: pkg.id,
      href: `/trek/${trek.slug}/${pkg.id}`,
      title: pkg.title ?? trek.name,
      image,
      durationDays: pkg.durationDays ?? trek.durationDays,
      distanceKm: pkg.distanceKm ?? trek.distanceKm ?? undefined,
      maxAltitudeFt: trek.maxAltitude ? Math.round(trek.maxAltitude * METRES_TO_FEET) : undefined,
      price,
      rating: pkg.rating ?? undefined,
      guideName: pkg.trekLeader?.name ?? mockVendor?.name,
      guideAvatarUrl: pkg.trekLeader?.avatarUrl ?? mockVendor?.avatarUrl,
    });
  }

  return cards;
}
