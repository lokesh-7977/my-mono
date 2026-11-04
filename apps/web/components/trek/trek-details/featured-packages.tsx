import { CarouselSection } from "@/components/shared/carousel-section";
import { PackageCard } from "@/components/shared/package-card";

const featuredPackagesList = [
  {
    id: "1",
    slug: "hampta-pass-trek",
    title: "Manali: Hampta Pass Trek with Travel Leaders",
    image: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
    durationDays: 5,
    distanceKm: 28,
    maxAltitudeFt: 14000,
    rating: 4.8,
    price: 6500,
    guideName: "Rishabh Singh",
    guideAvatarUrl: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: "2",
    slug: "kashmir-great-lakes-trek",
    title: "Sonamarg: Kashmir Great Lakes Trek with Travel Leaders",
    image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
    durationDays: 7,
    distanceKm: 72,
    maxAltitudeFt: 13750,
    rating: 4.9,
    price: 15500,
    guideName: "Aditi Rao",
    guideAvatarUrl: "https://i.pravatar.cc/100?img=32",
  },
  {
    id: "3",
    slug: "triund-trek",
    title: "McLeod Ganj: Triund Trek with Travel Leaders",
    image: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
    durationDays: 2,
    distanceKm: 14,
    maxAltitudeFt: 9350,
    rating: 4.6,
    price: 1500,
    guideName: "Karan Mehta",
    guideAvatarUrl: "https://i.pravatar.cc/100?img=14",
  },
  {
    id: "4",
    slug: "kedarnath-dham",
    title: "Gaurikund: Kedarnath Dham with Travel Leaders",
    image: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
    durationDays: 5,
    distanceKm: 32,
    maxAltitudeFt: 11755,
    rating: 4.9,
    price: 8500,
    guideName: "Priya Nair",
    guideAvatarUrl: "https://i.pravatar.cc/100?img=47",
  },
  {
    id: "5",
    slug: "kedarnath-dham",
    title: "Gaurikund: Kedarnath Dham with Travel Leaders",
    image: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
    durationDays: 5,
    distanceKm: 32,
    maxAltitudeFt: 11755,
    rating: 4.9,
    price: 8500,
    guideName: "Rishabh Singh",
    guideAvatarUrl: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: "6",
    slug: "triund-trek",
    title: "McLeod Ganj: Triund Trek with Travel Leaders",
    image: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
    durationDays: 2,
    distanceKm: 14,
    maxAltitudeFt: 9350,
    rating: 4.6,
    price: 1500,
    guideName: "Aditi Rao",
    guideAvatarUrl: "https://i.pravatar.cc/100?img=32",
  },
  {
    id: "7",
    slug: "hampta-pass-trek",
    title: "Manali: Hampta Pass Trek with Travel Leaders",
    image: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
    durationDays: 5,
    distanceKm: 28,
    maxAltitudeFt: 14000,
    rating: 4.8,
    price: 6500,
    guideName: "Karan Mehta",
    guideAvatarUrl: "https://i.pravatar.cc/100?img=14",
  },
  {
    id: "8",
    slug: "kashmir-great-lakes-trek",
    title: "Sonamarg: Kashmir Great Lakes Trek with Travel Leaders",
    image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
    durationDays: 7,
    distanceKm: 72,
    maxAltitudeFt: 13750,
    rating: 4.9,
    price: 15500,
    guideName: "Priya Nair",
    guideAvatarUrl: "https://i.pravatar.cc/100?img=47",
  },
];

export function FeaturedPackages() {
  return (
    <CarouselSection title="Featured Packages">
      {featuredPackagesList.map((pkg, index) => (
        <PackageCard className="w-73.75 shrink-0" key={pkg.id} {...pkg} priority={index < 2} />
      ))}
    </CarouselSection>
  );
}
