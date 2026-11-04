import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface PackageCardProps {
  slug: string;
  title: string;
  image: string;
  durationDays: number;
  distanceKm: number;
  maxAltitudeFt: number;
  rating: number;
  price: number;
  guideName: string;
  guideAvatarUrl: string;
  priority?: boolean;
  className?: string;
}

export function PackageCard({
  slug,
  title,
  image,
  durationDays,
  distanceKm,
  maxAltitudeFt,
  rating,
  price,
  guideName,
  guideAvatarUrl,
  priority,
  className,
}: PackageCardProps) {
  return (
    <Link
      href={`/trek/${slug}`}
      className={cn("group flex flex-col pb-2", className ? className : "w-full")}
    >
      <div className="relative w-full aspect-5/4 rounded-xl overflow-hidden mb-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />

        <button className="absolute group/wishlist top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary transition-colors z-10">
          <Heart className="w-4 h-4 group-hover/wishlist:fill-white transition-all duration-300" />
        </button>

        <div className="absolute bottom-3 left-3 bg-white rounded-md px-2 py-1 flex items-center gap-1 shadow-md z-10">
          <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
          <span className="text-xs font-bold text-foreground">{rating}</span>
        </div>
      </div>

      <div className="text-sm font-medium text-neutral-400 mb-1">
        {distanceKm} km • {durationDays} Days • {maxAltitudeFt.toLocaleString()} ft
      </div>

      <h3 className="text-lg font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2 min-h-[2lh]">
        {title}
      </h3>

      <div className="flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-6 rounded-full overflow-hidden relative shrink-0 bg-zinc-200">
            <Image src={guideAvatarUrl} alt={guideName} fill className="object-cover" />
          </div>
          <span className="text-sm font-semibold text-primary truncate">{guideName}</span>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-[11px] font-semibold text-zinc-400">Starting from</span>
          <span className="text-[15px] font-bold text-foreground">
            ₹{price.toLocaleString()}/trekker
          </span>
        </div>
      </div>
    </Link>
  );
}
