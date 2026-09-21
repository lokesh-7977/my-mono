import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrekCardProps {
  id: string;
  slug: string;
  title: string;
  image: string;
  location: string;
  durationDays: number;
  distanceKm: number;
  maxAltitudeFt: number;
  rating: number;
  price: number;
  oldPrice?: number;
  priority?: boolean;
  className?: string;
}

export function TrekCard({
  slug,
  title,
  image,
  location,
  durationDays,
  distanceKm,
  maxAltitudeFt,
  rating,
  price,
  oldPrice,
  priority,
  className,
}: TrekCardProps) {
  return (
    <Link href={`/treks/${slug}`}
      className={cn("group flex flex-col pb-2", className ? className : "w-full")}>
      {/* Image Container */}
      <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />

        {/* Favorite Button */}
        <button className="absolute group/wishlist top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors z-10">
          <Heart className="w-4 h-4 group-hover/wishlist:fill-white transition-all duration-300" />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white rounded-md px-2 py-1 flex items-center gap-1 shadow-md z-10">
          <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
          <span className="text-xs font-bold text-foreground">{rating}</span>
        </div>
      </div>

      {/* Meta Info */}
      <div className="text-sm font-medium text-neutral-400 mb-1">
        {distanceKm} km • {durationDays} Days • {maxAltitudeFt.toLocaleString()} ft
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
        {title}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-1.5 mb-4">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        <span className="text-[13px] font-medium text-primary">{location}</span>
      </div>

      {/* Bottom Row / Pricing */}
      <div className="flex items-center justify-between mt-auto">
        {/* Social Proof (Dummy Avatars for UI parity) */}
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-200 overflow-hidden relative">
              <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" fill className="object-cover" />
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex flex-col items-end text-zinc-800">
          <span className="text-[11px] font-semibold text-zinc-400">Starting from</span>
          <div className="flex items-center gap-1.5">
            {oldPrice && (
              <span className="text-xs font-semibold text-red-500 line-through">
                ₹{oldPrice.toLocaleString()}/-
              </span>
            )}
            <span className="text-[15px] font-bold text-foreground">
              ₹{price.toLocaleString()}/-
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
