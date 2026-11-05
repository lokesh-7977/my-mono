"use client";
import Image from "next/image";

interface PackageGalleryProps {
    title: string;
    images: string[];
    quote?: string;
    tag?: string;
}

export function PackageGallery({ title, images, quote, tag }: PackageGalleryProps) {
    if (images.length === 0) return null;

    const remaining = images.length - 3;

    return (
        <section className="w-full">
            <div className="w-full">

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_220px] md:grid-rows-2 gap-4 md:aspect-video">
                    {/* Main Large Image */}
                    <div className="col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto">
                        <Image
                            src={images[0]!}
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
                    {images[1] && (
                        <div className="relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto">
                            <Image
                                src={images[1]}
                                alt={`${title} view 2`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    )}

                    {images[2] && (
                        <div className="relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto cursor-pointer">
                            <Image
                                src={images[2]}
                                alt={`${title} view 3`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {remaining > 0 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">+{remaining} More</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
