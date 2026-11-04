"use client";
import { SectionHeader } from "@/components/shared/section-header";

import { useCarouselScroll } from "@/hooks/use-carousel-scroll";
import { TrekCard } from "../shared/trek-card";
import { MOCK_FEATURED_TREKS } from "@/lib/featured-treks-mock";

export function CuratedExperiences() {
  const { scrollRef, isAtStart, isAtEnd, scrollLeft, scrollRight, checkScrollPosition } = useCarouselScroll(350);

  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
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
        {MOCK_FEATURED_TREKS.map((trek, index) => (
          <TrekCard className="w-81.5 shrink-0" key={trek.id} {...trek} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
