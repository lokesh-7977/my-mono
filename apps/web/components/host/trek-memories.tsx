import Image from "next/image";

const memories = [
    { src: "/images/trek-memories-4.png", alt: "Campfire" },
    { src: "/images/trek-memories-1.png", alt: "Sunrise" },
    { src: "/images/trek-memories-4.png", alt: "Campfire" },
    { src: "/images/trek-memories-1.png", alt: "Sunrise" },
    { src: "/images/trek-memories-2.png", alt: "Mountain meadow" },
    { src: "/images/trek-memories-3.png", alt: "Guide story" },
    { src: "/images/trek-memories-2.png", alt: "Mountain meadow" },
    { src: "/images/trek-memories-3.png", alt: "Guide story" },
];

export function TrekMemories() {
    return (
        <section className="w-full max-w-[1380px] mx-auto px-4 py-15">
            <div className="text-center mb-10">
                <span className="text-sm font-bold text-primary-600 uppercase tracking-wider block mb-2 font-lato">
                    COMMUNITY VOICE
                </span>
                <h2 className="text-4xl font-bold text-foreground tracking-tight">
                    Trekker Memories
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {memories.map((memory, index) => (
                    <div
                        key={index}
                        className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <Image
                            src={memory.src}
                            alt={memory.alt}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
