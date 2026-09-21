import Image from "next/image";
import { HeartPulse, Radio, Asterisk } from "lucide-react";

const safetyFeatures = [
    {
        title: "Pre-Trek Health Screening",
        description: "Mandatory fitness assessment and altitude acclimation logs for every participant.",
        icon: HeartPulse,
    },
    {
        title: "Satellite Tracking",
        description: "Garmin InReach tracking on all remote expeditions with 24/7 ground support.",
        icon: Radio,
    },
    {
        title: "Evacuation Protocols",
        description: "Contracted helicopter rescue standby and mountain-grade medical oxygen on all 4,000m+ treks.",
        icon: Asterisk,
    },
];

export function SafetyManifesto() {
    return (
        <section className="max-w-[1380px] mx-auto px-4 py-10">
            <div className="bg-zinc-100 rounded-3xl p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
                            Our Safety Manifesto
                        </h2>
                        <p className="text-lg text-foreground italic leading-relaxed mb-8 font-medium font-lato">
                            In the mountains, safety isn&apos;t a checkbox; it&apos;s the foundation of freedom. We maintain an industry-leading guide-to-trekker ratio of 1:5.
                        </p>

                        <div className="space-y-8">
                            {safetyFeatures.map((feature, index) => (
                                <div key={index} className="flex gap-6 items-start">
                                    <div className="size-13 shrink-0 rounded-2xl bg-white flex items-center justify-center shadow-md shadow-black/2">
                                        <feature.icon className="size-5.5 text-primary" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground mb-0.5">
                                            {feature.title}
                                        </h3>
                                        <p className="text-foreground/70 text-sm leading-relaxed font-medium font-lato">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl shadow-black/5">
                        <Image
                            src="/images/safety-manifesto.png"
                            alt="Guides checking safety equipment"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
