import { CarouselSection } from "@/components/shared/carousel-section";
import { TrekCard } from "@/components/shared/trek-card";
import { MOCK_FEATURED_TREKS } from "@/lib/featured-treks-mock";

export function FeaturedTreks() {
  return (
    <CarouselSection title="Featured Treks" subtitle="Handpicked Treks for the Ultimate Experience">
      {MOCK_FEATURED_TREKS.map((trek) => (
        <TrekCard
          key={trek.id}
          {...trek}
          className="shrink-0 snap-start w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
        />
      ))}
    </CarouselSection>
  );
}
