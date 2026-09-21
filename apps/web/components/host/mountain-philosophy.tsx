import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";

export function MountainPhilosophy() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Left Content */}
                <div className="order-2 lg:order-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-4">
                        THE MANIFESTO
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                        Our Mountain Philosophy
                    </h2>

                    <div className="space-y-6 mb-10 text-2xl text-foreground font-medium font-lato">
                        <p className="italic">
                            &quot;We believe trekking is a tool to transform human beings. It&apos;s not just about reaching the summit; it&apos;s about the journey of self-discovery that happens between the base camp and the peak.&quot;
                        </p>
                        <p>
                            Our mission is to bring out the spirit of exploration in everyone. We do this by making the most remote corners of the Himalayas accessible, without compromising on the raw, untamed beauty of the wilderness.
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        className="rounded-xl group h-12 px-5 text-base font-semibold cursor-pointer"
                    >
                        <span className="leading-none">Read More</span>
                        <ArrowRight className="ml-1 size-4.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                {/* Right Image */}
                <div className="order-1 lg:order-2">
                    <div className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5">
                        <Image
                            src="/images/mountain-philosophy.png"
                            alt="Mountain Philosophy Illustration"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
