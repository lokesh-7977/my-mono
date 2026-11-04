"use client";
import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const testimonials = [
  {
    id: "1",
    name: "Arya Sharma",
    trek: "Kashmir Great Lakes",
    text: "An absolutely magical experience. The guides were incredibly professional and the views were breathtaking. Best decision ever!",
    rating: 5,
    img: "https://images.scoutripper.com/pages/homepage/maggie.webp",
    isVideo: true,
  },
  {
    id: "2",
    name: "Rohan Verma",
    trek: "Hampta Pass",
    text: "From start to finish, Scoutripper handled everything perfectly. The food at the campsites was surprisingly good too!",
    rating: 5,
    img: "https://images.scoutripper.com/pages/homepage/liz.webp",
    isVideo: true,
  },
  {
    id: "3",
    name: "Meera Patel",
    trek: "Kedarnath Dham",
    text: "A deeply spiritual and well-organized yatra. The team ensured our safety and comfort every step of the way.",
    rating: 4.8,
    img: "https://images.scoutripper.com/pages/homepage/cody.webp",
    isVideo: true,
  },
  {
    id: "4",
    name: "Aman Singh",
    trek: "Triund Trek",
    text: "My first Himalayan trek and it couldn't have been better. Great community and an easy-paced itinerary.",
    rating: 5,
    img: "https://images.scoutripper.com/pages/homepage/marta.webp",
    isVideo: true,
  },
  {
    id: "5",
    name: "Aman Singh",
    trek: "Triund Trek",
    text: "My first Himalayan trek and it couldn't have been better. Great community and an easy-paced itinerary.",
    rating: 5,
    img: "https://images.scoutripper.com/pages/homepage/marta.webp",
    isVideo: true,
  },
  {
    id: "6",
    name: "Aman Singh",
    trek: "Triund Trek",
    text: "My first Himalayan trek and it couldn't have been better. Great community and an easy-paced itinerary.",
    rating: 5,
    img: "https://images.scoutripper.com/pages/homepage/marta.webp",
    isVideo: true,
  },
];

import { useCarouselScroll } from "@/hooks/use-carousel-scroll";

export function Testimonials() {
  const { scrollRef, isAtStart, isAtEnd, scrollLeft, scrollRight, checkScrollPosition } = useCarouselScroll(350);

  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      <SectionHeader
        title="Hear From Fellow Trekkers"
        subtitle="Real stories from our community of adventurers"
        actionType="arrows"
        onPrev={scrollLeft}
        onNext={scrollRight}
        isPrevDisabled={isAtStart}
        isNextDisabled={isAtEnd}
      />

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={checkScrollPosition}
      >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex-none group cursor-pointer w-64 h-80 snap-start bg-white rounded-2xl shadow-raised border border-zinc-100 flex flex-col"
          >
            {/* Media Area */}
            <div className="size-full rounded-2xl overflow-hidden relative">
              <Image
                src={t.img}
                alt={`Testimonial from ${t.name}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 300px, 350px"
              />
              {t.isVideo && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white/90" />
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
