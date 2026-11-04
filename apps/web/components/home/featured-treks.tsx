import { SectionHeader } from "@/components/shared/section-header";
import { TrekCard } from "@/components/shared/trek-card";
import { MOCK_FEATURED_TREKS } from "@/lib/featured-treks-mock";

export function FeaturedTreks() {
  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <SectionHeader
        title="Featured Treks"
        subtitle="Handpicked Treks for the Ultimate Experience"
        actionType="button"
        buttonText="View all"
        buttonHref="/treks"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_FEATURED_TREKS.map((trek, index) => (
          <TrekCard key={trek.id} {...trek} priority={index < 2} />
        ))}
      </div>
    </section>
  );
}
