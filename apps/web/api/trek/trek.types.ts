export type TrekDifficulty = "EASY" | "MODERATE" | "DIFFICULT" | "PRO";
export type TrekStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface TrekLocation {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
}

export interface TrekActivity {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
}

export interface TrekItineraryDay {
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
  activities: TrekActivity[];
}

export interface TrekRoute {
  id: string;
  name: string;
  description: string | null;
  distanceKm: number | null;
  difficulty: TrekDifficulty | null;
  elevationGain: number | null;
  ascentTime: string | null;
  descentTime: string | null;
  startPoint: string | null;
  endPoint: string | null;
  isPopular: boolean;
  isDefault: boolean;
  itineraryDays: TrekItineraryDay[];
}

export interface TrekNearbyPlace {
  id: string;
  distanceFromTrek: number | null;
  travelTime: string | null;
  nearbyPlace: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    location: TrekLocation | null;
  };
}

export interface TrekFaq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Trek {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string;
  tagline: string | null;

  difficulty: TrekDifficulty;
  durationDays: number;
  maxAltitude: number | null;
  distanceKm: number | null;
  distinctRoutes: number;

  location: TrekLocation;
  latitude: number | null;
  longitude: number | null;

  bestSeason: string | null;
  beginnerFriendly: boolean;

  overview: string | null;
  howToReach: string | null;
  fitnessInfo: string | null;
  safetyInfo: string | null;
  permitInfo: string | null;
  sustainabilityInfo: string | null;

  coverImageUrl: string | null;
  videoUrl: string | null;
  galleryImages: string[];

  status: TrekStatus;

  activities: TrekActivity[];
  routes: TrekRoute[];
  nearbyPlaces: TrekNearbyPlace[];
  faqs: TrekFaq[];

  startingPrice: number | null;
  currency: string | null;
}
