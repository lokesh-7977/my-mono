import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { MagicMountainIcon } from "../icons";

interface DifficultyLevel {
    level: number;
    title: string;
    subtitle: string;
    img: string;
}

const difficulties: DifficultyLevel[] = [
    {
        level: 1,
        title: "Easy",
        subtitle: "Under 3000m",
        img: "https://www.scoutripper.com/img/treks/grade/easy.png",
    },
    {
        level: 2,
        title: "Moderate",
        subtitle: "3000m - 4500m",
        img: "https://www.scoutripper.com/img/treks/grade/moderate.png",
    },
    {
        level: 3,
        title: "Difficult",
        subtitle: "Over 4500m",
        img: "https://www.scoutripper.com/img/treks/grade/difficult.png",
    },
    {
        level: 4,
        title: "Pro",
        subtitle: "Under 3000m", // Kept exactly as shown in reference design
        img: "https://www.scoutripper.com/img/treks/grade/pro.png",
    },
];

export function DifficultySelector() {
    return (
        <section
            className="w-full mx-auto max-w-[1540px] overflow-hidden bg-cover xl:bg-contain  bg-bottom mt-10 bg-no-repeat"
            style={{ backgroundImage: 'url("/trek-category-bg.png")' }}
        >
            <div className="w-full max-w-[1064px] mx-auto py-16 max-[1100]:px-4 text-center">

                {/* Headings */}
                <div className="flex flex-col items-center mb-10">
                    <span
                        className="text-lg text-primary mb-3"
                        style={{ fontFamily: "'Pacifico', cursive" }}
                    >
                        find Your Perfect Trek
                    </span>
                    <h2 className="text-3xl font-bold text-foreground mb-3">
                        Choose Your Trek Difficulty
                    </h2>
                    <p className="text-slate-500 text-base leading-relaxed">
                        From beginner-friendly trails to extreme Himalayan expeditions - explore treks based on your fitness, altitude readiness, and adventure goals.
                        <br className="hidden md:block" />
                        {" "}Select a difficulty level to instantly discover curated treks that match your capability.
                    </p>
                </div>

                {/* Grid of Cards */}
                <div className="flex w-full justify-start gap-4 mb-12 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                    {difficulties.map((diff) => (
                        <Link
                            key={diff.level}
                            href={`/treks?difficulty=${diff.title.toLowerCase()}`}
                            className="group bg-white rounded-2xl flex gap-3 flex-col items-center justify-center shadow-[0px_4px_12px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 h-[194px] w-[200px] shrink-0"
                        >
                            {/* Image Container */}
                            <div className="w-[82px] h-[76px] rounded-xl overflow-hidden relative transition-transform group-hover:-translate-y-1">
                                <Image
                                    src={diff.img}
                                    alt={`${diff.title} difficulty`}
                                    fill
                                    className="object-cover rounded-xl"
                                    sizes="82px"
                                    quality={50}
                                />
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <h3 className="text-base leading-none font-bold text-foreground">
                                    {diff.title}
                                </h3>
                                <p className="text-xs font-medium text-zinc-400 whitespace-nowrap">
                                    {diff.subtitle}
                                </p>
                            </div>
                        </Link>
                    ))}

                    {/* Compare Treks Card */}
                    <Link
                        href="/compare"
                        className="group rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-lg transition-all duration-300 relative flex flex-col items-center justify-end h-[194px] w-[200px] shrink-0"
                    >
                        <Image
                            src="https://www.scoutripper.com/img/features/compare-treks-light-img.png"
                            alt="Compare Treks"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 50vw, 20vw"
                        />

                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-linear-to-t from-primary via-primary/80 to-primary/5" />

                        <h3 className="text-lg font-semibold text-white relative z-10 p-4">
                            Compare Treks
                        </h3>
                    </Link>
                </div>

                {/* Action Button */}
                <div className="flex justify-center mb-8">
                    <Button
                        // size="lg"
                        className="bg-linear-to-r from-primary to-magic-green text-white rounded-[10px] px-5 py-6 text-sm font-semibold cursor-pointer flex items-center justify-center gap-3 transition-opacity shadow-sm"
                    >
                        <MagicMountainIcon className="size-5" color="white" />
                        Ask Trek Genie
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
