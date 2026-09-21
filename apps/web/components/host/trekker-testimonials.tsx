import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Riya Sharma",
        details: "TREKKER, BALI PASS 2023",
        quote: "The Indiahikes experience is transformative. Their focus on Green Trails isn't just marketing; you see it in action. Our trek leader was a walking encyclopedia of Himalayan flora and fauna.",
        image: "/images/testimonial-avatar-1.png",
    },
    {
        name: "Amitav Ghosh",
        details: "TREKKER, GOECHALA 2022",
        quote: "I've trekked with many vendors, but the safety protocols at Indiahikes are unmatched. Carrying an oxygen cylinder and pulse oximeter for every group is standard practice here.",
        image: "/images/testimonial-avatar-2.png",
    },
];

export function TrekkerTestimonials() {
    return (
        <section className="max-w-[1380px] mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-zinc-100 rounded-3xl p-8 flex flex-col h-full"
                    >
                        <div className="flex gap-1 mb-5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="size-5 fill-magic-green text-magic-green"
                                />
                            ))}
                        </div>

                        <p className="text-base text-foreground mb-4 flex-1 font-medium font-lato">
                            {testimonial.quote}
                        </p>

                        <div className="flex items-center gap-5 pt-4">
                            <div className="relative size-14 rounded-full overflow-hidden shrink-0">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-foreground leading-none mb-1.5">
                                    {testimonial.name}
                                </h4>
                                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                                    {testimonial.details}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
