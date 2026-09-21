import Image from "next/image";

export function CuratorHeader() {
    return (
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Left side: Avatar */}
                <div className="w-full max-w-[480px] shrink-0">
                    <div className="relative aspect-9/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                        <Image
                            src="/images/curator-portrait.png"
                            alt="Curator Portrait"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Right side: Content */}
                <div className="flex-1 flex flex-col justify-center h-full pt-4 md:pt-0">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="bg-magic-green text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">
                            VERIFIED CURATOR
                        </span>
                        <span className="text-foreground/50 text-xs font-semibold font-lato">
                            EST. 2008
                        </span>
                    </div>

                    <h1 className="text-6xl font-extrabold text-foreground mb-3">
                        Indiahikes
                    </h1>

                    <p className="text-2xl text-foreground/80 italic mb-10 font-semibold font-lato">
                        Pioneering the trekking revolution in India through exploration, documentation, and a deep sense of environmental stewardship.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {/* Safety Score */}
                        <div className="bg-zinc-100 p-6 rounded-3xl">
                            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wide block mb-2">
                                SAFETY SCORE
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-foreground">9.4</span>
                                <span className="text-foreground/30 font-bold">/10</span>
                            </div>
                        </div>

                        {/* Eco Score */}
                        <div className="bg-magic-green/10 p-6 rounded-3xl">
                            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wide block mb-2">
                                ECO SCORE
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-magic-green">9.4</span>
                                <span className="text-foreground/30 font-bold">/10</span>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-zinc-100 p-6 rounded-3xl">
                            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wide block mb-2">
                                REVIEWS
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-foreground">12k+</span>
                            </div>
                        </div>

                        {/* Certified Guides */}
                        <div className="bg-zinc-100 p-6 rounded-3xl">
                            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wide block mb-2">
                                CERTIFIED GUIDES
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-foreground">140</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
