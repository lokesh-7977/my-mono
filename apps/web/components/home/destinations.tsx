"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";

const destinations = [
  {
    id: "himachal",
    slug: "himachal-pradesh",
    region: "Himachal Pradesh",
    img: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
  },
  {
    id: "uttarakhand",
    slug: "uttarakhand",
    region: "Uttarakhand",
    img: "https://images.scoutripper.com/treks/kedarnath-dham/kedarnath-dham-view-of-kedarnath-temple.png",
  },
  {
    id: "kashmir",
    slug: "jammu-and-kashmir",
    region: "Jammu & Kashmir",
    img: "https://images.scoutripper.com/treks/kashmir-great-lake-trek/Kashmir Great Lakes-bg.png",
  },
  {
    id: "ladakh",
    slug: "ladakh",
    region: "Ladakh",
    img: "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp",
  },
  {
    id: "nepal",
    slug: "nepal",
    region: "Nepal",
    img: "https://images.scoutripper.com/treks/triund-trek/camps-in-triund.png",
  },
  {
    id: "ladakh2",
    slug: "ladakh",
    region: "Ladakh",
    img: "https://images.scoutripper.com/treks/kareri-lake-trek/kareri-lake-trek-summer.webp",
  },
  {
    id: "himachal2",
    slug: "himachal-pradesh",
    region: "Himachal Pradesh",
    img: "https://images.scoutripper.com/treks/hampta-pass-trek/beauty-of-hampta-pass-trek.jpg",
  },
];

export function Destinations() {
  return (
    <section className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeader
        title="Find Your Perfect Destination"
        subtitle="Explore specific regions for your next adventure"
        actionType="none"
      />

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 pt-4">
        {destinations.map((dest, index) => {
          // Top row items (first 3) get col-span-4, bottom row items (next 4) get col-span-3
          const isTopRow = index < 3;
          const spanClass = isTopRow ? "md:col-span-4" : "md:col-span-3";

          // Calculate height: top row might be slightly taller in the image, 
          // or they can all be the same height. Let's make top row somewhat taller.
          const heightClass = isTopRow ? "h-65 md:h-70" : "h-55 md:h-60";

          return (
            <Link
              href={`/location/${dest.slug}`}
              key={`${dest.id}-${index}`}
              className={`relative rounded-xl overflow-hidden group block col-span-1 border border-black/5 ${spanClass} ${heightClass}`}
            >
              <Image
                src={dest.img}
                alt={dest.region}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Dark overlay for text readability at the bottom */}
              <div className="absolute inset-x-0 bottom-0 h-[80%] bg-linear-to-t from-black/90 via-black/40 to-transparent" />

              {/* Content Box */}
              <div className="absolute inset-0 flex flex-row items-end justify-between p-4 md:p-6 pb-4">
                <div className="flex flex-col text-left max-w-[85%] relative z-10 transition-transform duration-300">
                  <span
                    className="text-primary text-xl md:text-2xl mb-1 drop-shadow-md"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                  >
                    Experience In
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white font-bricolage-grotesque drop-shadow-md mb-1 line-clamp-1">
                    {dest.region}
                  </h3>
                  <p className="text-white font-medium text-micro md:text-xs tracking-wider line-clamp-1 drop-shadow-md">
                    A Destination For All Seasons And All Reasons
                  </p>
                </div>

                {/* Arrow Button */}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl self-end mb-2 relative z-10 group-hover:-translate-x-1">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
