import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Metadata } from "next";
import Breadcrumb from "@/components/shared/breadcrumb";
import { TrekStats } from "@/components/trek/trek-details/trek-stats";
import { TrekContent } from "@/components/trek/trek-details/trek-content";
import StickySidebar from "@/components/shared/sticky-sidebar";
import { TrekItinerary } from "@/components/trek/trek-details/trek-itinerary";
import TrekHighlights from "@/components/trek/trek-details/trek-highlights";
import { FeaturedPackages } from "@/components/trek/trek-details/featured-packages";
import { TrekInfoSections } from "@/components/trek/trek-details/trek-info-sections";
import { FitnessSafetySections } from "@/components/trek/trek-details/fitness-safety-sections";
import Divider from "@repo/ui/components/divider";
import { FaqMission } from "@/components/home/faq-mission";
import { FeaturedTreks } from "@/components/trek/trek-details/featured-treks";
import BookingCTA from "@/components/trek/trek-details/booking-cta";
import NeedHelpCard from "@/components/shared/need-help-card";
import { TrekGallery } from "@/components/trek/trek-gallery";
import { NearbyPlaces } from "@/components/shared/nearby-places";
import { MOCK_NEARBY_PLACES } from "@/lib/nearby-places-mock";
import { getLocationAncestorCrumbs } from "@/lib/location-ancestor-mock";
import { getTrekBySlug } from "@/api/trek/trek.api";

interface TrekPageProps {
    params: Promise<{ trekSlug: string }>;
}

// Without this, Next treats the route as fully static (no dynamic APIs used)
// and serves the first-ever render forever — trek content edited later (by
// an admin, or this session's seed scripts) would never show up.
export const revalidate = 300;

export async function generateMetadata({ params }: TrekPageProps): Promise<Metadata> {
    const { trekSlug } = await params;
    const trek = await getTrekBySlug(trekSlug);

    if (!trek) {
        return {
            title: "Trek not found | Scoutripper",
        };
    }

    return {
        title: `${trek.name} | Scoutripper`,
        description: trek.shortDescription ?? trek.description,
    };
}

export default async function TrekPage({ params }: TrekPageProps) {
    const { trekSlug } = await params;
    const trek = await getTrekBySlug(trekSlug);

    if (!trek) {
        notFound();
    }

    const galleryImages = Array.from(
        new Set([trek.coverImageUrl, ...trek.galleryImages].filter(Boolean)),
    ) as string[];

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <main>
                <Breadcrumb
                    items={[
                        { label: "Treks", href: "/treks" },
                        ...getLocationAncestorCrumbs(trek.location),
                        { label: trek.name },
                    ]}
                    backHref="/treks"
                    backLabel="All Treks"
                />
                <TrekGallery
                    title={trek.name}
                    location={trek.location.name}
                    images={galleryImages.length > 0 ? galleryImages : undefined}
                    quote={trek.tagline ?? undefined}
                    tag={trek.beginnerFriendly ? "Beginner Friendly" : undefined}
                />

                <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_400px] gap-10 lg:gap-12 mt-7">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <TrekStats
                                durationDays={trek.durationDays}
                                distinctRoutes={trek.distinctRoutes}
                                maxAltitude={trek.maxAltitude}
                                difficulty={trek.difficulty}
                            />
                            <TrekContent
                                trekName={trek.name}
                                description={trek.overview ?? trek.description}
                                howToReach={trek.howToReach}
                            />
                            <TrekHighlights trekName={trek.name} />
                            <TrekItinerary
                                trekName={trek.name}
                                routes={trek.routes}
                                fallbackImage={trek.coverImageUrl}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <StickySidebar >
                                <BookingCTA startingPrice={trek.startingPrice} currency={trek.currency} />
                                <NeedHelpCard />
                            </StickySidebar>
                        </div>
                    </div>
                </div>
                <Divider className="mt-9.5" />
                <FeaturedPackages />
                <Divider className="mt-9.5" />
                <TrekInfoSections
                    trekName={trek.name}
                    howToReach={trek.howToReach}
                    permitInfo={trek.permitInfo}
                    difficulty={trek.difficulty}
                />
                <FitnessSafetySections
                    trekName={trek.name}
                    fitnessInfo={trek.fitnessInfo}
                    safetyInfo={trek.safetyInfo}
                    difficulty={trek.difficulty}
                />
                <Divider />
                <FaqMission
                    heading={`${trek.name} FAQs`}
                    faqs={trek.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))}
                />
                <Divider />
                <NearbyPlaces places={MOCK_NEARBY_PLACES} />
                <FeaturedTreks />
            </main>
            <Footer />
        </div>
    );
}
