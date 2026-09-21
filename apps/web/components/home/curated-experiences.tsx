"use client";
import { SectionHeader } from "@/components/shared/section-header";

const featuredTreksList = [
  {
    id: "1",
    slug: "hampta-pass-trek",
    title: "Hampta Pass Trek",
    image: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
    location: "Himachal Pradesh",
    durationDays: 5,
    distanceKm: 28,
    maxAltitudeFt: 14000,
    rating: 4.8,
    price: 6500,
    oldPrice: 8500,
  },
  {
    id: "2",
    slug: "kashmir-great-lakes-trek",
    title: "Kashmir Great Lakes Trek",
    image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
    location: "Jammu & Kashmir",
    durationDays: 7,
    distanceKm: 72,
    maxAltitudeFt: 13750,
    rating: 4.9,
    price: 15500,
    oldPrice: 18500,
  },
  {
    id: "3",
    slug: "triund-trek",
    title: "Triund Trek",
    image: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
    location: "Himachal Pradesh",
    durationDays: 2,
    distanceKm: 14,
    maxAltitudeFt: 9350,
    rating: 4.6,
    price: 1500,
    oldPrice: 2000,
  },
  {
    id: "4",
    slug: "kedarnath-dham",
    title: "Kedarnath Dham",
    image: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
    location: "Uttarakhand",
    durationDays: 5,
    distanceKm: 32,
    maxAltitudeFt: 11755,
    rating: 4.9,
    price: 8500,
  },
  {
    id: "5",
    slug: "kedarnath-dham",
    title: "Kedarnath Dham",
    image: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
    location: "Uttarakhand",
    durationDays: 5,
    distanceKm: 32,
    maxAltitudeFt: 11755,
    rating: 4.9,
    price: 8500,
  },
  {
    id: "6",
    slug: "triund-trek",
    title: "Triund Trek",
    image: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
    location: "Himachal Pradesh",
    durationDays: 2,
    distanceKm: 14,
    maxAltitudeFt: 9350,
    rating: 4.6,
    price: 1500,
    oldPrice: 2000,
  },
  {
    id: "7",
    slug: "hampta-pass-trek",
    title: "Hampta Pass Trek",
    image: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
    location: "Himachal Pradesh",
    durationDays: 5,
    distanceKm: 28,
    maxAltitudeFt: 14000,
    rating: 4.8,
    price: 6500,
    oldPrice: 8500,
  },
  {
    id: "8",
    slug: "kashmir-great-lakes-trek",
    title: "Kashmir Great Lakes Trek",
    image: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
    location: "Jammu & Kashmir",
    durationDays: 7,
    distanceKm: 72,
    maxAltitudeFt: 13750,
    rating: 4.9,
    price: 15500,
    oldPrice: 18500,
  },
];

import { useCarouselScroll } from "@/hooks/use-carousel-scroll";
import { TrekCard } from "../shared/trek-card";

export function CuratedExperiences() {
  const { scrollRef, isAtStart, isAtEnd, scrollLeft, scrollRight, checkScrollPosition } = useCarouselScroll(350);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      <SectionHeader
        title="Curated Experiences"
        subtitle="Handpicked Treks for the Ultimate Experience"
        actionType="arrows"
        onPrev={scrollLeft}
        onNext={scrollRight}
        isPrevDisabled={isAtStart}
        isNextDisabled={isAtEnd}
      />

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={checkScrollPosition}
      >
        {featuredTreksList.map((trek, index) => (
          <TrekCard className="w-[326px] shrink-0" key={trek.id} {...trek} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
