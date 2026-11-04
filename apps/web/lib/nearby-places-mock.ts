// TEMPORARY: stands in for the dynamic Location-proximity lookup described in
// apps/docs/nearby-places-dynamic-lookup-checklist.md. A "nearby place" isn't
// its own content type — it's just another admin-logged Location, surfaced
// here because it's near whatever Location the current page/trek is about.
// The same list is shown everywhere for now; ratings are placeholders with
// no backend equivalent (see the checklist doc).
export interface NearbyPlace {
  id: string;
  name: string;
  location: string;
  slug: string;
  image: string;
  rating: number;
}

const CDN = "https://images.scoutripper.com/locations";

export const MOCK_NEARBY_PLACES: NearbyPlace[] = [
  { id: "manali", name: "Manali", location: "Himachal Pradesh", slug: "himachal-pradesh", image: `${CDN}/manali/manali.png`, rating: 4.8 },
  { id: "solang-valley", name: "Solang Valley", location: "Himachal Pradesh", slug: "himachal-pradesh", image: `${CDN}/solang-valley/solang-valley.png`, rating: 4.7 },
  { id: "dehradun", name: "Dehradun", location: "Uttarakhand", slug: "uttarakhand", image: `${CDN}/dehradun/dehradun.png`, rating: 4.6 },
  { id: "dharamkot", name: "Dharamkot", location: "Himachal Pradesh", slug: "himachal-pradesh", image: `${CDN}/dharamkot/dharamkot.png`, rating: 4.7 },
  { id: "chamba", name: "Chamba", location: "Himachal Pradesh", slug: "himachal-pradesh", image: `${CDN}/chamba/chamba.png`, rating: 4.5 },
  { id: "bhagsu-nag-temple", name: "Bhagsu Nag Temple", location: "Himachal Pradesh", slug: "himachal-pradesh", image: `${CDN}/bhagsu-nag-temple/bhagsu-nag-temple.png`, rating: 4.6 },
  { id: "bhagsu-nag-waterfall", name: "Bhagsu Nag Waterfall", location: "Himachal Pradesh", slug: "himachal-pradesh", image: `${CDN}/bhagsu-nag-waterfall/bhagsu-nag-waterfall.png`, rating: 4.7 },
  { id: "leh", name: "Leh", location: "Ladakh", slug: "ladakh", image: `${CDN}/leh/leh.jpg`, rating: 4.9 },
];
