import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Metadata } from "next";
import Breadcrumb from "@/components/shared/breadcrumb";
import StickySidebar from "@/components/shared/sticky-sidebar";
import { PackageGallery } from "@/components/trek/package-details/package-gallery";
import PackageHeader from "@/components/trek/package-details/package-header";
import { PackageStats } from "@/components/trek/package-details/package-stats";
import Divider from "@repo/ui/components/divider";
import PackageIntro from "@/components/trek/package-details/package-intro";
import PackageItinerary from "@/components/trek/package-details/package-itinerary";
import { PackageInfoSections } from "@/components/trek/package-details/package-info-sections";
import { FitnessSafetySections } from "@/components/trek/package-details/fitness-safety-sections";
import BookingWidget from "@/components/trek/package-details/booking-widget";
import { getPackageById } from "@/api/package/package.api";
import { getLocationAncestorCrumbs } from "@/lib/location-ancestor-mock";
import { getAscentDescent } from "@/lib/package-ascent-descent-mock";
import { getGuideProfile } from "@/lib/package-guide-mock";
import { getPackageHighlights } from "@/lib/package-highlights-mock";
import { PackageProvider } from "@/components/trek/package-details/package-provider";
import { NearbyPlaces } from "@/components/shared/nearby-places";
import { MOCK_NEARBY_PLACES } from "@/lib/nearby-places-mock";
import { FeaturedTreks } from "@/components/trek/trek-details/featured-treks";

interface TrekPackagePageProps {
    params: Promise<{ trekSlug: string; packageId: string }>;
}

// Package prices and open dates change as vendors edit them; without this the
// route would be served from its first-ever render indefinitely.
export const revalidate = 300;

export async function generateMetadata({ params }: TrekPackagePageProps): Promise<Metadata> {
    const { packageId } = await params;
    const pkg = await getPackageById(packageId);

    if (!pkg) {
        return {
            title: "Package not found | Scoutripper",
        };
    }

    return {
        title: `${pkg.title ?? pkg.trekInfo.name} | Scoutripper`,
        description: pkg.trekInfo.overview ?? pkg.description ?? undefined,
    };
}

export default async function TrekPackagePage({ params }: TrekPackagePageProps) {
    const { trekSlug, packageId } = await params;
    const pkg = await getPackageById(packageId);

    if (!pkg) {
        notFound();
    }
    const title = pkg.title ?? pkg.trekInfo.name;
    const ascentDescent = getAscentDescent(pkg);
    const guide = getGuideProfile(pkg);
    const galleryImages = Array.from(new Set(pkg.galleryImages.filter(Boolean)));

    const headerBadges = [
        pkg.trekInfo.beginnerFriendly ? "Beginner Friendly" : null,
        pkg.durationDays ? `${pkg.durationDays} days` : null,
        pkg.location?.name ?? null,
    ].filter((badge): badge is string => badge !== null);

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <main>
                <Breadcrumb
                    items={[
                        { label: "Treks", href: "/treks" },
                        ...getLocationAncestorCrumbs(pkg.location),
                        { label: pkg.trekInfo.name, href: `/trek/${trekSlug}` },
                        { label: title },
                    ]}
                    backHref={`/trek/${trekSlug}`}
                    backLabel={pkg.trekInfo.name}
                />
                <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_400px] gap-10 lg:gap-12 mt-7">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <PackageGallery title={title} images={galleryImages} />
                            <PackageHeader title={title} badges={headerBadges} />
                            <PackageStats
                                maxAltitude={pkg.trekInfo.maxAltitude}
                                ascent={ascentDescent ? { distanceKm: ascentDescent.ascentDistanceKm, time: ascentDescent.ascentTime } : null}
                                descent={ascentDescent ? { distanceKm: ascentDescent.descentDistanceKm, time: ascentDescent.descentTime } : null}
                                difficulty={pkg.difficulty ?? undefined}
                            />
                            <Divider />
                            <PackageIntro description={pkg.trekInfo.overview ?? pkg.description ?? ""} />
                            <PackageItinerary
                                packageTitle={title}
                                days={pkg.itineraryDays}
                                fallbackImage={galleryImages[0]}
                            />
                            <PackageInfoSections
                                inclusions={pkg.inclusions}
                                exclusions={pkg.exclusions}
                                highlights={getPackageHighlights(pkg)}
                            />
                            {pkg.trekLeader.name && (
                                <PackageProvider
                                    name={pkg.trekLeader.name}
                                    avatarUrl={pkg.trekLeader.avatarUrl}
                                    badges={guide?.badges}
                                    experienceYears={guide?.experienceYears}
                                    rating={guide?.rating}
                                    reviewCount={guide?.reviewCount}
                                    quote={guide?.quote}
                                />
                            )}
                        </div>
                        <div className="lg:col-span-1">
                            <StickySidebar >
                                <BookingWidget
                                    startingPrice={pkg.startingPrice}
                                    currency={pkg.currency}
                                    schedules={pkg.schedules}
                                />
                            </StickySidebar>
                        </div>
                    </div>
                </div>
                <Divider className="mt-9.5" />
                <FitnessSafetySections
                    trekName={pkg.trekInfo.name}
                    fitnessInfo={pkg.fitnessAndExperienceRequirement ?? pkg.trekInfo.fitnessInfo}
                    difficulty={pkg.difficulty ?? undefined}
                />
                <Divider />
                <NearbyPlaces places={MOCK_NEARBY_PLACES} />
                <FeaturedTreks />
            </main>
            <Footer />
        </div>
    )
}
