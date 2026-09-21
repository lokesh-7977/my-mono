"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/shared/section-header";

import { useCarouselScroll } from "@/hooks/use-carousel-scroll";

const categories = [
  {
    id: "trekking",
    title: "Trekking",
    subtitle: "Scenic Himalayan Trails",
    img: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
  },
  {
    id: "weekend-escapes",
    title: "Weekend Escapes",
    subtitle: "Quick Mountain Getaways",
    img: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
  },
  {
    id: "nature-outdoor",
    title: "Nature & Outdoor",
    subtitle: "Into The Wild",
    img: "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp",
  },
  {
    id: "glacier-trek",
    title: "Glacier Trek",
    subtitle: "Ice & Alpine Adventures",
    img: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
  },
  {
    id: "pass-crossing",
    title: "Pass Crossing",
    subtitle: "High-Altitude Crossovers",
    img: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
  },
  {
    id: "expeditions",
    title: "Expeditions",
    subtitle: "Extreme Summit Challenges",
    img: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
  },
  {
    id: "pilgrimage",
    title: "Expeditions",
    subtitle: "Extreme Summit Challenges",
    img: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
  },
  {
    id: "skills",
    title: "Expeditions",
    subtitle: "Extreme Summit Challenges",
    img: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
  },
];

export function ExploreCategories() {
  const { scrollRef, isAtStart, isAtEnd, checkScrollPosition, scrollLeft, scrollRight } = useCarouselScroll(300);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        title="Explore. Experience. Evolve."
        subtitle="Adventure with purpose — explore nature, culture, and conscious travel experiences."
        actionType="arrows"
        onPrev={scrollLeft}
        onNext={scrollRight}
        isPrevDisabled={isAtStart}
        isNextDisabled={isAtEnd}
      />

      <div
        ref={scrollRef}
        onScroll={checkScrollPosition}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-none w-[280px] snap-start group cursor-pointer"
          >
            <div className="w-full h-[180px] rounded-2xl overflow-hidden mb-4 relative">
              <Image
                src={category.img}
                alt={category.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="280px"
              />
            </div>
            <h3 className="text-[17px] font-bold text-zinc-800 mb-2">
              {category.title}
            </h3>
            <span className="inline-block bg-[#4EC5C1]/10 text-[#4EC5C1] text-xs font-bold px-3 py-1.5 rounded-full">
              {category.subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
