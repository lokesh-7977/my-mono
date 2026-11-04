// TEMPORARY: the same list shows on every trek until the backend can return
// nearby places for a trek. Ratings are placeholders; no source exists yet.
export interface NearbyPlace {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
}

const CDN = "https://images.scoutripper.com/locations";

export const MOCK_NEARBY_PLACES: NearbyPlace[] = [
  { id: "manali", name: "Manali", location: "Himachal Pradesh", image: `${CDN}/manali/manali.png`, rating: 4.8 },
  { id: "solang-valley", name: "Solang Valley", location: "Himachal Pradesh", image: `${CDN}/solang-valley/solang-valley.png`, rating: 4.7 },
  { id: "dehradun", name: "Dehradun", location: "Uttarakhand", image: `${CDN}/dehradun/dehradun.png`, rating: 4.6 },
  { id: "dharamkot", name: "Dharamkot", location: "Himachal Pradesh", image: `${CDN}/dharamkot/dharamkot.png`, rating: 4.7 },
  { id: "chamba", name: "Chamba", location: "Himachal Pradesh", image: `${CDN}/chamba/chamba.png`, rating: 4.5 },
  { id: "bhagsu-nag-temple", name: "Bhagsu Nag Temple", location: "Himachal Pradesh", image: `${CDN}/bhagsu-nag-temple/bhagsu-nag-temple.png`, rating: 4.6 },
  { id: "bhagsu-nag-waterfall", name: "Bhagsu Nag Waterfall", location: "Himachal Pradesh", image: `${CDN}/bhagsu-nag-waterfall/bhagsu-nag-waterfall.png`, rating: 4.7 },
  { id: "leh", name: "Leh", location: "Ladakh", image: `${CDN}/leh/leh.jpg`, rating: 4.9 },
];
