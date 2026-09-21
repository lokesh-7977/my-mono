"use client";
import Image from "next/image";

interface TrekGalleryProps {
    title: string;
    rating: number;
    reviewsCount: string;
    location: string;
    images: string[];
    quote?: string;
    tag?: string;
}

export function PackageGallery({
    title = "Kashmir Great Lakes Trek",
    images = [
        "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
        "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
        "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
        "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
        "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp",
    ],
    quote = "A walking dream through heaven in Kashmir",
    tag = "Beginner Friendly"
}: Partial<TrekGalleryProps>) {
    return (
        <section className="w-full">
            <div className="w-full">

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_220px] md:grid-rows-2 gap-4 md:aspect-video">
                    {/* Main Large Image */}
                    <div className="col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto">
                        <Image
                            src={images[0]}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute bottom-6 left-6 right-6">
                            {quote && (
                                <p className="text-white text-xl md:text-2xl font-semibold mb-3 drop-shadow-md">
                                    &quot;{quote}&quot;
                                </p>
                            )}
                            {tag && (
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-primary text-xs font-medium">
                                    {tag}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Small Images */}
                    <div className="relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto">
                        <Image
                            src={images[1]}
                            alt={`${title} view 2`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    <div className="relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto cursor-pointer">
                        <Image
                            src={images[2]}
                            alt={`${title} view 3`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">+14 More</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
