// TEMPORARY: no `/location` detail endpoint exists yet (the live `/location` API is a
// generic country/state/district picker, not this page's content — see
// apps/docs/location-page-checklist.md). This stands in until the backend adds one.

export interface LocationGeneralInfo {
  label: string;
  title: string;
  description: string;
}

export interface LocationExperience {
  id: string;
  slug: string;
  title: string;
  location: string;
  image: string;
  startTime: string;
  durationDays: number;
  price: number;
  oldPrice?: number;
}

export interface LocationData {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  whatToKnow: string;
  backdropTitle: string;
  backdrop: string;
  highlights: { title: string; description: string }[];
  generalInfo: LocationGeneralInfo[];
  experiences: LocationExperience[];
}

const SEEDED_LOCATIONS: Record<string, LocationData> = {
  "himachal-pradesh": {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    tagline: "Broken treks, hidden villages, travel guides, and unforgettable experiences across Himachal Pradesh",
    heroImage: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
    whatToKnow:
      "Himachal Pradesh is a picturesque state nestled in the Himalayas in northern India. It is known for its stunning mountain landscapes, lush valleys, and serene hill stations. The state boasts a rich cultural heritage that blends Hindu and Tibetan Buddhism influence. Himachal Pradesh is a popular destination for nature lovers and adventure enthusiasts, offering trekking, skiing, and mountaineering opportunities.\n\nShimla, the capital city, is famous for its colonial architecture and Mall Road. Other notable places include Manali, Dharamshala, and Dalhousie, each offering unique experiences and breathtaking views of the Himalayan ranges. Himachal Pradesh celebrates vibrant festivals like Dussehra and Losar with great enthusiasm. With its pleasant climate and scenic beauty, Himachal Pradesh is a haven for those seeking respite from the hustle and bustle of city life.",
    backdropTitle: "Backdrop",
    backdrop:
      "Himachal Pradesh, often referred to as the \"Land of the Gods,\" has a rich history rooted in Indian mythology and ancient civilizations. The region was part of the Indus Valley Civilization and later came under the rule of Aryan tribes. Over the medieval period, various dynasties, including the Mauryas, Guptas, and Rajputs, influenced its culture and heritage. After the British annexation in the 19th century, the state became a summer retreat for British officers. Post-independence, Himachal Pradesh was reorganized into a full-fledged state in 1971. The state's history is reflected in its temples, monasteries, colonial architecture, and diverse traditions.",
    highlights: [
      {
        title: "Mesmerizing Landscapes",
        description: "A paradise of towering snow-capped mountains, lush valleys, dense forests, and serene rivers.",
      },
      {
        title: "Adventure Haven",
        description: "Perfect for adventure enthusiasts with activities like trekking, skiing, paragliding, river rafting, and mountaineering.",
      },
      {
        title: "Charming Hill Stations",
        description: "Explore popular hill stations like Shimla, Manali, Dharamshala, and Dalhousie, each offering unique experiences.",
      },
      {
        title: "Spiritual Retreats",
        description: "Home to ancient temples, monasteries, and spiritual centers such as Tibetan Monasteries in McLeodganj, Hidimba Devi Temple, and Baijnath Temple.",
      },
      {
        title: "Rich Cultural Heritage",
        description: "Experience vibrant festivals, traditional Himachali folk music and dance, and warm hospitality.",
      },
    ],
    generalInfo: [
      { label: "01", title: "Climate & Clothing", description: "Pack according to the season. Winters require heavy woolens, while summers need light clothing with a jacket for cool evenings." },
      { label: "02", title: "Altitude Adjustment", description: "If visiting high-altitude areas, allow time for acclimatization." },
      { label: "03", title: "Safety", description: "Carry a first-aid kit, stay hydrated, and inform someone of your itinerary when trekking." },
      { label: "04", title: "Parking", description: "Parking facilities are available at major tourist spots, but they may be limited in small villages or crowded hill towns. Charges vary between ₹20–₹200 depending on the location." },
      { label: "05", title: "Accommodation", description: "Options range from luxury hotels to budget homestays. Government-run guesthouses are also available." },
      { label: "06", title: "Food", description: "Enjoy local delicacies like Siddu, Chana Madra, and Dham, and fresh trout. Vegetarian food is widely available." },
      { label: "07", title: "Transport", description: "Himachal has excellent bus connectivity (HRTC). Taxis and bikes are also available for hire." },
      { label: "08", title: "Network", description: "Major networks (Airtel, Jio, BSNL) work well in towns but might have poor reception in remote areas. Carry a BSNL SIM for better connectivity in rural areas." },
    ],
    experiences: [
      { id: "1", slug: "river-clean-up-drive", title: "River Clean Up Drive", location: "Himachal Pradesh", image: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg", startTime: "09:00", durationDays: 2, price: 2999, oldPrice: 1499 },
      { id: "2", slug: "trek-clean-up-drive-dharamshala", title: "Trek Clean Up Drive Near Dharamshala", location: "Himachal Pradesh", image: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png", startTime: "08:00", durationDays: 2, price: 1699 },
      { id: "3", slug: "short-offbeat-camping-getaway", title: "Short Offbeat Camping Getaway", location: "Himachal Pradesh", image: "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp", startTime: "08:00", durationDays: 1, price: 1499, oldPrice: 2099 },
      { id: "4", slug: "eco-retreat-with-sustainability", title: "Eco Retreat with Sustainability", location: "Himachal Pradesh", image: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png", startTime: "08:00", durationDays: 3, price: 4299, oldPrice: 6999 },
      { id: "5", slug: "himalayan-creative-retreat", title: "Himalayan Creative Retreat", location: "Himachal Pradesh", image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png", startTime: "08:00", durationDays: 5, price: 7999, oldPrice: 9199 },
    ],
  },
};

// Generic placeholder content for regions linked from the homepage (Destinations
// section) that don't have real copy yet. Keeps /location/{slug} from 404ing
// until the backend and content team provide per-region data.
function genericLocation(name: string, slug: string, heroImage: string): LocationData {
  return {
    slug,
    name,
    tagline: `Treks, hidden villages, travel guides, and unforgettable experiences across ${name}`,
    heroImage,
    whatToKnow: `${name} is one of Scoutripper's featured trekking regions, known for its mountain landscapes and trekking routes. Detailed visitor information for this region is being added — check back soon for a full guide covering climate, culture, and things to see.`,
    backdropTitle: "Backdrop",
    backdrop: `A detailed history and backdrop for ${name} is coming soon.`,
    highlights: [
      {
        title: "Trekking Routes",
        description: `${name} is home to a range of trekking routes for different experience levels.`,
      },
    ],
    generalInfo: [
      { label: "01", title: "Climate & Clothing", description: "Pack according to the season and altitude of your specific trek." },
      { label: "02", title: "Safety", description: "Carry a first-aid kit, stay hydrated, and inform someone of your itinerary when trekking." },
      { label: "03", title: "Accommodation", description: "Options range from homestays to campsites, depending on the trek." },
      { label: "04", title: "Network", description: "Reception can be limited in remote areas; carry a reliable SIM where possible." },
    ],
    experiences: [],
  };
}

export const MOCK_LOCATIONS: Record<string, LocationData> = {
  ...SEEDED_LOCATIONS,
  uttarakhand: genericLocation(
    "Uttarakhand",
    "uttarakhand",
    "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
  ),
  "jammu-and-kashmir": genericLocation(
    "Jammu & Kashmir",
    "jammu-and-kashmir",
    "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
  ),
  ladakh: genericLocation(
    "Ladakh",
    "ladakh",
    "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp",
  ),
  nepal: genericLocation("Nepal", "nepal", "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png"),
  "west-bengal": genericLocation(
    "West Bengal",
    "west-bengal",
    "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
  ),
  // District-level pages, linked from trek breadcrumbs (lib/location-ancestor-mock.ts).
  "uttar-kashi": genericLocation(
    "Uttar Kashi",
    "uttar-kashi",
    "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
  ),
  chamoli: genericLocation(
    "Chamoli",
    "chamoli",
    "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
  ),
  kullu: genericLocation(
    "Kullu",
    "kullu",
    "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
  ),
  darjeeling: genericLocation(
    "Darjeeling",
    "darjeeling",
    "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp",
  ),
};

export function getLocationBySlug(slug: string): LocationData | undefined {
  return MOCK_LOCATIONS[slug];
}
