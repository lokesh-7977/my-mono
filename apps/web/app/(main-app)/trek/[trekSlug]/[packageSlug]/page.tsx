import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Metadata } from "next";
import Breadcrumb from "@/components/shared/breadcrumb";
import StickySidebar from "@/components/shared/sticky-sidebar";
import { PackageGallery } from "@/components/trek/package-details/package-gallery";
import PackageHeader from "@/components/trek/package-details/package-header";
import { TrekStats } from "@/components/trek/trek-details/trek-stats";
import Divider from "@repo/ui/components/divider";
import PackageIntro from "@/components/trek/package-details/package-intro";
import PackageItinerary from "@/components/trek/package-details/package-itinerary";
import { PackageInfoSections } from "@/components/trek/package-details/package-info-sections";
import { FitnessSafetySections } from "@/components/trek/package-details/fitness-safety-sections";
import { FaqMission } from "@/components/home/faq-mission";
import { CuratedExperiences } from "@/components/home/curated-experiences";
import BookingWidget from "@/components/trek/package-details/booking-widget";

export const metadata: Metadata = {
    title: "Scoutripper",
    description: "Scoutripper",
};

export default function TrekPackagePage() {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <main>
                <Breadcrumb />
                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_400px] gap-10 lg:gap-12 mt-7">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <PackageGallery />
                            <PackageHeader />
                            <TrekStats />
                            <Divider />
                            <PackageIntro />
                            <PackageItinerary />
                            <PackageInfoSections />
                        </div>
                        <div className="lg:col-span-1">
                            <StickySidebar >
                                <BookingWidget />
                            </StickySidebar>
                        </div>
                    </div>
                </div>
                <Divider className="mt-9.5" />
                <FitnessSafetySections />
                <Divider />
                <FaqMission />
                <Divider />
                <CuratedExperiences />
            </main>
            <Footer />
        </div>
    )
}