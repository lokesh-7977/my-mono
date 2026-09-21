import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { CuratorHeader } from "@/components/host/curator-header";
import { CertificationsSection } from "@/components/host/certifications-section";
import { MountainPhilosophy } from "@/components/host/mountain-philosophy";
import Divider from "@/components/ui/divider";
import { CuratedExperiences } from "@/components/home/curated-experiences";
import { SafetyManifesto } from "@/components/host/safety-manifesto";
import { TrekMemories } from "@/components/host/trek-memories";
import { TrekkerTestimonials } from "@/components/host/trekker-testimonials";

export default function HostPage() {
    return (
        <div>
            <Navbar />
            <main>
                <CuratorHeader />
                <CertificationsSection />
                <MountainPhilosophy />
                <Divider className="mt-20" />
                <CuratedExperiences />
                <SafetyManifesto />
                <TrekMemories />
                <TrekkerTestimonials />
            </main>
            <Footer />
        </div>
    );
}
