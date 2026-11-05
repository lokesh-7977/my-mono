"use client";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import GalleryModal, { useGalleryModal } from "@/components/shared/gallery-modal";

interface PackageGalleryProps {
    title: string;
    images: string[];
}

export function PackageGallery({ title, images }: PackageGalleryProps) {
    const { props: galleryProps, openGallery } = useGalleryModal(images);

    if (images.length === 0) return null;

    return (
        <section className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_220px] md:grid-rows-2 gap-4 md:aspect-video">
                {/* Main Large Image */}
                <button
                    onClick={() => openGallery(0)}
                    className="cursor-pointer col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto"
                >
                    <Image
                        src={images[0]!}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                    />
                </button>

                {/* Small Images */}
                {images[1] && (
                    <button
                        onClick={() => openGallery(1)}
                        className="cursor-pointer relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto"
                    >
                        <Image
                            src={images[1]}
                            alt={`${title} view 2`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </button>
                )}

                {images[2] && (
                    <button
                        onClick={() => openGallery(2)}
                        className="cursor-pointer relative rounded-2xl overflow-hidden group aspect-4/3 md:aspect-auto"
                    >
                        <Image
                            src={images[2]}
                            alt={`${title} view 3`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span
                            role="button"
                            aria-label="View all photos"
                            onClick={(e) => {
                                e.stopPropagation();
                                openGallery(0, true);
                            }}
                            className="cursor-pointer absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-md bg-white text-foreground shadow-lg transition-colors hover:bg-zinc-50"
                        >
                            <ImageIcon className="size-4" />
                        </span>
                    </button>
                )}
            </div>

            <GalleryModal {...galleryProps} title={title} />
        </section>
    );
}
