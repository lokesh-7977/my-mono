import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { CarouselSection } from "@/components/shared/carousel-section";
import type { NearbyPlace } from "@/lib/nearby-places-mock";

interface NearbyPlacesProps {
  places: NearbyPlace[];
}

export function NearbyPlaces({ places }: NearbyPlacesProps) {
  if (places.length === 0) {
    return null;
  }

  return (
    <CarouselSection
      title="Nearby Places to Visit"
      subtitle="Handpicked Treks for the Ultimate Experience"
      scrollAmount={280}
    >
      {places.map((place) => (
        <div
          key={place.id}
          className="group flex flex-col shrink-0 snap-start w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]"
        >
          <div className="relative w-full aspect-8/7 rounded-xl overflow-hidden mb-3">
            <Image
              src={place.image}
              alt={place.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <div className="absolute bottom-3 left-3 bg-white rounded-md px-2 py-1 flex items-center gap-1 shadow-md">
              <Star className="size-3.5 fill-[#FFB800] text-[#FFB800]" />
              <span className="text-xs font-bold text-foreground">{place.rating}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-foreground mb-1">{place.name}</h3>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary" />
            <span className="text-meta font-medium text-primary">{place.location}</span>
          </div>
        </div>
      ))}
    </CarouselSection>
  );
}
