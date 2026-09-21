import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Metadata } from "next";
import Breadcrumb from "@/components/shared/breadcrumb";
import { TrekStats } from "@/components/trek/trek-details/trek-stats";
import { TrekContent } from "@/components/trek/trek-details/trek-content";
import StickySidebar from "@/components/shared/sticky-sidebar";
import { TrekItinerary } from "@/components/trek/trek-details/trek-itinerary";
import TrekHighlights from "@/components/trek/trek-details/trek-highlights";
import { PopularPackages } from "@/components/trek/trek-details/popular-packages";
import { TrekInfoSections } from "@/components/trek/trek-details/trek-info-sections";
import { FitnessSafetySections } from "@/components/trek/trek-details/fitness-safety-sections";
import Divider from "@repo/ui/components/divider";
import { FaqMission } from "@/components/home/faq-mission";
import { CuratedExperiences } from "@/components/home/curated-experiences";
import BookingCTA from "@/components/trek/trek-details/booking-cta";
import NeedHelpCard from "@/components/shared/need-help-card";
import { TrekGallery } from "@/components/trek/trek-gallery";

export const metadata: Metadata = {
    title: "Scoutripper",
    description: "Scoutripper",
};

export default function TrekPage() {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <main>
                <Breadcrumb />
                <TrekGallery />

                <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_400px] gap-10 lg:gap-12 mt-7">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <TrekStats />
                            <TrekContent />
                            <TrekHighlights />
                            <TrekItinerary />
                        </div>
                        <div className="lg:col-span-1">
                            <StickySidebar >
                                <BookingCTA />
                                <NeedHelpCard />
                            </StickySidebar>
                        </div>
                    </div>
                </div>
                <Divider className="mt-9.5" />
                <PopularPackages />
                <Divider className="mt-9.5" />
                <TrekInfoSections />
                <FitnessSafetySections />
                <Divider />
                <FaqMission />
                <Divider />
                <CuratedExperiences />
            </main>
            <Footer />
        </div>
    );
}
