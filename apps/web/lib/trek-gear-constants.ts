// Trek packing-list data, organized by trek difficulty.
// Ported from the legacy app's trekGearConstants.js, keyed by our actual
// Difficulty enum (EASY/MODERATE/DIFFICULT/PRO) instead of capitalized
// English labels, so callers can pass a trek's real difficulty straight
// through without a translation step.

import type { TrekDifficulty } from "@/api/trek/trek.types";

export type GearSeason = "summer" | "winter" | "monsoon";

export const SEASONS: Record<GearSeason, { key: GearSeason; label: string; color: string }> = {
  summer: { key: "summer", label: "Summer", color: "#10b981" },
  winter: { key: "winter", label: "Winter", color: "#3b82f6" },
  monsoon: { key: "monsoon", label: "Monsoon", color: "#f59e0b" },
};

export const seasonToEmoji = (season: GearSeason): string => {
  switch (season) {
    case "summer":
      return "🟢";
    case "winter":
      return "🔵";
    case "monsoon":
      return "🟡";
    default:
      return "";
  }
};

export type GearCategoryId =
  | "backpack_storage"
  | "footwear"
  | "clothing_upper"
  | "clothing_lower"
  | "weather_protection"
  | "hydration_food"
  | "personal_care"
  | "toiletries"
  | "documents_electronics"
  | "trek_essentials";

export interface GearCategory {
  id: GearCategoryId;
  label: string;
  icon: string;
}

// Order here is the order tabs render in.
export const GEAR_CATEGORIES: GearCategory[] = [
  { id: "backpack_storage", label: "Backpack & Storage", icon: "🎒" },
  { id: "footwear", label: "Footwear", icon: "👟" },
  { id: "clothing_upper", label: "Clothing — Upper Body", icon: "👕" },
  { id: "clothing_lower", label: "Clothing — Lower Body", icon: "👖" },
  { id: "weather_protection", label: "Weather & Sun Protection", icon: "🧢" },
  { id: "hydration_food", label: "Hydration & Food", icon: "💧" },
  { id: "personal_care", label: "Personal Care & First Aid", icon: "🩹" },
  { id: "toiletries", label: "Toiletries", icon: "🧴" },
  { id: "documents_electronics", label: "Documents & Electronics", icon: "📱" },
  { id: "trek_essentials", label: "Trek Essentials", icon: "🧭" },
];

export interface GearItem {
  item: string;
  quantity: string;
  seasons: GearSeason[];
  whyMatters: string;
  optional?: boolean;
}

type GearByCategory = Partial<Record<GearCategoryId, GearItem[]>>;

const EASY_TREK_GEAR: GearByCategory = {
  backpack_storage: [
    { item: "Backpack (20–30L)", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Holds all essentials without being heavy" },
    { item: "Backpack rain cover", quantity: "1", seasons: ["monsoon", "winter"], whyMatters: "Keeps bag dry in rain or snow" },
    { item: "Small daypack", quantity: "0–1", seasons: ["summer"], whyMatters: "Useful for short summit walks", optional: true },
    { item: "Dry pouch / ziplock bags", quantity: "2–3", seasons: ["summer", "winter", "monsoon"], whyMatters: "Protects phone and documents" },
  ],
  footwear: [
    { item: "Trekking shoes", quantity: "1 pair", seasons: ["summer", "winter", "monsoon"], whyMatters: "Grip and stability on uneven trails" },
    { item: "Socks", quantity: "2–3 pairs", seasons: ["summer", "winter", "monsoon"], whyMatters: "Prevents blisters and wet feet" },
    { item: "Slippers / sandals", quantity: "1 pair", seasons: ["summer", "winter"], whyMatters: "Comfort at camps or stays" },
  ],
  clothing_upper: [
    { item: "Quick-dry T-shirts", quantity: "2–3", seasons: ["summer", "monsoon"], whyMatters: "Dries fast after sweat or rain" },
    { item: "Warm fleece / light jacket", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Cold mornings and evenings" },
    { item: "Windproof / rain jacket", quantity: "1", seasons: ["monsoon", "winter"], whyMatters: "Wind and rain protection" },
    { item: "Thermal top", quantity: "1", seasons: ["winter"], whyMatters: "Keeps body warm in cold treks" },
  ],
  clothing_lower: [
    { item: "Trekking pants", quantity: "1–2", seasons: ["summer", "winter", "monsoon"], whyMatters: "Comfortable and flexible" },
    { item: "Thermal bottom", quantity: "1", seasons: ["winter"], whyMatters: "Cold weather warmth" },
    { item: "Track pants / pajamas", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Comfortable for night stay" },
  ],
  weather_protection: [
    { item: "Cap / hat", quantity: "1", seasons: ["summer"], whyMatters: "Protects from sun" },
    { item: "Sunglasses", quantity: "1", seasons: ["summer", "winter"], whyMatters: "UV and snow glare protection" },
    { item: "Rain poncho / rain jacket", quantity: "1", seasons: ["monsoon"], whyMatters: "Sudden rain protection" },
    { item: "Light gloves", quantity: "1 pair", seasons: ["winter"], whyMatters: "Keeps hands warm" },
  ],
  hydration_food: [
    { item: "Reusable water bottle (1–2L)", quantity: "1–2", seasons: ["summer", "winter", "monsoon"], whyMatters: "Prevents dehydration" },
    { item: "ORS / electrolyte", quantity: "2–3", seasons: ["summer", "monsoon"], whyMatters: "Replaces lost salts" },
    { item: "Energy bars", quantity: "2–4", seasons: ["summer", "winter", "monsoon"], whyMatters: "Quick trekking energy" },
    { item: "Dry fruits / trail mix", quantity: "1 pack", seasons: ["summer", "winter"], whyMatters: "Long-lasting fuel" },
    { item: "Chocolates / glucose biscuits", quantity: "1 pack", seasons: ["summer", "winter"], whyMatters: "Instant energy" },
  ],
  personal_care: [
    { item: "Personal medicines", quantity: "As needed", seasons: ["summer", "winter", "monsoon"], whyMatters: "Health safety" },
    { item: "Basic first-aid kit", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Minor injuries" },
    { item: "Pain relief spray / gel", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Muscle soreness" },
    { item: "Band-aids", quantity: "4–6", seasons: ["summer", "winter", "monsoon"], whyMatters: "Blisters and cuts" },
    { item: "Hand sanitizer", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Hygiene" },
    { item: "Wet wipes", quantity: "1 pack", seasons: ["summer", "monsoon"], whyMatters: "Cleaning without water" },
    { item: "Tissue / toilet paper", quantity: "1 roll", seasons: ["summer", "winter", "monsoon"], whyMatters: "Toilets may not be available" },
  ],
  toiletries: [
    { item: "Toothbrush", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Daily hygiene" },
    { item: "Toothpaste (small)", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Travel-friendly" },
    { item: "Face wash / soap", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Keeps skin clean" },
    { item: "Sunscreen", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Prevents sunburn" },
    { item: "Lip balm", quantity: "1", seasons: ["winter"], whyMatters: "Prevents cracked lips" },
    { item: "Small towel", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Basic cleaning" },
  ],
  documents_electronics: [
    { item: "Photo ID", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Hotels & permits" },
    { item: "Cash", quantity: "As needed", seasons: ["summer", "winter", "monsoon"], whyMatters: "Network may not work" },
    { item: "Mobile phone", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Navigation & safety" },
    { item: "Power bank", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Charging backup" },
    { item: "Charging cable", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Required to use power bank" },
  ],
  trek_essentials: [
    { item: "Trekking pole", quantity: "1–2", seasons: ["summer", "winter"], whyMatters: "Reduces knee strain", optional: true },
    { item: "Headlamp / torch", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Night visibility" },
    { item: "Notebook & pen", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Notes & emergencies" },
    { item: "Garbage bags", quantity: "2–3", seasons: ["summer", "winter", "monsoon"], whyMatters: "Carry back waste ♻️" },
  ],
};

const MODERATE_TREK_GEAR: GearByCategory = {
  backpack_storage: [
    { item: "Backpack (30–40L)", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Holds extra layers & food" },
    { item: "Rain cover for backpack", quantity: "1", seasons: ["monsoon", "winter"], whyMatters: "Keeps gear dry" },
    { item: "Dry bags / ziplock pouches", quantity: "2–3", seasons: ["summer", "winter", "monsoon"], whyMatters: "Protects clothes & electronics" },
    { item: "Small daypack", quantity: "0–1", seasons: ["summer"], whyMatters: "Useful for summit day", optional: true },
  ],
  footwear: [
    { item: "Trekking shoes (good grip)", quantity: "1 pair", seasons: ["summer", "winter", "monsoon"], whyMatters: "Stability on steep terrain" },
    { item: "Socks", quantity: "3–4 pairs", seasons: ["summer", "winter", "monsoon"], whyMatters: "Prevent blisters" },
    { item: "Slippers / sandals", quantity: "1 pair", seasons: ["summer", "winter"], whyMatters: "Comfort at camps" },
  ],
  clothing_upper: [
    { item: "Quick-dry T-shirts", quantity: "3", seasons: ["summer", "monsoon"], whyMatters: "Sweat management" },
    { item: "Warm fleece", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Cold mornings & evenings" },
    { item: "Insulated jacket", quantity: "1", seasons: ["winter"], whyMatters: "Warmth at higher altitude" },
    { item: "Windproof / rain jacket", quantity: "1", seasons: ["monsoon", "winter"], whyMatters: "Wind & rain protection" },
    { item: "Thermal top", quantity: "1", seasons: ["winter"], whyMatters: "Needed for cold treks" },
  ],
  clothing_lower: [
    { item: "Trekking pants", quantity: "2", seasons: ["summer", "winter", "monsoon"], whyMatters: "Comfortable for long walks" },
    { item: "Thermal bottom", quantity: "1", seasons: ["winter"], whyMatters: "Cold protection" },
    { item: "Track pants / pajamas", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Night comfort" },
  ],
  weather_protection: [
    { item: "Cap / hat", quantity: "1", seasons: ["summer"], whyMatters: "Sun protection" },
    { item: "Woollen cap", quantity: "1", seasons: ["winter"], whyMatters: "Cold weather warmth" },
    { item: "Sunglasses (UV)", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Sun & snow glare" },
    { item: "Light gloves", quantity: "1 pair", seasons: ["winter"], whyMatters: "Keeps hands warm" },
    { item: "Rain poncho / rain jacket", quantity: "1", seasons: ["monsoon"], whyMatters: "Sudden rain" },
  ],
  hydration_food: [
    { item: "Water bottles (1–2L)", quantity: "1–2", seasons: ["summer", "winter", "monsoon"], whyMatters: "Prevents dehydration" },
    { item: "ORS / electrolyte", quantity: "2–3", seasons: ["summer", "monsoon"], whyMatters: "Replaces lost salts" },
    { item: "Energy bars", quantity: "3–5", seasons: ["summer", "winter", "monsoon"], whyMatters: "Trekking fuel" },
    { item: "Dry fruits / trail mix", quantity: "1 pack", seasons: ["summer", "winter"], whyMatters: "Sustained energy" },
    { item: "Chocolates / glucose biscuits", quantity: "1 pack", seasons: ["summer", "winter"], whyMatters: "Instant boost" },
  ],
  personal_care: [
    { item: "Personal medicines", quantity: "As needed", seasons: ["summer", "winter", "monsoon"], whyMatters: "Health safety" },
    { item: "First-aid kit", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Minor injuries" },
    { item: "Pain relief spray / gel", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Muscle soreness" },
    { item: "Band-aids / blister tape", quantity: "4–6", seasons: ["summer", "winter", "monsoon"], whyMatters: "Blister prevention" },
    { item: "Hand sanitizer", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Hygiene" },
    { item: "Wet wipes", quantity: "1 pack", seasons: ["summer", "monsoon"], whyMatters: "Cleaning" },
    { item: "Tissue / toilet paper", quantity: "1 roll", seasons: ["summer", "winter", "monsoon"], whyMatters: "Toilets may be absent" },
  ],
  toiletries: [
    { item: "Toothbrush", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Hygiene" },
    { item: "Toothpaste (small)", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Travel-friendly" },
    { item: "Face wash / soap", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Clean skin" },
    { item: "Sunscreen (SPF 30+)", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Prevents sunburn" },
    { item: "Lip balm", quantity: "1", seasons: ["winter"], whyMatters: "Prevents cracking" },
    { item: "Small towel", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Basic use" },
  ],
  documents_electronics: [
    { item: "Photo ID", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Verification" },
    { item: "Cash", quantity: "As needed", seasons: ["summer", "winter", "monsoon"], whyMatters: "Network may fail" },
    { item: "Mobile phone", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Safety & photos" },
    { item: "Power bank", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Charging backup" },
    { item: "Charging cable", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Essential" },
  ],
  trek_essentials: [
    { item: "Trekking pole", quantity: "1–2", seasons: ["summer", "winter"], whyMatters: "Reduces knee strain" },
    { item: "Headlamp / torch", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Night visibility" },
    { item: "Notebook & pen", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Notes" },
    { item: "Garbage bags", quantity: "2–3", seasons: ["summer", "winter", "monsoon"], whyMatters: "Carry back waste ♻️" },
  ],
};

const DIFFICULT_TREK_GEAR: GearByCategory = {
  backpack_storage: [
    { item: "Backpack (40–50L)", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Holds all extra layers & food" },
    { item: "Rain cover for backpack", quantity: "1", seasons: ["monsoon", "winter"], whyMatters: "Keeps gear dry" },
    { item: "Dry bags / stuff sacks", quantity: "3–4", seasons: ["summer", "winter", "monsoon"], whyMatters: "Separates & protects clothes" },
    { item: "Small daypack", quantity: "0–1", seasons: ["summer"], whyMatters: "Useful for summit pushes", optional: true },
  ],
  footwear: [
    { item: "High-ankle trekking shoes", quantity: "1 pair", seasons: ["summer", "winter", "monsoon"], whyMatters: "Ankle support on rocky terrain" },
    { item: "Socks", quantity: "4–5 pairs", seasons: ["summer", "winter", "monsoon"], whyMatters: "Longer treks need more changes" },
    { item: "Thermal socks (winter)", quantity: "1–2 pairs", seasons: ["winter"], whyMatters: "Prevents cold feet" },
    { item: "Camp sandals", quantity: "1 pair", seasons: ["summer", "winter"], whyMatters: "For resting at camps" },
  ],
  clothing_upper: [
    { item: "Quick-dry T-shirts", quantity: "3", seasons: ["summer", "monsoon"], whyMatters: "Manages sweat" },
    { item: "Warm fleece", quantity: "1–2", seasons: ["summer", "winter"], whyMatters: "Layering warmth" },
    { item: "Heavy insulated / down jacket", quantity: "1", seasons: ["winter"], whyMatters: "High-altitude cold" },
    { item: "Windproof & waterproof jacket", quantity: "1", seasons: ["monsoon", "winter"], whyMatters: "Wind & rain protection" },
    { item: "Thermal tops", quantity: "2", seasons: ["winter"], whyMatters: "Cold nights" },
  ],
  clothing_lower: [
    { item: "Trekking pants", quantity: "2–3", seasons: ["summer", "winter", "monsoon"], whyMatters: "Long trekking days" },
    { item: "Thermal bottoms", quantity: "2", seasons: ["winter"], whyMatters: "Cold conditions" },
    { item: "Track pants / pajamas", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Camp comfort" },
  ],
  weather_protection: [
    { item: "Sun cap", quantity: "1", seasons: ["summer"], whyMatters: "UV protection" },
    { item: "Woollen cap", quantity: "1–2", seasons: ["winter"], whyMatters: "Cold protection" },
    { item: "Sunglasses (UV 400)", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Snow & sun glare" },
    { item: "Insulated gloves", quantity: "1 pair", seasons: ["winter"], whyMatters: "Keeps hands warm" },
    { item: "Rain poncho / jacket", quantity: "1", seasons: ["monsoon"], whyMatters: "Sudden rain" },
  ],
  hydration_food: [
    { item: "Water bottles (2–3L total)", quantity: "1–2", seasons: ["summer", "winter", "monsoon"], whyMatters: "Long walking hours" },
    { item: "ORS / electrolyte", quantity: "4–6", seasons: ["summer", "monsoon"], whyMatters: "Prevents dehydration" },
    { item: "Energy bars", quantity: "5–7", seasons: ["summer", "winter", "monsoon"], whyMatters: "Sustained energy" },
    { item: "Dry fruits / trail mix", quantity: "2 packs", seasons: ["summer", "winter"], whyMatters: "Long-lasting fuel" },
    { item: "Chocolates / glucose", quantity: "2 packs", seasons: ["summer", "winter"], whyMatters: "Quick energy" },
  ],
  personal_care: [
    { item: "Personal medicines", quantity: "As needed", seasons: ["summer", "winter", "monsoon"], whyMatters: "Health safety" },
    { item: "First-aid kit (advanced)", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Injuries at altitude" },
    { item: "AMS medication (if prescribed)", quantity: "As advised", seasons: ["winter"], whyMatters: "Altitude sickness" },
    { item: "Pain relief spray", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Muscle fatigue" },
    { item: "Blister tape / band-aids", quantity: "6–8", seasons: ["summer", "winter", "monsoon"], whyMatters: "Foot protection" },
    { item: "Hand sanitizer", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Hygiene" },
    { item: "Wet wipes", quantity: "1–2 packs", seasons: ["summer", "monsoon"], whyMatters: "Limited water" },
    { item: "Tissue / toilet paper", quantity: "1–2 rolls", seasons: ["summer", "winter", "monsoon"], whyMatters: "Toilets unavailable" },
  ],
  toiletries: [
    { item: "Toothbrush", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Hygiene" },
    { item: "Toothpaste", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Travel size" },
    { item: "Face wash / soap", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Clean skin" },
    { item: "Sunscreen (SPF 40+)", quantity: "1", seasons: ["summer", "winter"], whyMatters: "High-altitude sun" },
    { item: "Lip balm", quantity: "1", seasons: ["winter"], whyMatters: "Prevents cracking" },
    { item: "Small towel", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Personal use" },
  ],
  documents_electronics: [
    { item: "Photo ID", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Verification" },
    { item: "Cash", quantity: "As needed", seasons: ["summer", "winter", "monsoon"], whyMatters: "Remote locations" },
    { item: "Mobile phone", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Navigation & safety" },
    { item: "High-capacity power bank", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Multi-day backup" },
    { item: "Charging cable", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Essential" },
  ],
  trek_essentials: [
    { item: "Trekking poles", quantity: "2", seasons: ["summer", "winter"], whyMatters: "Knee & balance support" },
    { item: "Headlamp (extra batteries)", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Early starts / nights" },
    { item: "Sunglasses case", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Protects lenses" },
    { item: "Garbage bags", quantity: "3–4", seasons: ["summer", "winter", "monsoon"], whyMatters: "Carry back waste ♻️" },
    { item: "Whistle", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Emergency signal" },
  ],
};

const PRO_TREK_GEAR: GearByCategory = {
  backpack_storage: [
    { item: "Backpack (50–60L)", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Carries all expedition gear" },
    { item: "Rain cover", quantity: "1", seasons: ["monsoon", "winter"], whyMatters: "Protects pack from moisture" },
    { item: "Dry bags / stuff sacks", quantity: "4–5", seasons: ["summer", "winter", "monsoon"], whyMatters: "Keeps gear sorted & dry" },
    { item: "Small summit daypack", quantity: "1", seasons: ["summer", "winter"], whyMatters: "For summit pushes" },
  ],
  footwear: [
    { item: "Technical trekking / mountaineering shoes", quantity: "1 pair", seasons: ["summer", "winter", "monsoon"], whyMatters: "Grip on snow, ice & rocks" },
    { item: "Thermal socks", quantity: "2–3 pairs", seasons: ["winter"], whyMatters: "Prevents frostbite" },
    { item: "Regular trekking socks", quantity: "3–4 pairs", seasons: ["summer", "monsoon"], whyMatters: "Daily trekking" },
    { item: "Camp shoes", quantity: "1 pair", seasons: ["summer", "winter"], whyMatters: "Comfort in camps" },
  ],
  clothing_upper: [
    { item: "Quick-dry base layers", quantity: "3–4", seasons: ["summer", "monsoon"], whyMatters: "Sweat management" },
    { item: "Warm fleece / mid-layer", quantity: "2", seasons: ["summer", "winter"], whyMatters: "Layering warmth" },
    { item: "Heavy down jacket", quantity: "1", seasons: ["winter"], whyMatters: "Extreme cold protection" },
    { item: "Windproof & waterproof shell", quantity: "1", seasons: ["monsoon", "winter"], whyMatters: "Storm protection" },
    { item: "Thermal tops", quantity: "2–3", seasons: ["winter"], whyMatters: "High-altitude cold" },
  ],
  clothing_lower: [
    { item: "Trekking pants", quantity: "2–3", seasons: ["summer", "monsoon"], whyMatters: "Long trekking days" },
    { item: "Insulated pants", quantity: "1", seasons: ["winter"], whyMatters: "Extreme cold" },
    { item: "Thermal bottoms", quantity: "2–3", seasons: ["winter"], whyMatters: "Cold nights & mornings" },
    { item: "Camp pants", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Rest comfort" },
  ],
  weather_protection: [
    { item: "Sun cap", quantity: "1", seasons: ["summer"], whyMatters: "UV protection" },
    { item: "Woollen cap / beanie", quantity: "1–2", seasons: ["winter"], whyMatters: "Cold protection" },
    { item: "Balaclava / neck gaiter", quantity: "1", seasons: ["winter"], whyMatters: "Face & neck warmth" },
    { item: "Glacier sunglasses (UV400)", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Snow blindness protection" },
    { item: "Insulated gloves", quantity: "2 pairs", seasons: ["winter"], whyMatters: "One spare in case of wet" },
    { item: "Rain poncho / jacket", quantity: "1", seasons: ["monsoon"], whyMatters: "Monsoon storms" },
  ],
  hydration_food: [
    { item: "Insulated water bottle", quantity: "1", seasons: ["winter"], whyMatters: "Prevents freezing" },
    { item: "Regular water bottles (3L total)", quantity: "1–2", seasons: ["summer", "monsoon"], whyMatters: "Long trekking days" },
    { item: "ORS / electrolytes", quantity: "6–8", seasons: ["summer", "monsoon"], whyMatters: "Dehydration prevention" },
    { item: "Energy bars", quantity: "8–12", seasons: ["summer", "winter", "monsoon"], whyMatters: "Long-hour fuel" },
    { item: "Dry fruits & trail mix", quantity: "2–3 packs", seasons: ["summer", "winter"], whyMatters: "Sustained energy" },
    { item: "Chocolates / glucose", quantity: "2–3 packs", seasons: ["summer", "winter"], whyMatters: "Quick boost" },
  ],
  personal_care: [
    { item: "Personal medicines", quantity: "As needed", seasons: ["summer", "winter", "monsoon"], whyMatters: "Health safety" },
    { item: "Advanced first-aid kit", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Remote medical support" },
    { item: "AMS / altitude meds (doctor advised)", quantity: "As advised", seasons: ["winter"], whyMatters: "Altitude sickness" },
    { item: "Pain relief spray", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Muscle fatigue" },
    { item: "Blister tape & band-aids", quantity: "8–10", seasons: ["summer", "winter", "monsoon"], whyMatters: "Foot protection" },
    { item: "Hand sanitizer", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Hygiene" },
    { item: "Wet wipes", quantity: "2 packs", seasons: ["summer", "monsoon"], whyMatters: "Limited water" },
    { item: "Tissue / toilet paper", quantity: "2 rolls", seasons: ["summer", "winter", "monsoon"], whyMatters: "Toilets unavailable" },
  ],
  toiletries: [
    { item: "Toothbrush", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Hygiene" },
    { item: "Toothpaste", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Travel size" },
    { item: "Face wash / soap", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Clean skin" },
    { item: "Sunscreen (SPF 50+)", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Strong UV at altitude" },
    { item: "Lip balm", quantity: "1", seasons: ["winter"], whyMatters: "Prevents cracking" },
    { item: "Small towel", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Personal use" },
  ],
  documents_electronics: [
    { item: "Photo ID", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Verification" },
    { item: "Cash", quantity: "As needed", seasons: ["summer", "winter", "monsoon"], whyMatters: "No ATMs in remote areas" },
    { item: "Mobile phone", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Safety & navigation" },
    { item: "High-capacity power bank", quantity: "1–2", seasons: ["summer", "winter", "monsoon"], whyMatters: "Multi-day backup" },
    { item: "Charging cables", quantity: "1–2", seasons: ["summer", "winter", "monsoon"], whyMatters: "Essential" },
  ],
  trek_essentials: [
    { item: "Trekking poles", quantity: "2", seasons: ["summer", "winter"], whyMatters: "Stability on steep terrain" },
    { item: "Crampons / microspikes", quantity: "1 set", seasons: ["winter"], whyMatters: "Ice & snow grip" },
    { item: "Snow gaiters", quantity: "1 pair", seasons: ["winter"], whyMatters: "Keeps snow out" },
    { item: "Headlamp (extra batteries)", quantity: "1", seasons: ["summer", "winter"], whyMatters: "Night & summit pushes" },
    { item: "Emergency whistle", quantity: "1", seasons: ["summer", "winter", "monsoon"], whyMatters: "Rescue signal" },
    { item: "Garbage bags", quantity: "3–4", seasons: ["summer", "winter", "monsoon"], whyMatters: "Carry back waste ♻️" },
  ],
};

const TREK_GEAR_BY_DIFFICULTY: Record<TrekDifficulty, GearByCategory> = {
  EASY: EASY_TREK_GEAR,
  MODERATE: MODERATE_TREK_GEAR,
  DIFFICULT: DIFFICULT_TREK_GEAR,
  PRO: PRO_TREK_GEAR,
};

export const getTrekGear = (difficulty: TrekDifficulty): GearByCategory =>
  TREK_GEAR_BY_DIFFICULTY[difficulty] ?? EASY_TREK_GEAR;
