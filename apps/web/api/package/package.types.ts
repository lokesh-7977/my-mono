import type { TrekDifficulty } from "../trek/trek.types";

// Mirrors PublicPackageDetail in apps/api/src/types/package.ts. Dates arrive
// as ISO strings over JSON.

export interface PackageSchedule {
  id: string;
  startDate: string;
  endDate: string;
  bookingStartDate: string | null;
  bookingEndDate: string | null;
  price: number | null;
  adultPrice: number | null;
  childPrice: number | null;
  currency: string;
  minParticipants: number;
  maxParticipants: number;
  availableSeats: number;
  cancellationPolicy: string | null;
}

export interface PackageItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string | null;
  startLocation: string | null;
  endLocation: string | null;
  distanceKm: number | null;
  duration: string | null;
  altitude: number | null;
  imageUrls: string[];
}

export interface PackageNearbyPlace {
  id: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  distanceFromTrek: number | null;
  travelTime: string | null;
  location: { id: string; name: string } | null;
}

export interface PackageTrekInfo {
  name: string;
  overview: string | null;
  howToReach: string | null;
  fitnessInfo: string | null;
  safetyInfo: string | null;
  permitInfo: string | null;
  sustainabilityInfo: string | null;
  bestSeason: string | null;
  beginnerFriendly: boolean;
  maxAltitude: number | null;
}

export interface PackageDetail {
  id: string;
  title: string | null;
  description: string | null;
  galleryImages: string[];
  location: { id: string; name: string } | null;
  difficulty: TrekDifficulty | null;
  durationDays: number | null;
  distanceKm: number | null;
  // Proposed in apps/docs/checklists/package/package-ascent-descent-stats-checklist.md; not sent by the API yet.
  ascentDistanceKm?: number | null;
  ascentTime?: string | null;
  descentDistanceKm?: number | null;
  descentTime?: string | null;
  trekLeader: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  itineraryDays: PackageItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  // Proposed in apps/docs/checklists/package/package-highlights-checklist.md; not sent by the API yet.
  highlights?: string[];
  packingList: string[];
  fitnessAndExperienceRequirement: string | null;
  meetingPoint: string | null;
  instructions: string | null;
  trekInfo: PackageTrekInfo;
  nearbyPlaces: PackageNearbyPlace[];
  startingPrice: number | null;
  currency: string | null;
  schedules: PackageSchedule[];
}
