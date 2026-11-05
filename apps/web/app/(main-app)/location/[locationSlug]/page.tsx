import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { CarouselSection } from "@/components/shared/carousel-section";
import { TrekCard } from "@/components/shared/trek-card";
import { BlogInspiration } from "@/components/home/blog-inspiration";
import { LocationHero } from "@/components/location/location-hero";
import { LocationOverview } from "@/components/location/location-overview";
import { LocationBackdrop } from "@/components/location/location-backdrop";
import { LocationHighlights } from "@/components/location/location-highlights";
import { LocationGeneralInfoSection } from "@/components/location/location-general-info";
import { NearbyPlaces } from "@/components/shared/nearby-places";
import { getLocationBySlug } from "@/lib/location-mock";
import { MOCK_FEATURED_TREKS } from "@/lib/featured-treks-mock";
import { MOCK_NEARBY_PLACES } from "@/lib/nearby-places-mock";
import Divider from "@repo/ui/components/divider";

interface LocationPageProps {
  params: Promise<{ locationSlug: string }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { locationSlug } = await params;
  const location = getLocationBySlug(locationSlug);

  if (!location) {
    return { title: "Location not found | Scoutripper" };
  }

  return {
    title: `${location.name} | Scoutripper`,
    description: location.tagline,
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { locationSlug } = await params;
  const location = getLocationBySlug(locationSlug);

  if (!location) {
    notFound();
  }

  // A location can't be "nearby" to itself.
  const nearbyPlaces = MOCK_NEARBY_PLACES.filter((place) => place.slug !== location.slug);

  return (
    <div>
      <Navbar />
      <main>
        <Breadcrumb items={[{ label: location.name }]} />

        <div className="max-w-360 pt-4 px-4 sm:px-6 lg:px-8 mx-auto">
          <LocationHero slug={location.slug} name={location.name} tagline={location.tagline} heroImage={location.heroImage} />
          <LocationOverview name={location.name} whatToKnow={location.whatToKnow} />
          <Divider className="my-6" />
          <LocationBackdrop title={location.backdropTitle} description={location.backdrop} />
          <Divider className="my-6" />
          <LocationHighlights highlights={location.highlights} />
        </div>
        <LocationGeneralInfoSection info={location.generalInfo} />

        <NearbyPlaces places={nearbyPlaces} />

        <CarouselSection title="Most Popular Treks" subtitle="Handpicked Treks for the Ultimate Experience">
          {MOCK_FEATURED_TREKS.map((trek, index) => (
            <TrekCard
              key={trek.id}
              {...trek}
              className="shrink-0 snap-start w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
              priority={index < 2}
            />
          ))}
        </CarouselSection>
        <BlogInspiration />
      </main>
      <Footer />
    </div>
  );
}
